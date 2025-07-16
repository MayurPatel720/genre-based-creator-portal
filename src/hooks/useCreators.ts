
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { CreateCreatorData, UpdateCreatorData } from "../services/api";
import * as api from "../services/api";
import { Creator } from "@/types/Creator";

interface PaginationData {
	creators: Creator[];
	totalPages: number;
	currentPage: number;
}

export const useCreators = () => {
	const [creators, setCreators] = useState<Creator[]>([]);
	const [paginationData, setPaginationData] = useState<PaginationData>({
		creators: [],
		totalPages: 1,
		currentPage: 1,
	});
	const [genres, setGenres] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch creators on mount
	useEffect(() => {
		const loadCreators = async () => {
			setLoading(true);
			setError(null);
			try {
				const response = await api.creatorAPI.getAll();
				setCreators(response.creators);
				setPaginationData(response);
			} catch (err: any) {
				setError(err.message || "Failed to fetch creators");
			} finally {
				setLoading(false);
			}
		};
		loadCreators();
	}, []);

	// Fetch genres on mount
	useEffect(() => {
		const loadGenres = async () => {
			try {
				const genreList = await api.creatorAPI.getGenres();
				setGenres(genreList);
			} catch (err: any) {
				console.error("Failed to fetch genres:", err);
			}
		};
		loadGenres();
	}, []);

	const createCreator = async (creatorData: CreateCreatorData) => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.creatorAPI.create(creatorData);
			setCreators((prev) => [...prev, response]);
			return response;
		} catch (err: any) {
			setError(err.message || "Failed to create creator");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateCreator = async (id: string, creatorData: UpdateCreatorData) => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.creatorAPI.update(id, creatorData);
			setCreators((prev) =>
				prev.map((creator) => (creator._id === id ? response : creator))
			);
			return response;
		} catch (err: any) {
			setError(err.message || "Failed to update creator");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deleteCreator = async (id: string) => {
		setLoading(true);
		setError(null);
		try {
			await api.creatorAPI.delete(id);
			setCreators((prev) => prev.filter((creator) => creator._id !== id));
		} catch (err: any) {
			setError(err.message || "Failed to delete creator");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const fetchCreators = async (page: number = 1, limit: number = 10, genre?: string) => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.creatorAPI.getAll(page, limit, genre);
			setCreators(response.creators);
			setPaginationData(response);
			return response;
		} catch (err: any) {
			setError(err.message || "Failed to fetch creators");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const fetchCreatorById = async (id: string) => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.creatorAPI.getById(id);
			return response;
		} catch (err: any) {
			setError(err.message || "Failed to fetch creator");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const fetchCreatorReels = async (id: string) => {
		setLoading(true);
		setError(null);
		try {
			const response = await api.creatorAPI.getReels(id);
			return response;
		} catch (err: any) {
			setError(err.message || "Failed to fetch reels");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return {
		creators,
		paginationData,
		genres,
		createCreator,
		updateCreator,
		deleteCreator,
		fetchCreators,
		fetchCreatorById,
		fetchCreatorReels,
		loading,
		error,
	};
};
