
require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const { dbConnect } = require("./Configs/dbConnect");

// Middleware setup
const allowedOrigins = [
	"http://localhost:8080",
	"https://lovable.dev",
	"https://genre-based-creator-portal.vercel.app",
	// Add your Vercel frontend URL here after deployment
];

const corsOptions = {
	origin: (origin, callback) => {
		// Allow requests with no origin (like mobile apps or curl requests)
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

// Import routes
const creatorRoutes = require("./routes/creators");

// Routes
app.get("/", (req, res) => {
	res.send("Welcome to the Genre-Based Creator Portal!");
});

// API Routes
app.use("/api/creators", creatorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something went wrong!" });
});

// Database connection and server start
const startServer = async () => {
	try {
		await dbConnect();
		console.log("Database connected successfully");

		// Only start the server locally, not on Vercel
		if (process.env.NODE_ENV !== "production") {
			app.listen(3000, () => {
				console.log("🚀 Server is running at http://localhost:3000");
			});
		}
	} catch (err) {
		console.error("🔥 Server failed to start:", err.message);
		process.exit(1);
	}
};

// Start the server
startServer();

module.exports = app;
