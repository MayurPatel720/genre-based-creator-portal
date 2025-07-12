
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		isPredefined: {
			type: Boolean,
			default: false,
		},
		createdBy: {
			type: String,
			default: "user",
		},
	},
	{
		timestamps: true,
	}
);

// Create unique index - only use schema.index() to avoid duplicate warning
locationSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Location", locationSchema);
