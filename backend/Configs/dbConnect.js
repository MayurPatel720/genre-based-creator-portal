const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URL;

if (!MONGODB_URI) {
	throw new Error(
		"❌ Please define the MONGODB_URL environment variable inside .env"
	);
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGODB_URI, {
				// No longer needed: useNewUrlParser, useUnifiedTopology
				serverSelectionTimeoutMS: 5000,
			})
			.then((mongoose) => {
				console.log("✅ MongoDB connected successfully");
				return mongoose;
			})
			.catch((err) => {
				console.error("❌ MongoDB connection error:", err);
				throw err;
			});
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

module.exports = { dbConnect };
