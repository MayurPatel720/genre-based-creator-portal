require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { dbConnect } = require("./Configs/dbConnect");

const app = express();

// ✅ CORS setup
const allowedOrigins = [
	"http://localhost:8080",
	"https://creatorsdreams.in",
	"https://amancreatorhub.web.app",
	"https://genre-based-creator-portal.vercel.app",
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
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Health Check
app.get("/", (req, res) => {
	res.send("✅ Server is running: Genre-Based Creator Portal Backend!");
});

// ✅ Health/Ping endpoint for keep-alive
app.get("/api/health", (req, res) => {
	const uptime = process.uptime();
	const timestamp = new Date().toISOString();
	res.json({
		status: "healthy",
		timestamp,
		uptime: `${Math.floor(uptime / 60)} minutes ${Math.floor(uptime % 60)} seconds`,
		message: "Server is alive and running"
	});
});

// ✅ Routes
const creatorRoutes = require("./routes/creators");
const uploadRoutes = require("./routes/upload");
const instagramRoutes = require("./routes/instagram");
const mediaRoutes = require("./routes/media");

app.use("/api/creators", creatorRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/instagram", instagramRoutes);
app.use("/api/locations", require("./routes/locations"));
app.use("/api/csv", require("./routes/csv"));
app.use("/api/media", mediaRoutes);

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
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
			
			// ✅ Keep-alive mechanism for Render deployment
			const keepAlive = async () => {
				try {
					const serverUrl = process.env.RENDER_URL || `http://localhost:${PORT}`;
					const response = await axios.get(`${serverUrl}/api/health`, {
						timeout: 30000,
						headers: { 'User-Agent': 'KeepAlive-Bot' }
					});
					console.log(`✅ Keep-alive ping successful at ${new Date().toLocaleString()}`);
					console.log(`📊 Server status: ${response.data.status}, Uptime: ${response.data.uptime}`);
				} catch (error) {
					console.error(`❌ Keep-alive ping failed:`, error.message);
					// Retry logic - try again in 1 minute if failed
					setTimeout(keepAlive, 60000);
				}
			};

			// Only run keep-alive in production (Render) or when RENDER_URL is set
			if (process.env.NODE_ENV === 'production' || process.env.RENDER_URL) {
				console.log("🔄 Keep-alive mechanism activated for production deployment");
				// Initial ping after 1 minute
				setTimeout(keepAlive, 60000);
				// Then ping every 5 minutes
				setInterval(keepAlive, 5 * 60 * 1000);
			} else {
				console.log("🏠 Development mode - keep-alive disabled");
			}
		});
	} catch (err) {
		console.error("🔥 Server failed to start:", err.message);
		process.exit(1);
	}
};

startServer();

module.exports = app;
