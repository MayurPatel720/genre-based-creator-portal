
import React, { useState, useEffect } from "react";
import CreatorCard from "./CreatorCard";
import { Creator } from "../types/Creator";
import { creatorAPI } from "../services/api";
import { Users, Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

interface DashboardProps {
	activeGenre: string;
	onCreatorClick: (creator: Creator) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
	activeGenre,
	onCreatorClick,
}) => {
	const [creators, setCreators] = useState<Creator[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("name");
	const [filterBy, setFilterBy] = useState("all");

	// Fetch creators from API
	useEffect(() => {
		const fetchCreators = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await creatorAPI.getAll();
				setCreators(data);
			} catch (err) {
				setError("Failed to load creators");
				console.error("Error fetching creators:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchCreators();
	}, []);

	// Filter creators by genre
	let filteredCreators =
		activeGenre === "All Creators"
			? creators
			: creators.filter((creator) => creator.genre === activeGenre);

	// Apply search filter
	if (searchTerm) {
		filteredCreators = filteredCreators.filter(
			(creator) =>
				creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				creator.details.tags.some((tag) =>
					tag.toLowerCase().includes(searchTerm.toLowerCase())
				)
		);
	}

	// Apply tag filter
	if (filterBy !== "all") {
		filteredCreators = filteredCreators.filter((creator) =>
			creator.details.tags.some((tag) =>
				tag.toLowerCase().includes(filterBy.toLowerCase())
			)
		);
	}

	// Apply sorting
	filteredCreators = [...filteredCreators].sort((a, b) => {
		switch (sortBy) {
			case "name":
				return a.name.localeCompare(b.name);
			case "followers":
				return b.details.analytics.followers - a.details.analytics.followers;
			case "views":
				return b.details.analytics.totalViews - a.details.analytics.totalViews;
			default:
				return 0;
		}
	});

	// Get unique tags for filter dropdown
	const allTags = Array.from(
		new Set(creators.flatMap((creator) => creator.details.tags))
	);

	if (loading) {
		return (
			<div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
				<header className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
					<div className="flex flex-col space-y-4">
						<div>
							<Skeleton className="h-8 w-48 mb-2" />
							<Skeleton className="h-4 w-32" />
						</div>
						<div className="space-y-3">
							<Skeleton className="h-10 w-full" />
							<div className="grid grid-cols-2 gap-3">
								<Skeleton className="h-10 w-full" />
								<Skeleton className="h-10 w-full" />
							</div>
						</div>
					</div>
				</header>
				<div className="flex-1 overflow-y-auto p-4 lg:p-6">
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
						{[...Array(8)].map((_, i) => (
							<Skeleton key={i} className="h-64 w-full rounded-lg" />
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
				<div className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<div className="text-red-400 mb-4">
							<Users size={48} className="mx-auto" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							Failed to load creators
						</h3>
						<p className="text-gray-600">{error}</p>
						<button 
							onClick={() => window.location.reload()} 
							className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
				<div className="flex flex-col space-y-4">
					<div>
						<h2 className="text-xl lg:text-2xl font-bold text-gray-900">
							{activeGenre}
						</h2>
						<p className="text-gray-600 mt-1">
							{filteredCreators.length} creator
							{filteredCreators.length !== 1 ? "s" : ""} available
						</p>
					</div>

					{/* Search, Filter, and Sort Controls */}
					<div className="space-y-3">
						{/* Search - Full width on mobile */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search creators..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 w-full"
							/>
						</div>

						{/* Filter and Sort - Side by side */}
						<div className="grid grid-cols-2 gap-3">
							<Select value={filterBy} onValueChange={setFilterBy}>
								<SelectTrigger>
									<Filter className="h-4 w-4 mr-2" />
									<SelectValue placeholder="Filter" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Tags</SelectItem>
									{allTags.map((tag) => (
										<SelectItem key={tag} value={tag.toLowerCase()}>
											{tag}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger>
									<ArrowUpDown className="h-4 w-4 mr-2" />
									<SelectValue placeholder="Sort" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="name">Name</SelectItem>
									<SelectItem value="followers">Followers</SelectItem>
									<SelectItem value="views">Views</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</header>

			{/* Content */}
			<div className="flex-1 overflow-y-auto p-4 lg:p-6">
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
					{filteredCreators.map((creator) => (
						<CreatorCard
							key={creator.id}
							creator={creator}
							onClick={() => onCreatorClick(creator)}
						/>
					))}
				</div>

				{filteredCreators.length === 0 && (
					<div className="text-center py-12">
						<div className="text-gray-400 mb-4">
							<Users size={48} className="mx-auto" />
						</div>
						<h3 className="text-lg font-semibold text-gray-900 mb-2">
							No creators found
						</h3>
						<p className="text-gray-600">
							Try adjusting your search or filters
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Dashboard;
