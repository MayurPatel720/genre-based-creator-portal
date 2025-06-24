const express = require("express");
const router = express.Router();
const Creator = require("../models/Creator");
const axios = require("axios");

// GET /api/creators - Get all creators
router.get("/", async (req, res) => {
	try {
		const { genre } = req.query;
		let query = {};
		if (genre && genre !== "All Creators") {
			query.genre = genre;
		}

		const creators = await Creator.find(query);

		// Transform data to match frontend interface
		const transformedCreators = creators.map((creator) => ({
			_id: creator._id.toString(),
			name: creator.name,
			genre: creator.genre,
			avatar: creator.avatar,
			platform: creator.platform,
			socialLink: creator.socialLink,
			details: {
				bio: creator.details.bio,
				analytics: {
					followers: creator.details.analytics.followers,
					totalViews: creator.details.analytics.totalViews,
				},
				reels: creator.details.reels,
				pricing: creator.details.pricing,
				tags: creator.details.tags,
			},
			createdAt: creator.createdAt,
			updatedAt: creator.updatedAt,
		}));

		res.json(transformedCreators);
	} catch (error) {
		console.error("Error fetching creators:", error);
		res.status(500).json({ error: "Failed to fetch creators" });
	}
});

// GET /api/creators/:id - Get creator by ID
router.get("/:id", async (req, res) => {
	try {
		const creator = await Creator.findById(req.params.id);

		if (!creator) {
			return res.status(404).json({ error: "Creator not found" });
		}

		// Transform data to match frontend interface
		const transformedCreator = {
			_id: creator._id.toString(),
			name: creator.name,
			genre: creator.genre,
			avatar: creator.avatar,
			platform: creator.platform,
			socialLink: creator.socialLink,
			details: {
				bio: creator.details.bio,
				analytics: {
					followers: creator.details.analytics.followers,
					totalViews: creator.details.analytics.totalViews,
				},
				reels: creator.details.reels,
				pricing: creator.details.pricing,
				tags: creator.details.tags,
			},
			createdAt: creator.createdAt,
			updatedAt: creator.updatedAt,
		};

		res.json(transformedCreator);
	} catch (error) {
		console.error("Error fetching creator:", error);
		res.status(500).json({ error: "Failed to fetch creator" });
	}
});

// POST /api/creators - Create new creator
router.post("/", async (req, res) => {
	try {
		// Validate required fields
		const { name, genre, avatar, platform, socialLink, details } = req.body;
		const missingFields = [];
		if (!name) missingFields.push("name");
		if (!genre) missingFields.push("genre");
		if (!avatar) missingFields.push("avatar");
		if (!platform) missingFields.push("platform");
		if (!socialLink) missingFields.push("socialLink");
		if (!details) missingFields.push("details");
		if (details) {
			if (!details.bio) missingFields.push("details.bio");
			if (!details.analytics) missingFields.push("details.analytics");
			else {
				if (details.analytics.followers === undefined)
					missingFields.push("details.analytics.followers");
				if (details.analytics.totalViews === undefined)
					missingFields.push("details.analytics.totalViews");
			}
			if (!details.pricing) missingFields.push("details.pricing");
		}

		if (missingFields.length > 0) {
			return res
				.status(400)
				.json({
					error: `Missing required fields: ${missingFields.join(", ")}`,
				});
		}

		// Validate platform
		const validPlatforms = [
			"Instagram",
			"YouTube",
			"TikTok",
			"Twitter",
			"Other",
		];
		if (!validPlatforms.includes(platform)) {
			return res
				.status(400)
				.json({
					error: `Invalid platform. Must be one of: ${validPlatforms.join(
						", "
					)}`,
				});
		}

		// Validate socialLink format
		if (!/^https?:\/\/.+/.test(socialLink)) {
			return res.status(400).json({ error: "Invalid socialLink URL" });
		}

		// Remove unexpected fields like engagement
		if (details?.analytics?.engagement) {
			delete details.analytics.engagement;
		}

		const creator = new Creator(req.body);
		await creator.save();

		// Transform data to match frontend interface
		const transformedCreator = {
			_id: creator._id.toString(),
			name: creator.name,
			genre: creator.genre,
			avatar: creator.avatar,
			platform: creator.platform,
			socialLink: creator.socialLink,
			details: {
				bio: creator.details.bio,
				analytics: {
					followers: creator.details.analytics.followers,
					totalViews: creator.details.analytics.totalViews,
				},
				reels: creator.details.reels,
				pricing: creator.details.pricing,
				tags: creator.details.tags,
			},
			createdAt: creator.createdAt,
			updatedAt: creator.updatedAt,
		};

		res.status(201).json(transformedCreator);
	} catch (error) {
		console.error("Error creating creator:", error);
		if (error.name === "ValidationError") {
			res.status(400).json({
				error: Object.values(error.errors)
					.map((err) => err.message)
					.join(", "),
			});
		} else {
			res.status(500).json({ error: "Failed to create creator" });
		}
	}
});

