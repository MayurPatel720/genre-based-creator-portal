
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
	platform: string;
	socialLink: string;
	mediaKitUrl?: string;
	location?: string;
	contactNumber?: string;
	countryPrefix?: string;
	bio: string;
	followers: number;
	totalViews: number;
	averageViews?: number;
	engagement?: string;
	reels: string[];
	tags: string[];
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
		console.log("Creating creator with data:", data);
		const creatorData = {
			name: data.name,
			genre: data.genre,
			avatar: data.avatar,
			platform: data.platform,
			socialLink: data.socialLink,
			mediaKitUrl: data.mediaKitUrl || "",
			location: data.location || "Other",
			contactNumber: data.contactNumber || "",
			countryPrefix: data.countryPrefix || "+91",
			details: {
				bio: data.bio,
				analytics: {
					followers: data.followers,
					totalViews: data.totalViews,
					averageViews: data.averageViews || 0,
					engagement: data.engagement || "",
				},
				reels: data.reels || [],
				tags: data.tags || [],
			},
		};
		console.log("Sending creator data to API:", creatorData);
		const response = await api.post("/creators", creatorData);
		return response.data;
	},

	// Update creator
	update: async (id: string, data: UpdateCreatorData): Promise<Creator> => {
		console.log("Updating creator with data:", data);
		const updateData: any = {};

		// Top-level fields
		if (data.name !== undefined) updateData.name = data.name;
		if (data.genre !== undefined) updateData.genre = data.genre;
		if (data.avatar !== undefined) updateData.avatar = data.avatar;
		if (data.platform !== undefined) updateData.platform = data.platform;
		if (data.socialLink !== undefined) updateData.socialLink = data.socialLink;
		if (data.mediaKitUrl !== undefined) updateData.mediaKitUrl = data.mediaKitUrl;
		if (data.location !== undefined) updateData.location = data.location;
		if (data.contactNumber !== undefined) updateData.contactNumber = data.contactNumber;
		if (data.countryPrefix !== undefined) updateData.countryPrefix = data.countryPrefix;

		// Details object
		const hasDetailsUpdates = data.bio !== undefined || 
			data.followers !== undefined || 
			data.totalViews !== undefined || 
			data.averageViews !== undefined || 
			data.engagement !== undefined || 
			data.reels !== undefined || 
			data.tags !== undefined;

		if (hasDetailsUpdates) {
			updateData.details = {};
			if (data.bio !== undefined) updateData.details.bio = data.bio;
			
			// Analytics updates
			const hasAnalyticsUpdates = data.followers !== undefined || 
				data.totalViews !== undefined || 
				data.averageViews !== undefined || 
				data.engagement !== undefined;
			
			if (hasAnalyticsUpdates) {
				updateData.details.analytics = {};
				if (data.followers !== undefined) updateData.details.analytics.followers = data.followers;
				if (data.totalViews !== undefined) updateData.details.analytics.totalViews = data.totalViews;
				if (data.averageViews !== undefined) updateData.details.analytics.averageViews = data.averageViews;
				if (data.engagement !== undefined) updateData.details.analytics.engagement = data.engagement;
			}
			
			if (data.reels !== undefined) updateData.details.reels = data.reels;
			if (data.tags !== undefined) updateData.details.tags = data.tags;
		}

		console.log("Sending update data to API:", updateData);
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
