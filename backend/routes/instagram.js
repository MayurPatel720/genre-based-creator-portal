
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get Instagram user media
router.get('/user/:username/media', async (req, res) => {
    try {
        const { username } = req.params;
        const { access_token } = req.query;

        if (!access_token) {
            return res.status(400).json({ 
                error: 'Access token is required for Instagram API' 
            });
        }

        // First get user ID from username (requires additional API calls)
        // This is a simplified version - full implementation would require proper Instagram API setup
        
        const response = await axios.get(`https://graph.instagram.com/me/media`, {
            params: {
                fields: 'id,media_type,media_url,thumbnail_url,caption,permalink,timestamp',
                access_token: access_token
            }
        });

        res.json({
            success: true,
            data: response.data.data || []
        });
        
    } catch (error) {
        console.error('Instagram API error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to fetch Instagram media',
            details: error.response?.data || error.message
        });
    }
});

// Get Instagram user profile
router.get('/user/:username/profile', async (req, res) => {
    try {
        const { access_token } = req.query;

        if (!access_token) {
            return res.status(400).json({ 
                error: 'Access token is required for Instagram API' 
            });
        }

        const response = await axios.get(`https://graph.instagram.com/me`, {
            params: {
                fields: 'id,username,account_type,media_count',
                access_token: access_token
            }
        });

        res.json({
            success: true,
            data: response.data
        });
        
    } catch (error) {
        console.error('Instagram API error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to fetch Instagram profile',
            details: error.response?.data || error.message
        });
    }
});

module.exports = router;
