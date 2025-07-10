
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer with cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'creator-portal',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Debug middleware
router.use((req, res, next) => {
    console.log(`Upload route: ${req.method} ${req.url}`);
    next();
});

// POST /api/upload/image - Upload image to Cloudinary
router.post('/image', upload.single('image'), async (req, res) => {
    try {
        console.log('Image upload request received');
        
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        console.log('File uploaded to Cloudinary:', req.file.path);
        
        res.json({
            url: req.file.path,
            publicId: req.file.filename,
            success: true
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ 
            error: 'Failed to upload image', 
            details: error.message 
        });
    }
});

// DELETE /api/upload/image/:publicId - Delete image from Cloudinary
router.delete('/image/:publicId', async (req, res) => {
    try {
        const { publicId } = req.params;
        console.log('Deleting image with public ID:', publicId);
        
        const result = await cloudinary.uploader.destroy(publicId);
        
        if (result.result === 'ok') {
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error('Image deletion error:', error);
        res.status(500).json({ 
            error: 'Failed to delete image', 
            details: error.message 
        });
    }
});

module.exports = router;
