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
router.post('/:creatorId', upload.single('file'), async (req, res) => {
  try {
    const { creatorId } = req.params;
    const { caption } = req.body;

    console.log('Upload request received for creator:', creatorId);
    console.log('File info:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: 'Media file is required' });
    }

    const creator = await Creator.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    // Determine media type based on mimetype and URL
    let mediaType = 'image';
    if (req.file.mimetype && req.file.mimetype.startsWith('video/')) {
      mediaType = 'video';
    } else if (req.file.path && req.file.path.includes('/video/upload/')) {
      mediaType = 'video';
    }

    console.log('Detected media type:', mediaType, 'from mimetype:', req.file.mimetype);

    // Create media object with proper structure
    const mediaFile = {
      id: req.file.public_id || req.file.filename || `media_${Date.now()}`,
      type: mediaType,
      url: req.file.path || req.file.secure_url,
      thumbnail: mediaType === 'video' ? 
        (req.file.path || req.file.secure_url).replace(/\.[^/.]+$/, '.jpg') : 
        (req.file.path || req.file.secure_url),
      caption: caption || '',
      createdAt: new Date(),
    };

    console.log('Created media object:', mediaFile);

    // Initialize media array if it doesn't exist
    if (!creator.details.media) {
      creator.details.media = [];
    }
    
    creator.details.media.push(mediaFile);
    
    await creator.save();

    console.log('Media added successfully');
    res.status(201).json(mediaFile);
  } catch (error) {
    console.error('Error adding media:', error);
    res.status(500).json({ error: 'Failed to add media', details: error.message });
  }
});

// DELETE /api/media/:creatorId/:mediaId - Remove media from creator
router.delete('/:creatorId/:mediaId', async (req, res) => {
  try {
    const { creatorId, mediaId } = req.params;
    
    // Decode the media ID to handle encoded special characters
    const decodedMediaId = decodeURIComponent(mediaId);
    
    console.log('Delete request for creator:', creatorId, 'media:', decodedMediaId);
    console.log('Original mediaId param:', mediaId);

    const creator = await Creator.findById(creatorId);
    if (!creator) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    // Initialize media array if it doesn't exist
    if (!creator.details.media) {
      creator.details.media = [];
      return res.status(404).json({ error: 'Media not found' });
    }

    // Find the media item to delete
    const mediaToDelete = creator.details.media.find(media => media.id === decodedMediaId);
    
    if (!mediaToDelete) {
      console.log('Media not found in creator media array:', decodedMediaId);
      console.log('Available media IDs:', creator.details.media.map(m => m.id));
      return res.status(404).json({ error: 'Media not found' });
    }

    // Remove from creator's media array
    const originalLength = creator.details.media.length;
    creator.details.media = creator.details.media.filter(
      media => media.id !== decodedMediaId
    );
    
    // Verify the media was actually removed
    if (creator.details.media.length === originalLength) {
      console.log('Media was not removed from array');
      return res.status(500).json({ error: 'Failed to remove media from database' });
    }
    
    await creator.save();
    console.log('Media removed from database successfully');

    // Delete from Cloudinary
    try {
      console.log('Attempting to delete from Cloudinary:', decodedMediaId);
      const cloudinaryResult = await cloudinary.uploader.destroy(decodedMediaId);
      console.log('Cloudinary deletion result:', cloudinaryResult);
      
      if (cloudinaryResult.result !== 'ok' && cloudinaryResult.result !== 'not found') {
        console.warn('Cloudinary deletion may have failed:', cloudinaryResult);
      }
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Don't fail the whole operation if Cloudinary deletion fails
    }

    console.log('Media deleted successfully');
    res.json({ 
      message: 'Media deleted successfully',
      deletedMediaId: decodedMediaId
    });
  } catch (error) {
    console.error('Error deleting media:', error);
    res.status(500).json({ error: 'Failed to delete media', details: error.message });
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
