
const express = require("express");
const router = express.Router();
const Creator = require("../models/Creator");

// Get all creators (for admin - includes unapproved)
router.get("/admin/all", async (req, res) => {
	try {
		const creators = await Creator.find().sort({ createdAt: -1 });
		res.json(creators);
	} catch (error) {
		console.error("Error fetching all creators:", error);
		res.status(500).json({ message: "Failed to fetch creators" });
	}
});

// Get pending creators (unapproved)
router.get("/pending", async (req, res) => {
	try {
		const creators = await Creator.find({ isApproved: false }).sort({ createdAt: -1 });
		res.json(creators);
	} catch (error) {
		console.error("Error fetching pending creators:", error);
		res.status(500).json({ message: "Failed to fetch pending creators" });
	}
});

// Approve creator
router.patch("/:id/approve", async (req, res) => {
	try {
		const creator = await Creator.findByIdAndUpdate(
			req.params.id,
			{ isApproved: true },
			{ new: true }
		);
		
		if (!creator) {
			return res.status(404).json({ message: "Creator not found" });
		}
		
		res.json(creator);
	} catch (error) {
		console.error("Error approving creator:", error);
		res.status(500).json({ message: "Failed to approve creator" });
	}
});

// Reject/Unapprove creator
router.patch("/:id/reject", async (req, res) => {
	try {
		const creator = await Creator.findByIdAndUpdate(
			req.params.id,
			{ isApproved: false },
			{ new: true }
		);
		
		if (!creator) {
			return res.status(404).json({ message: "Creator not found" });
		}
		
		res.json(creator);
	} catch (error) {
		console.error("Error rejecting creator:", error);
		res.status(500).json({ message: "Failed to reject creator" });
	}
});

// Get all approved creators (for public website)
router.get("/", async (req, res) => {
	try {
		const { genre } = req.query;
		let query = { isApproved: true };
		
		if (genre && genre !== "All Creators") {
			query.genre = genre;
		}
		
		const creators = await Creator.find(query).sort({ createdAt: -1 });
		res.json(creators);
	} catch (error) {
		console.error("Error fetching creators:", error);
		res.status(500).json({ message: "Failed to fetch creators" });
	}
});

// Get creator by ID
router.get("/:id", async (req, res) => {
	try {
		const creator = await Creator.findById(req.params.id);
		if (!creator) {
			return res.status(404).json({ message: "Creator not found" });
		}
		res.json(creator);
	} catch (error) {
		console.error("Error fetching creator:", error);
		res.status(500).json({ message: "Failed to fetch creator" });
	}
});

// Create new creator (will be unapproved by default)
router.post("/", async (req, res) => {
	try {
		const creator = new Creator(req.body);
		const savedCreator = await creator.save();
		res.status(201).json(savedCreator);
	} catch (error) {
		console.error("Error creating creator:", error);
		res.status(500).json({ message: "Failed to create creator" });
	}
});

// Update creator
router.put("/:id", async (req, res) => {
	try {
		const creator = await Creator.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);
		if (!creator) {
			return res.status(404).json({ message: "Creator not found" });
		}
		res.json(creator);
	} catch (error) {
		console.error("Error updating creator:", error);
		res.status(500).json({ message: "Failed to update creator" });
	}
});

// Delete creator
router.delete("/:id", async (req, res) => {
	try {
		const creator = await Creator.findByIdAndDelete(req.params.id);
		if (!creator) {
			return res.status(404).json({ message: "Creator not found" });
		}
		res.json({ message: "Creator deleted successfully" });
	} catch (error) {
		console.error("Error deleting creator:", error);
		res.status(500).json({ message: "Failed to delete creator" });
	}
});

// Get creator's reels
router.get("/:id/reels", async (req, res) => {
	try {
		const creator = await Creator.findById(req.params.id);
		if (!creator) {
			return res.status(404).json({ message: "Creator not found" });
		}
		res.json(creator.details.reels || []);
	} catch (error) {
		console.error("Error fetching reels:", error);
		res.status(500).json({ message: "Failed to fetch reels" });
	}
});

module.exports = router;
