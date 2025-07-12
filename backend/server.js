const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log(err));

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
