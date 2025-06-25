
const mongoose = require("mongoose");

const creatorSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		genre: {
			type: String,
			required: true,
			trim: true,
		},
		avatar: {
			type: String,
			required: true,
			trim: true,
		},
		cloudinary_public_id: {
			type: String,
			trim: true,
		},
		platform: {
			type: String,
			required: true,
			trim: true,
			enum: ["Instagram", "YouTube", "TikTok", "Twitter", "Other"],
		},
		socialLink: {
			type: String,
			required: true,
			trim: true,
			match: [/^https?:\/\/.+/i, "Please provide a valid URL"],
		},
		location: {
			type: String,
			trim: true,
			default: "Other",
		},
		details: {
			bio: {
				type: String,
				required: true,
				trim: true,
			},
			analytics: {
				followers: {
					type: Number,
					required: true,
					min: 0,
				},
				totalViews: {
					type: Number,
					required: true,
					min: 0,
				},
				engagement: {
					type: String,
					trim: true,
				},
			},
			reels: [
				{
					type: String,
					trim: true,
				},
			],
			pricing: {
				type: String,
				required: true,
				trim: true,
			},
			tags: [
				{
					type: String,
					trim: true,
				},
			],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Creator", creatorSchema);
