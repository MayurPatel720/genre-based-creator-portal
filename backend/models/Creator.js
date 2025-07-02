
const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
		enum: ["image", "video"],
	},
	url: {
		type: String,
		required: true,
		trim: true,
	},
	thumbnail: {
		type: String,
		trim: true,
	},
	caption: {
		type: String,
		trim: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

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
				averageViews: {
					type: Number,
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
			tags: [
				{
					type: String,
					trim: true,
				},
			],
			media: [mediaSchema],
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Creator", creatorSchema);
