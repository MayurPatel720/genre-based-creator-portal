
const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Debug middleware
router.use((req, res, next) => {
    console.log(`Upload route: ${req.method} ${req.url}`);
    next();
});

// Upload image to Cloudinary
router.post('/image', upload.single('image'), async (req, res) => {
    try {
        console.log('Image upload request received');
        console.log('File:', req.file);
        
        if (!req.file) {
            console.log('No image file provided');
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Convert buffer to base64
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        console.log('Uploading to Cloudinary...');
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(fileStr, {
            folder: 'creator-avatars',
            transformation: [
                { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
                { quality: 'auto', fetch_format: 'auto' }
            ]
        });

        console.log('Upload successful:', uploadResult.public_id);
        res.json({
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ error: 'Failed to upload image', details: error.message });
    }
});

// Delete image from Cloudinary
router.delete('/image/:publicId', async (req, res) => {
    try {
        console.log('Image deletion request received for:', req.params.publicId);
        const { publicId } = req.params;
        const result = await cloudinary.uploader.destroy(publicId);
        
        console.log('Cloudinary deletion result:', result);
        if (result.result === 'ok') {
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(400).json({ error: 'Failed to delete image' });
        }
    } catch (error) {
        console.error('Image deletion error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Upload routes are working!' });
});

module.exports = router;
