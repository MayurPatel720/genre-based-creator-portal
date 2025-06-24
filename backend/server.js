require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const { dbConnect } = require("./Configs/dbConnect");

// Middleware setup
const allowedOrigins = [
	"http://localhost:8080",
	"https://lovable.dev/projects/f9d440f6-e552-4080-9d03-1bdf75980bbe",
	// Add your Vercel frontend URL here after deployment
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

// Routes
app.get("/", (req, res) => {
	res.send("Welcome to the Genre-Based Creator Portal!");
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
