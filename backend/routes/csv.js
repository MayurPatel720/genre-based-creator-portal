
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const Creator = require('../models/Creator');
const cloudinary = require('../config/cloudinary');
const axios = require('axios');
const { handleCustomLocation } = require('../middleware/locationMiddleware');

// Configure multer for CSV file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    }
});

// Helper function to upload image from URL to Cloudinary
const uploadImageFromUrl = async (imageUrl) => {
    try {
        if (!imageUrl || !imageUrl.startsWith('http')) {
            return null;
        }

        const uploadResult = await cloudinary.uploader.upload(imageUrl, {
            folder: 'creator-avatars',
            transformation: [
                { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
                { quality: 'auto', fetch_format: 'auto' }
            ]
        });

        return {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id
        };
    } catch (error) {
        console.error('Error uploading image from URL:', error);
        return null;
    }
};

// Helper function to parse CSV data from buffer
const parseCSVBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const stream = require('stream');
        const readable = new stream.Readable();
        readable.push(buffer);
        readable.push(null);

        readable
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
};

// POST /api/csv/import - Import creators from CSV
router.post('/import', upload.single('csvFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'CSV file is required' });
        }

        console.log('Processing CSV file:', req.file.originalname);
        
        // Parse CSV data
        const csvData = await parseCSVBuffer(req.file.buffer);
        console.log(`Found ${csvData.length} rows in CSV`);

        const results = {
            successful: [],
            failed: [],
            total: csvData.length
        };

        // Process each row
        for (const [index, row] of csvData.entries()) {
            try {
                console.log(`Processing row ${index + 1}:`, row);

                // Handle image upload if image URL is provided
                let avatarData = null;
                if (row.avatar || row.image || row.imageUrl) {
                    const imageUrl = row.avatar || row.image || row.imageUrl;
                    console.log(`Uploading image from URL: ${imageUrl}`);
                    avatarData = await uploadImageFromUrl(imageUrl);
                }

                // Create creator data
                const creatorData = {
                    name: row.name || '',
                    genre: row.genre || '',
                    avatar: avatarData ? avatarData.url : '',
                    cloudinary_public_id: avatarData ? avatarData.public_id : '',
                    platform: row.platform || 'Other',
                    socialLink: row.socialLink || row.social_link || '',
                    location: row.location || 'Other',
                    phoneNumber: row.phoneNumber || row.phone_number || '',
                    mediaKit: row.mediaKit || row.media_kit || '',
                    details: {
                        bio: row.bio || '',
                        analytics: {
                            followers: parseInt(row.followers) || 0,
                            totalViews: parseInt(row.totalViews || row.total_views) || 0,
                            averageViews: parseInt(row.averageViews || row.average_views) || 0,
                        },
                        reels: row.reels ? row.reels.split(',').map(url => url.trim()) : [],
                    },
                };

                // Validate required fields
                if (!creatorData.name || !creatorData.socialLink) {
                    throw new Error('Name and Social Link are required fields');
                }

                // Create creator and handle custom location
                const creator = new Creator(creatorData);
                await handleCustomLocation(null, null, () => {}, creator);
                await creator.save();

                results.successful.push({
                    row: index + 1,
                    name: creatorData.name,
                    id: creator._id
                });

                console.log(`✅ Successfully created creator: ${creatorData.name}`);

            } catch (error) {
                console.error(`❌ Error processing row ${index + 1}:`, error.message);
                results.failed.push({
                    row: index + 1,
                    data: row,
                    error: error.message
                });
            }
        }

        console.log('CSV import completed:', results);

        res.json({
            message: 'CSV import completed',
            results
        });

    } catch (error) {
        console.error('CSV import error:', error);
        res.status(500).json({ 
            error: 'Failed to import CSV', 
            details: error.message 
        });
    }
});

// GET /api/csv/template - Download CSV template
router.get('/template', (req, res) => {
    const template = `name,genre,avatar,platform,socialLink,location,phoneNumber,mediaKit,bio,followers,totalViews,averageViews,reels
John Doe,Comedy,https://example.com/image.jpg,Instagram,https://instagram.com/johndoe,Mumbai,+91-9876543210,https://example.com/mediakit,Comedian and content creator,10000,50000,1000,"https://reel1.com,https://reel2.com"`;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=creator-template.csv');
    res.send(template);
});

module.exports = router;