// PUT /api/creators/:id - Update creator
router.put("/:id", async (req, res) => {
	try {
		// Validate required fields
		const { name, genre, avatar, platform, socialLink, details } = req.body;
		const missingFields = [];
		if (!name) missingFields.push("name");
		if (!genre) missingFields.push("genre");
		if (!avatar) missingFields.push("avatar");
		if (!platform) missingFields.push("platform");
		if (!socialLink) missingFields.push("socialLink");
		if (!details) missingFields.push("details");
		if (details) {
			if (!details.bio) missingFields.push("details.bio");
			if (!details.analytics) missingFields.push("details.analytics");
			else {
				if (details.analytics.followers === undefined)
					missingFields.push("details.analytics.followers");
				if (details.analytics.totalViews === undefined)
					missingFields.push("details.analytics.totalViews");
			}
			if (!details.pricing) missingFields.push("details.pricing");
		}

		if (missingFields.length > 0) {
			return res
				.status(400)
				.json({
					error: `Missing required fields: ${missingFields.join(", ")}`,
				});
		}

		// Validate platform
		const validPlatforms = [
			"Instagram",
			"YouTube",
			"TikTok",
			"Twitter",
			"Other",
		];
		if (!validPlatforms.includes(platform)) {
			return res
				.status(400)
				.json({
					error: `Invalid platform. Must be one of: ${validPlatforms.join(
						", "
					)}`,
				});
		}

		// Validate socialLink format
		if (!/^https?:\/\/.+/.test(socialLink)) {
			return res.status(400).json({ error: "Invalid socialLink URL" });
		}

		// Remove unexpected fields like engagement
		if (details?.analytics?.engagement) {
			delete details.analytics.engagement;
		}

		const creator = await Creator.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!creator) {
			return res.status(404).json({ error: "Creator not found" });
		}

		// Transform data to match frontend interface
		const transformedCreator = {
			_id: creator._id.toString(),
			name: creator.name,
			genre: creator.genre,
			avatar: creator.avatar,
			platform: creator.platform,
			socialLink: creator.socialLink,
			details: {
				bio: creator.details.bio,
				analytics: {
					followers: creator.details.analytics.followers,
					totalViews: creator.details.analytics.totalViews,
				},
				reels: creator.details.reels,
				pricing: creator.details.pricing,
				tags: creator.details.tags,
			},
			createdAt: creator.createdAt,
			updatedAt: creator.updatedAt,
		};

		res.json(transformedCreator);
	} catch (error) {
		console.error("Error updating creator:", error);
		if (error.name === "ValidationError") {
			res.status(400).json({
				error: Object.values(error.errors)
					.map((err) => err.message)
					.join(", "),
			});
		} else {
			res.status(500).json({ error: "Failed to update creator" });
		}
	}
});

// DELETE /api/creators/:id - Delete creator
router.delete("/:id", async (req, res) => {
	try {
		const creator = await Creator.findByIdAndDelete(req.params.id);

		if (!creator) {
			return res.status(404).json({ error: "Creator not found" });
		}

		res.json({ message: "Creator deleted successfully" });
	} catch (error) {
		console.error("Error deleting creator:", error);
		res.status(500).json({ error: "Failed to delete creator" });
	}
});

// GET /api/creators/:id/reels - Get creator's Instagram Reels
router.get("/:id/reels", async (req, res) => {
	try {
		const creator = await Creator.findById(req.params.id);
		if (!creator) {
			return res.status(404).json({ error: "Creator not found" });
		}
		if (creator.platform !== "Instagram") {
			return res
				.status(400)
				.json({ error: "Reels only supported for Instagram" });
		}

		// Extract username from socialLink (e.g., https://instagram.com/username)
		const usernameMatch = creator.socialLink.match(
			/instagram\.com\/([^\/?]+)/i
		);
		if (!usernameMatch) {
			return res.status(400).json({ error: "Invalid Instagram socialLink" });
		}
		const username = usernameMatch[1];
		const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

		if (!accessToken) {
			return res
				.status(500)
				.json({ error: "Instagram API access token not configured" });
		}

		// Fetch Instagram user ID
		const userResponse = await axios.get(
			`https://graph.facebook.com/v20.0/instagram_accounts`,
			{
				params: {
					fields: "id,username",
					access_token: accessToken,
				},
			}
		);
		const accounts = userResponse.data.data;
		const account = accounts.find(
			(acc) => acc.username.toLowerCase() === username.toLowerCase()
		);
		if (!account) {
			return res
				.status(404)
				.json({ error: "Instagram account not found or not linked" });
		}
		const igUserId = account.id;

		// Fetch Reels
		const reelsResponse = await axios.get(
			`https://graph.facebook.com/v20.0/${igUserId}/media`,
			{
				params: {
					fields:
						"id,media_type,media_url,thumbnail_url,caption,timestamp,permalink",
					access_token: accessToken,
				},
			}
		);
		const reels = reelsResponse.data.data.filter(
			(media) => media.media_type === "VIDEO"
		);

		res.json(reels);
	} catch (error) {
		console.error(
			"Error fetching Reels:",
			error.response?.data || error.message
		);
		res.status(500).json({ error: "Failed to fetch Reels" });
	}
});

module.exports = router;
