require("dotenv").config({ path: "./.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const { dbConnect } = require("./Configs/dbConnect");

const startServer = async () => {
	try {
		await dbConnect();

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

		app.get("/", (req, res) => {
			res.send("Welcome to the Genre-Based Creator Portal!");
		});

		app.listen(3000, () => {
			console.log("🚀 Server is running at http://localhost:3000");
		});
	} catch (err) {
		console.error("🔥 Server failed to start:", err.message);
		process.exit(1);
	}
};

startServer();
module.exports = app;
