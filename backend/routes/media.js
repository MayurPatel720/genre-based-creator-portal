
const express = require('express');
const router = express.Router();
const Creator = require('../models/Creator');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure multer for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'creator-media',
    resource_type: 'auto', // Supports both images and videos
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
  },
});

const upload = multer({ storage });

// POST /api/media/:creatorId - Add media to creator
router.post('/:creatorId', upload.single('media'), async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Media file is required' });
    }

    const creator = await Creator.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    const mediaFile = {
      id: req.file.public_id,
      type: req.file.resource_type === 'video' ? 'video' : 'image',
      url: req.file.secure_url,
      thumbnail: req.file.resource_type === 'video' ? 
        req.file.secure_url.replace(/\.[^/.]+$/, '.jpg') : req.file.secure_url,
      caption: caption || '',
      createdAt: new Date(),
    };

    // Initialize media array if it doesn't exist
    if (!creator.details.media) {
      creator.details.media = [];
    }
    
    creator.details.media.push(mediaFile);
    
    await creator.save();

    res.status(201).json(mediaFile);
  } catch (error) {
    console.error('Error adding media:', error);
    res.status(500).json({ error: 'Failed to add media' });
  }
});

// DELETE /api/media/:creatorId/:mediaId - Remove media from creator
router.delete('/:creatorId/:mediaId', async (req, res) => {
  try {
    const { creatorId, mediaId } = req.params;

    const creator = await Creator.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    creator.details.media = creator.details.media.filter(
      media => media.id !== mediaId
    );
    
    await creator.save();

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(mediaId);
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
    }

    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

// GET /api/media/:creatorId - Get all media for a creator
router.get('/:creatorId', async (req, res) => {
  try {
    const { creatorId } = req.params;

    const creator = await Creator.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    res.json(creator.details.media || []);
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: 'Failed to fetch media' });
  }
});

module.exports = router;
