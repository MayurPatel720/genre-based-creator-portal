
import axios from "axios";
import { Creator } from "../types/Creator";

// Use environment variable for API URL or fallback to local URL
const API_BASE_URL =
	import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// const API_BASE_URL =
// 	import.meta.env.VITE_API_URL ||
// 	"https://genre-based-creator-portal.onrender.com/api";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use((config) => {
	console.log("Making API request to:", config.baseURL + config.url);
	console.log("Request payload:", config.data);
	return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		console.error("API Error:", error);
		if (error.code === "ERR_NETWORK") {
			throw new Error(
				"Network error - please check if the API server is running"
			);
		}
		if (error.response?.status === 500) {
			throw new Error("Server error - please try again later");
		}
		throw error;
	}
);

export interface CreateCreatorData {
	name: string;
	genre: string;
	avatar: string;
	platform: "Instagram" | "YouTube" | "TikTok" | "Twitter" | "Other";
	socialLink: string;
	location?: string;
	phoneNumber?: string;
	mediaKit?: string;
	details: {
		bio: string;
		location: string;
		analytics: {
			followers: number;
			totalViews: number;
			averageViews?: number;
		};
		reels: string[];
	};
}

export type UpdateCreatorData = Partial<CreateCreatorData>;

export const creatorAPI = {
	// Get all creators
	getAll: async (): Promise<Creator[]> => {
		const response = await api.get("/creators");
		return response.data;
	},

	// Get creator by ID
	getById: async (id: string): Promise<Creator> => {
		const response = await api.get(`/creators/${id}`);
		return response.data;
	},

	// Create new creator
	create: async (data: CreateCreatorData): Promise<Creator> => {
		const creatorData = {
			name: data.name,
			genre: data.genre,
			avatar: data.avatar,
			platform: data.platform,
			socialLink: data.socialLink,
			location: data.location || "Other",
			phoneNumber: data.phoneNumber,
			mediaKit: data.mediaKit,
			details: {
				location: data.details.location || data.location || "Other",
				bio: data.details.bio,
				analytics: {
					followers: data.details.analytics.followers,
					totalViews: data.details.analytics.totalViews,
					averageViews: data.details.analytics.averageViews,
				},
				reels: data.details.reels,
			},
		};
		const response = await api.post("/creators", creatorData);
		return response.data;
	},

	// Update creator
	update: async (id: string, data: UpdateCreatorData): Promise<Creator> => {
		// First get the current creator to preserve media
		const currentCreator = await api.get(`/creators/${id}`);
		const existingMedia = currentCreator.data.details?.media || [];

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const updateData: any = {};

		if (data.name) updateData.name = data.name;
		if (data.genre) updateData.genre = data.genre;
		if (data.avatar) updateData.avatar = data.avatar;
		if (data.platform) updateData.platform = data.platform;
		if (data.socialLink) updateData.socialLink = data.socialLink;
		if (data.location) updateData.location = data.location;
		if (data.phoneNumber !== undefined)
			updateData.phoneNumber = data.phoneNumber;
		if (data.mediaKit !== undefined) updateData.mediaKit = data.mediaKit;

		if (data.details) {
			updateData.details = {};
			if (data.details.bio) updateData.details.bio = data.details.bio;
			if (data.details.location) updateData.details.location = data.details.location;
			if (data.details.analytics) {
				updateData.details.analytics = {};
				if (data.details.analytics.followers)
					updateData.details.analytics.followers = data.details.analytics.followers;
				if (data.details.analytics.totalViews)
					updateData.details.analytics.totalViews = data.details.analytics.totalViews;
				if (data.details.analytics.averageViews)
					updateData.details.analytics.averageViews = data.details.analytics.averageViews;
			}
			if (data.details.reels) updateData.details.reels = data.details.reels;

			// Always preserve existing media
			updateData.details.media = existingMedia;
		}

		const response = await api.put(`/creators/${id}`, updateData);
		return response.data;
	},

	// Delete creator
	delete: async (id: string): Promise<void> => {
		await api.delete(`/creators/${id}`);
	},

	// Get creators by genre
	getByGenre: async (genre: string): Promise<Creator[]> => {
		const response = await api.get(`/creators?genre=${genre}`);
		return response.data;
	},

	// Get creator's Instagram Reels
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	getReels: async (id: string): Promise<any[]> => {
		const response = await api.get(`/creators/${id}/reels`);
		return response.data;
	},
};

export default api;
