
const mongoose = require("mongoose");

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
    required: true,
    trim: true
  },
  details: {
    bio: {
      type: String,
      required: true,
      trim: true
    },
    analytics: {
      followers: {
        type: Number,
        required: true,
        min: 0
      },
      engagement: {
        type: String,
        required: true,
        trim: true
      },
      totalViews: {
        type: Number,
        required: true,
        min: 0
      }
    },
    reels: [{
      type: String,
      trim: true
    }],
    pricing: {
      type: String,
      required: true,
      trim: true
    },
    tags: [{
      type: String,
      trim: true
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Creator", creatorSchema);
