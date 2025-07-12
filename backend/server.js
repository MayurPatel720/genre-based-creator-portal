
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { dbConnect } = require("./Configs/dbConnect");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection using our dbConnect function
dbConnect().catch(err => {
	console.error("Failed to connect to MongoDB:", err);
	process.exit(1);
});

const creatorRoutes = require("./routes/creators");
const uploadRoutes = require("./routes/upload");
const csvRoutes = require("./routes/csv");
const mediaRoutes = require("./routes/media");
const locationRoutes = require("./routes/locations");

// Routes
app.use("/api/creators", creatorRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/csv", csvRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/locations", locationRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
	// Set static folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
