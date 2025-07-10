
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

// Enhanced Morgan logging with custom format
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';
app.use(morgan(morganFormat));

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

// Debug middleware to log all requests
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
	if (req.body && Object.keys(req.body).length > 0) {
		console.log('Request Body:', JSON.stringify(req.body, null, 2));
	}
	next();
});

// ✅ Routes - Import routes properly
const creatorRoutes = require("./routes/creators");
const uploadRoutes = require("./routes/upload");
const csvRoutes = require("./routes/csv");

// Mount routes with proper paths
app.use("/api/creators", creatorRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/csv", csvRoutes);

// ✅ 404 handler for API routes
app.use("/api/*", (req, res) => {
	console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
	res.status(404).json({ 
		error: `Route ${req.method} ${req.originalUrl} not found`,
		availableRoutes: [
			"GET /api/creators",
			"POST /api/creators", 
			"GET /api/creators/:id",
			"PUT /api/creators/:id",
			"DELETE /api/creators/:id",
			"POST /api/upload/image",
			"DELETE /api/upload/image/:publicId",
			"POST /api/csv/import",
			"GET /api/csv/template"
		]
	});
});

// ✅ Error Handling Middleware
app.use((err, req, res, next) => {
	console.error("Server Error:", err.stack);
	res.status(500).json({ 
		error: "Something went wrong!",
		message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
	});
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
			console.log("  *    /api/csv - CSV import routes");
		});
	} catch (err) {
		console.error("🔥 Server failed to start:", err.message);
		process.exit(1);
	}
};

startServer();

module.exports = app;
