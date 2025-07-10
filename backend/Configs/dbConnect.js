
const mongoose = require("mongoose");

const dbConnect = async () => {
	try {
		const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/creator-portal";
		console.log("Connecting to MongoDB:", mongoURI.replace(/:[^:@]*@/, ':****@'));
		
		await mongoose.connect(mongoURI);
		
		console.log("✅ MongoDB connected successfully");
		
		// Log connection events
		mongoose.connection.on('error', (err) => {
			console.error('MongoDB connection error:', err);
		});
		
		mongoose.connection.on('disconnected', () => {
			console.log('MongoDB disconnected');
		});
		
	} catch (error) {
		console.error("❌ MongoDB connection failed:", error.message);
		throw error;
	}
};

module.exports = { dbConnect };
