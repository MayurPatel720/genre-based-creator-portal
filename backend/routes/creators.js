
const express = require("express");
const router = express.Router();
const Creator = require("../models/Creator");

// GET /api/creators - Get all creators
router.get("/", async (req, res) => {
  try {
    const { genre } = req.query;
    
    let query = {};
    if (genre && genre !== "All Creators") {
      query.genre = genre;
    }
    
    const creators = await Creator.find(query);
    
    // Transform data to match frontend interface
    const transformedCreators = creators.map(creator => ({
      id: creator._id.toString(),
      name: creator.name,
      genre: creator.genre,
      avatar: creator.avatar,
      details: creator.details
    }));
    
    res.json(transformedCreators);
  } catch (error) {
    console.error("Error fetching creators:", error);
    res.status(500).json({ error: "Failed to fetch creators" });
  }
});

// GET /api/creators/:id - Get creator by ID
router.get("/:id", async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id);
    
    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }
    
    // Transform data to match frontend interface
    const transformedCreator = {
      id: creator._id.toString(),
      name: creator.name,
      genre: creator.genre,
      avatar: creator.avatar,
      details: creator.details
    };
    
    res.json(transformedCreator);
  } catch (error) {
    console.error("Error fetching creator:", error);
    res.status(500).json({ error: "Failed to fetch creator" });
  }
});

// POST /api/creators - Create new creator
router.post("/", async (req, res) => {
  try {
    const creator = new Creator(req.body);
    await creator.save();
    
    // Transform data to match frontend interface
    const transformedCreator = {
      id: creator._id.toString(),
      name: creator.name,
      genre: creator.genre,
      avatar: creator.avatar,
      details: creator.details
    };
    
    res.status(201).json(transformedCreator);
  } catch (error) {
    console.error("Error creating creator:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to create creator" });
    }
  }
});

// PUT /api/creators/:id - Update creator
router.put("/:id", async (req, res) => {
  try {
    const creator = await Creator.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }
    
    // Transform data to match frontend interface
    const transformedCreator = {
      id: creator._id.toString(),
      name: creator.name,
      genre: creator.genre,
      avatar: creator.avatar,
      details: creator.details
    };
    
    res.json(transformedCreator);
  } catch (error) {
    console.error("Error updating creator:", error);
    if (error.name === "ValidationError") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Failed to update creator" });
    }
  }
});

// DELETE /api/creators/:id - Delete creator
router.delete("/:id", async (req, res) => {
  try {
    const creator = await Creator.findByIdAndDelete(req.params.id);
    
    if (!creator) {
      return res.status(404).json({ error: "Creator not found" });
    }
    
    res.json({ message: "Creator deleted successfully" });
  } catch (error) {
    console.error("Error deleting creator:", error);
    res.status(500).json({ error: "Failed to delete creator" });
  }
});

module.exports = router;
