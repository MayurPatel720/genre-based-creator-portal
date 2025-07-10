
const mongoose = require('mongoose');

const creatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    genre: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/400x400?text=Avatar'
    },
    platform: {
        type: String,
        default: 'Instagram'
    },
    socialLink: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        default: 'Other'
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    mediaKit: {
        type: String,
        default: ''
    },
    details: {
        bio: {
            type: String,
            default: ''
        },
        location: {
            type: String,
            default: 'Other'
        },
        analytics: {
            followers: {
                type: Number,
                default: 0
            },
            totalViews: {
                type: Number,
                default: 0
            },
            averageViews: {
                type: Number,
                default: 0
            }
        },
        reels: {
            type: Array,
            default: []
        },
        media: {
            type: Array,
            default: []
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Creator', creatorSchema);
