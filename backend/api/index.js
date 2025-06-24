const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const { dbConnect } = require("../Configs/dbConnect");
require("dotenv").config({ path: "../.env" }); // adjust path for Vercel

const app = express();

// ✅ CORS Setup
const allowedOrigins = [
	"http://localhost:8080",
	"https://lovable.dev/projects/f9d440f6-e552-4080-9d03-1bdf75980bbe",
];

const corsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Connect DB once at cold start (non-blocking)
(async () => {
	try {
		await dbConnect();
		console.log("✅ MongoDB connected (Vercel serverless)");
	} catch (err) {
		console.error("❌ MongoDB connection failed:", err.message);
	}
})();

// ✅ Sample route
app.get("/", (req, res) => {
	res.send("🎉 Welcome to the Genre-Based Creator Portal!");
});

// ✅ Export for Vercel serverless
module.exports = serverless(app);
