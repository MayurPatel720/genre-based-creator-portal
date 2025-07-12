
const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
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

// Remove duplicate index warning by using schema.index() instead of unique: true
locationSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Location", locationSchema);
