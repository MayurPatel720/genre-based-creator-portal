
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const { Readable } = require('stream');
const Creator = require('../models/Creator');

// Configure multer for CSV file upload
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Debug middleware
router.use((req, res, next) => {
    console.log(`CSV route: ${req.method} ${req.url}`);
    next();
});

// POST /api/csv/import - CSV Import endpoint
router.post('/import', upload.single('csvFile'), async (req, res) => {
    try {
        console.log('CSV import request received');
        
        if (!req.file) {
            return res.status(400).json({ error: 'No CSV file provided' });
        }

        const results = [];
        const errors = [];
        
        // Create readable stream from buffer
        const stream = Readable.from(req.file.buffer.toString());
        
        // Parse CSV
        const parsePromise = new Promise((resolve, reject) => {
            stream
                .pipe(csv())
                .on('data', (data) => {
                    results.push(data);
                })
                .on('end', () => {
                    resolve(results);
                })
                .on('error', reject);
        });

        const csvData = await parsePromise;
        console.log(`Parsed ${csvData.length} rows from CSV`);

        const createdCreators = [];

        // Process each row
        for (let i = 0; i < csvData.length; i++) {
            try {
                const row = csvData[i];
                
                // Map CSV columns to Creator schema - handle various field names
                const creatorData = {
                    name: row.name || row.Name || row.creator_name || row['Creator Name'] || '',
                    genre: row.genre || row.Genre || row.category || row.Category || 'Other',
                    avatar: row.avatar || row.Avatar || row.image || row.Image || 'https://via.placeholder.com/400x400?text=Avatar',
                    platform: row.platform || row.Platform || row.social_platform || row['Social Platform'] || 'Instagram',
                    socialLink: row.socialLink || row.SocialLink || row.social_link || row['Social Link'] || row.link || row.Link || '',
                    location: row.location || row.Location || row.city || row.City || 'Other',
                    phoneNumber: row.phoneNumber || row.PhoneNumber || row.phone_number || row['Phone Number'] || row.phone || row.Phone || '',
                    mediaKit: row.mediaKit || row.MediaKit || row.media_kit || row['Media Kit'] || row.mediakit || '',
                    details: {
                        bio: row.bio || row.Bio || row.description || row.Description || row.about || row.About || '',
                        location: row.location || row.Location || row.city || row.City || 'Other',
                        analytics: {
                            followers: parseInt(row.followers || row.Followers || row.subscriber_count || row['Subscriber Count'] || 0),
                            totalViews: parseInt(row.totalViews || row.TotalViews || row.total_views || row['Total Views'] || row.views || row.Views || 0),
                            averageViews: parseInt(row.averageViews || row.AverageViews || row.average_views || row['Average Views'] || row.avg_views || 0)
                        },
                        reels: []
                    }
                };

                // Validate required fields
                if (!creatorData.name.trim()) {
                    errors.push(`Row ${i + 1}: Name is required`);
                    continue;
                }

                if (!creatorData.socialLink.trim()) {
                    errors.push(`Row ${i + 1}: Social link is required`);
                    continue;
                }

                // Create creator
                const creator = new Creator(creatorData);
                const savedCreator = await creator.save();
                createdCreators.push(savedCreator);
                console.log(`Created creator: ${creatorData.name}`);
                
            } catch (error) {
                errors.push(`Row ${i + 1}: ${error.message}`);
                console.error(`Error processing row ${i + 1}:`, error);
            }
        }

        console.log(`Successfully created ${createdCreators.length} creators`);
        
        res.json({
            message: 'CSV import completed',
            success: true,
            created: createdCreators.length,
            errors: errors.length,
            data: {
                createdCreators: createdCreators,
                errors: errors
            }
        });

    } catch (error) {
        console.error('CSV import error:', error);
        res.status(500).json({ 
            error: 'Failed to import CSV', 
            details: error.message 
        });
    }
});

// GET /api/csv/template - Get CSV template
router.get('/template', (req, res) => {
    const csvTemplate = `name,genre,avatar,platform,socialLink,location,phoneNumber,mediaKit,bio,followers,totalViews,averageViews
John Doe,Comedy,https://example.com/avatar.jpg,Instagram,https://instagram.com/johndoe,Mumbai,+919876543210,https://example.com/mediakit.pdf,Comedian and content creator,10000,50000,5000
Jane Smith,Fashion,https://example.com/avatar2.jpg,YouTube,https://youtube.com/janesmith,Delhi,+919876543211,,Fashion influencer,25000,100000,8000`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=creators_template.csv');
    res.send(csvTemplate);
});

module.exports = router;
