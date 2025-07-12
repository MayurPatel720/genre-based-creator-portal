
const express = require("express");
const router = express.Router();
const Location = require("../models/Location");

// Get all active locations
router.get("/", async (req, res) => {
	try {
		const locations = await Location.find({ isActive: true })
			.sort({ isPredefined: -1, name: 1 })
			.select("name isPredefined");
		
		res.json(locations);
	} catch (error) {
		console.error("Error fetching locations:", error);
		res.status(500).json({ error: "Failed to fetch locations" });
	}
});

// Get predefined locations for admin dropdown
router.get("/predefined", async (req, res) => {
	try {
		const locations = await Location.find({ 
			isPredefined: true, 
			isActive: true 
		})
			.sort({ name: 1 })
			.select("name");
		
		res.json(locations);
	} catch (error) {
		console.error("Error fetching predefined locations:", error);
		res.status(500).json({ error: "Failed to fetch predefined locations" });
	}
});

// Get distinct locations from creators (for filtering)
router.get("/distinct", async (req, res) => {
	try {
		const Creator = require("../models/Creator");
		
		// Get all unique locations from creators
		const creatorLocations = await Creator.distinct("location", {
			location: { $exists: true, $ne: "" }
		});
		
		// Also get all active locations from Location model
		const allLocations = await Location.find({ isActive: true })
			.select("name")
			.lean();
		
		// Combine and deduplicate
		const locationSet = new Set([
			...creatorLocations,
			...allLocations.map(loc => loc.name)
		]);
		
		const distinctLocations = Array.from(locationSet)
			.filter(loc => loc && loc.trim().length > 0)
			.sort();
		
		res.json(distinctLocations);
	} catch (error) {
		console.error("Error fetching distinct locations:", error);
		res.status(500).json({ error: "Failed to fetch distinct locations" });
	}
});

// Add new predefined location (admin only)
router.post("/predefined", async (req, res) => {
	try {
		const { name } = req.body;
		
		if (!name || !name.trim()) {
			return res.status(400).json({ error: "Location name is required" });
		}
		
		const trimmedName = name.trim();
		
		// Check if location already exists
		const existingLocation = await Location.findOne({ 
			name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
		});
		
		if (existingLocation) {
			return res.status(400).json({ error: "Location already exists" });
		}
		
		const location = new Location({
			name: trimmedName,
			isPredefined: true,
			createdBy: "admin"
		});
		
		await location.save();
		res.status(201).json(location);
	} catch (error) {
		console.error("Error adding predefined location:", error);
		res.status(500).json({ error: "Failed to add location" });
	}
});

// Add custom location (automatically called when creator is created with new location)
router.post("/custom", async (req, res) => {
	try {
		const { name } = req.body;
		
		if (!name || !name.trim()) {
			return res.status(400).json({ error: "Location name is required" });
		}
		
		const trimmedName = name.trim();
		
		// Check if location already exists
		const existingLocation = await Location.findOne({ 
			name: { $regex: new RegExp(`^${trimmedName}$`, 'i') }
		});
		
		if (existingLocation) {
			return res.json(existingLocation);
		}
		
		const location = new Location({
			name: trimmedName,
			isPredefined: false,
			createdBy: "admin"
		});
		
		await location.save();
		res.status(201).json(location);
	} catch (error) {
		console.error("Error adding custom location:", error);
		res.status(500).json({ error: "Failed to add custom location" });
	}
});

// Update predefined location
router.put("/predefined/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { name, isActive } = req.body;
		
		const updateData = {};
		if (name !== undefined) updateData.name = name.trim();
		if (isActive !== undefined) updateData.isActive = isActive;
		
		const location = await Location.findByIdAndUpdate(
			id,
			updateData,
			{ new: true, runValidators: true }
		);
		
		if (!location) {
			return res.status(404).json({ error: "Location not found" });
		}
		
		res.json(location);
	} catch (error) {
		console.error("Error updating location:", error);
		res.status(500).json({ error: "Failed to update location" });
	}
});

// Delete predefined location
router.delete("/predefined/:id", async (req, res) => {
	try {
		const { id } = req.params;
		
		const location = await Location.findByIdAndUpdate(
			id,
			{ isActive: false },
			{ new: true }
		);
		
		if (!location) {
			return res.status(404).json({ error: "Location not found" });
		}
		
		res.json({ message: "Location deactivated successfully" });
	} catch (error) {
		console.error("Error deleting location:", error);
		res.status(500).json({ error: "Failed to delete location" });
	}
});

module.exports = router;
