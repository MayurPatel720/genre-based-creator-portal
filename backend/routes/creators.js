const express = require('express');
const router = express.Router();
const Creator = require('../models/Creator');

// GET /api/creators - Get all creators
router.get('/', async (req, res) => {
  try {
    const creators = await Creator.find();
    res.json(creators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/creators/:id - Get a specific creator by ID
router.get('/:id', async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id);
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    res.json(creator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/creators - Create a new creator
router.post('/', async (req, res) => {
  try {
    console.log('Creating creator with data:', req.body);
    
    // Extract cloudinary public_id from avatar URL if present
    let cloudinary_public_id = null;
    if (req.body.avatar) {
      const urlParts = req.body.avatar.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicIdParts = urlParts.slice(-2); // Get folder/filename
      cloudinary_public_id = publicIdParts.join('/').split('.')[0]; // Remove extension
    }
    
    const creator = new Creator({
      ...req.body,
      cloudinary_public_id
    });
    
    const savedCreator = await creator.save();
    console.log('Creator created successfully:', savedCreator._id);
    res.status(201).json(savedCreator);
  } catch (error) {
    console.error('Error creating creator:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/creators/:id - Update a creator
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating creator:', req.params.id, 'with data:', req.body);
    
    const updateData = { ...req.body };
    
    // Extract cloudinary public_id from avatar URL if avatar is being updated
    if (req.body.avatar) {
      const urlParts = req.body.avatar.split('/');
      const filename = urlParts[urlParts.length - 1];
      const publicIdParts = urlParts.slice(-2); // Get folder/filename
      updateData.cloudinary_public_id = publicIdParts.join('/').split('.')[0]; // Remove extension
    }
    
    const updatedCreator = await Creator.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedCreator) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    
    console.log('Creator updated successfully:', updatedCreator._id);
    res.json(updatedCreator);
  } catch (error) {
    console.error('Error updating creator:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/creators/:id - Delete a creator
router.delete('/:id', async (req, res) => {
  try {
    const creator = await Creator.findByIdAndDelete(req.params.id);
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    res.json({ message: 'Creator deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
