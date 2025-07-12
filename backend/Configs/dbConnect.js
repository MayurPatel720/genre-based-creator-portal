const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
	throw new Error("Missing MONGODB_URL in env");
}

let cached = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
	if (cached.conn) return cached.conn;

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGODB_URL, {
				serverSelectionTimeoutMS: 5000,
				bufferCommands: false,
			})
			.then((mongooseInstance) => {
				console.log("✅ MongoDB connected successfully");
				return mongooseInstance;
			})
			.catch((err) => {
				console.error("❌ MongoDB connection error:", err.message);
				throw err;
			});
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

module.exports = { dbConnect };
