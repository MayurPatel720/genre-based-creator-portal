
require("dotenv").config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const { dbConnect } = require("./Configs/dbConnect");

const app = express();

// ✅ CORS setup
const allowedOrigins = [
	"http://localhost:8080",
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

// ✅ Routes
const creatorRoutes = require("./routes/creators");
const uploadRoutes = require("./routes/upload");
const instagramRoutes = require("./routes/instagram");
const mediaRoutes = require("./routes/media");

app.use("/api/creators", creatorRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/instagram", instagramRoutes);
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

		// Render requires dynamic port binding
		const PORT = process.env.PORT || 3000;
		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
		});
	} catch (err) {
		console.error("🔥 Server failed to start:", err.message);
		process.exit(1);
	}
};

startServer();

module.exports = app;
