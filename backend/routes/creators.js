
const express = require('express');
const router = express.Router();
const Creator = require('../models/Creator');

// Debug middleware
router.use((req, res, next) => {
    console.log(`Creators route: ${req.method} ${req.url}`);
    next();
});

// GET /api/creators - Get all creators or filter by genre
router.get('/', async (req, res) => {
    try {
        const { genre } = req.query;
        console.log('Fetching creators, genre filter:', genre);
        
        let query = {};
        if (genre && genre !== 'all') {
            query.genre = new RegExp(genre, 'i');
        }
        
        const creators = await Creator.find(query).sort({ createdAt: -1 });
        console.log(`Found ${creators.length} creators`);
        res.json(creators);
    } catch (error) {
        console.error('Error fetching creators:', error);
        res.status(500).json({ error: 'Failed to fetch creators' });
    }
});

// POST /api/creators - Create new creator
router.post('/', async (req, res) => {
    try {
        console.log('Creating new creator:', req.body);
        const creator = new Creator(req.body);
        const savedCreator = await creator.save();
        console.log('Creator created successfully:', savedCreator._id);
        res.status(201).json(savedCreator);
    } catch (error) {
        console.error('Error creating creator:', error);
        res.status(400).json({ error: 'Failed to create creator', details: error.message });
    }
});

// GET /api/creators/:id - Get creator by ID
router.get('/:id', async (req, res) => {
    try {
        console.log('Fetching creator by ID:', req.params.id);
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

// PUT /api/creators/:id - Update creator
router.put('/:id', async (req, res) => {
    try {
        console.log('Updating creator:', req.params.id, req.body);
        const creator = await Creator.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!creator) {
            return res.status(404).json({ error: 'Creator not found' });
        }
        
        console.log('Creator updated successfully');
        res.json(creator);
    } catch (error) {
        console.error('Error updating creator:', error);
        res.status(400).json({ error: 'Failed to update creator', details: error.message });
    }
});

// DELETE /api/creators/:id - Delete creator
router.delete('/:id', async (req, res) => {
    try {
        console.log('Deleting creator:', req.params.id);
        const creator = await Creator.findByIdAndDelete(req.params.id);
        
        if (!creator) {
            return res.status(404).json({ error: 'Creator not found' });
        }
        
        console.log('Creator deleted successfully');
        res.json({ message: 'Creator deleted successfully' });
    } catch (error) {
        console.error('Error deleting creator:', error);
        res.status(500).json({ error: 'Failed to delete creator' });
    }
});

// GET /api/creators/:id/reels - Get creator's reels
router.get('/:id/reels', async (req, res) => {
    try {
        console.log('Fetching reels for creator:', req.params.id);
        const creator = await Creator.findById(req.params.id);
        
        if (!creator) {
            return res.status(404).json({ error: 'Creator not found' });
        }
        
        res.json(creator.details.reels || []);
    } catch (error) {
        console.error('Error fetching reels:', error);
        res.status(500).json({ error: 'Failed to fetch reels' });
    }
});

module.exports = router;
