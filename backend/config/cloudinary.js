
const { v2: cloudinary } = require('cloudinary');

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ds7bybp6g',
    api_key: process.env.CLOUDINARY_API_KEY || '479575716779811',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'loVyfeOD3Ru9X-dmNJaa3c7WVO4'
});

module.exports = cloudinary;
