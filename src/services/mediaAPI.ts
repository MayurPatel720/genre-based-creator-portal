import axios from "axios";
import { MediaFile } from "../types/Creator";
import { API_BASE_URL } from "./api";

const mediaApi = axios.create({
	baseURL: `${API_BASE_URL}/media`,
	timeout: 30000,
});

export const mediaAPI = {
	uploadMedia: async (
		creatorId: string,
		file: File,
		caption: string
	): Promise<MediaFile> => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("caption", caption);

		const response = await mediaApi.post(`/${creatorId}`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	},

	deleteMedia: async (creatorId: string, mediaId: string): Promise<void> => {
		// Encode the mediaId to handle special characters like slashes
		const encodedMediaId = encodeURIComponent(mediaId);
		console.log("Deleting media with encoded ID:", encodedMediaId);

		await mediaApi.delete(`/${creatorId}/${encodedMediaId}`);
	},
};
