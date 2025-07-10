
require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const { dbConnect } = require("./Configs/dbConnect");
const morgan = require("morgan");

const app = express();

// ✅ CORS setup
const allowedOrigins = [
	"http://localhost:8080",
	"https://creatorsdreams.in",
	"https://amancreatorhub.web.app",
	"https://genre-based-creator-portal.vercel.app",
];
app.use(morgan("dev")); // 'dev' format logs concise output with method, URL, status, and response time
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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Health Check
app.get("/", (req, res) => {
	res.send("✅ Server is running: Genre-Based Creator Portal Backend!");
});

// ✅ Routes
const creatorRoutes = require("./routes/creators");
const uploadRoutes = require("./routes/upload");
const instagramRoutes = require("./routes/instagram");
const mediaRoutes = require("./routes/media");

// Debug middleware to log all requests
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url} - Body:`, req.body);
	next();
});

app.use("/api/creators", creatorRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/instagram", instagramRoutes);
app.use("/api/media", mediaRoutes);

// ✅ 404 handler for API routes
app.use("/api/*", (req, res) => {
	console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
	res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
	console.error("Server Error:", err.stack);
	res.status(500).json({ error: "Something went wrong!" });
});

// ✅ Connect to Database and Start Server
const startServer = async () => {
	try {
		await dbConnect();
		console.log("✅ Database connected successfully");

		const PORT = process.env.PORT || 3000;
		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
			console.log("📋 Available routes:");
			console.log("  GET  / - Health check");
			console.log("  *    /api/creators - Creator routes");
			console.log("  *    /api/upload - Upload routes");
			console.log("  *    /api/instagram - Instagram routes");
			console.log("  *    /api/media - Media routes");
			
			const runPeriodicTask = () => {
				console.log("⏱ Running scheduled task at", new Date().toLocaleString());
			};

			setInterval(runPeriodicTask, 5 * 60 * 1000);
		});
	} catch (err) {
		console.error("🔥 Server failed to start:", err.message);
		process.exit(1);
	}
};

startServer();

module.exports = app;
