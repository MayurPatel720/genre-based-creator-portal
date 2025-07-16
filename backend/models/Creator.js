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
			// required: true,
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
		phoneNumber: {
			type: String,
			trim: true,
		},
		mediaKit: {
			type: String,
			trim: true,
			validate: {
				validator: function (v) {
					return !v || /^https?:\/\/.+/i.test(v);
				},
				message: "Media kit must be a valid URL",
			},
		},
		details: {
			bio: {
				type: String,
				// required: true,
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
			},
			reels: [
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
