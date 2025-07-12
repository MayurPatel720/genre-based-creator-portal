
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		isPredefined: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		createdBy: {
			type: String,
			enum: ["system", "admin"],
			default: "admin",
		},
	},
	{
		timestamps: true,
	}
);

// Index for faster queries
locationSchema.index({ name: 1 });
locationSchema.index({ isActive: 1 });

module.exports = mongoose.model("Location", locationSchema);
