
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], required: true },
  url: { type: String, required: true },
  thumbnail: String,
  caption: String,
  createdAt: { type: Date, default: Date.now }
});

const reelSchema = new mongoose.Schema({
  id: { type: String, required: true },
  url: { type: String, required: true },
  thumbnail: String,
  caption: String,
  createdAt: { type: Date, default: Date.now }
});

const analyticsSchema = new mongoose.Schema({
  followers: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
  averageViews: { type: Number, default: 0 }
});

const detailsSchema = new mongoose.Schema({
  bio: String,
  location: String,
  media: [mediaSchema],
  reels: [reelSchema],
  analytics: analyticsSchema
});

const creatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  platform: { type: String, required: true },
  genre: { type: String, required: true },
  location: { type: String, required: true },
  phoneNumber: String,
  socialLink: String,
  avatar: String,
  avatarPublicId: String, // Store Cloudinary public_id for deletion
  mediaKit: String,
  details: detailsSchema
}, {
  timestamps: true
});

module.exports = mongoose.model('Creator', creatorSchema);
