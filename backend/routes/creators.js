const express = require('express');
const Creator = require('../models/Creator');
const cloudinary = require('../config/cloudinary');

const router = express.Router();

// GET /api/creators/genres - Get all unique genres
router.get('/genres', async (req, res) => {
  try {
    const genres = await Creator.distinct('genre');
    res.json(genres.filter(Boolean).sort());
  } catch (error) {
    console.error('Error fetching genres:', error);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

// GET /api/creators - Get all creators with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, platform, genre, location, search } = req.query;
    const pageNumber = parseInt(page.toString(), 10);
    const limitNumber = parseInt(limit.toString(), 10);

    const filter = {};
    if (platform) filter.platform = platform;
    if (genre) filter.genre = genre;
    if (location) filter.location = location;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { platform: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const creators = await Creator.find(filter)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalCreators = await Creator.countDocuments(filter);

    res.json({
      creators,
      totalPages: Math.ceil(totalCreators / limitNumber),
      currentPage: pageNumber
    });
  } catch (error) {
    console.error('Error fetching creators:', error);
    res.status(500).json({ error: 'Failed to fetch creators' });
  }
});

// GET /api/creators/:id - Get a specific creator
router.get('/:id', async (req, res) => {
  try {
    const creator = await Creator.findById(req.params.id);
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }
    res.json(creator);
  } catch (error) {
    console.error('Error fetching creator:', error);
    res.status(500).json({ error: 'Failed to fetch creator' });
  }
});

// POST /api/creators - Create a new creator
router.post('/', async (req, res) => {
  try {
    const newCreator = new Creator(req.body);
    const savedCreator = await newCreator.save();
    res.status(201).json(savedCreator);
  } catch (error) {
    console.error('Error creating creator:', error);
    res.status(500).json({ error: 'Failed to create creator' });
  }
});

// PUT /api/creators/:id - Update a creator
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('Updating creator:', id, 'with data:', updateData);

    // Get the current creator to check for avatar changes
    const currentCreator = await Creator.findById(id);
    if (!currentCreator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    // If avatar is being updated and there's an old one, delete it from Cloudinary
    if (updateData.avatar && currentCreator.avatar && 
        updateData.avatar !== currentCreator.avatar && 
        currentCreator.avatarPublicId) {
      try {
        console.log('Deleting old avatar from Cloudinary:', currentCreator.avatarPublicId);
        await cloudinary.uploader.destroy(currentCreator.avatarPublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting old avatar from Cloudinary:', cloudinaryError);
        // Continue with update even if Cloudinary deletion fails
      }
    }

    const updatedCreator = await Creator.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    console.log('Creator updated successfully:', updatedCreator._id);
    res.json(updatedCreator);
  } catch (error) {
    console.error('Error updating creator:', error);
    res.status(500).json({ error: 'Failed to update creator' });
  }
});

// DELETE /api/creators/:id - Delete a creator
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get the current creator to check for avatar changes
    const currentCreator = await Creator.findById(id);
    if (!currentCreator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    // If creator has an avatar, delete it from Cloudinary
    if (currentCreator.avatar && currentCreator.avatarPublicId) {
      try {
        console.log('Deleting avatar from Cloudinary:', currentCreator.avatarPublicId);
        await cloudinary.uploader.destroy(currentCreator.avatarPublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting avatar from Cloudinary:', cloudinaryError);
        // Continue with deletion even if Cloudinary deletion fails
      }
    }

    await Creator.findByIdAndDelete(id);
    res.json({ message: 'Creator deleted successfully' });
  } catch (error) {
    console.error('Error deleting creator:', error);
    res.status(500).json({ error: 'Failed to delete creator' });
  }
});

module.exports = router;
