
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnect = require("./Configs/dbConnect");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection using our dbConnect function
dbConnect().catch((err) => {
	console.error("Failed to connect to MongoDB:", err);
	process.exit(1);
});

// Routes
app.use("/api/creators", require("./routes/creators"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/locations", require("./routes/locations"));
app.use("/api/csv", require("./routes/csv"));
app.use("/api/media", require("./routes/media"));

// Basic health check
app.get("/", (req, res) => {
	res.json({ message: "Creator Portal API is running!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use("*", (req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.listen(port, () => {
	console.log(`Server is running on port: ${port}`);
});
