/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CreatorCard from "./CreatorCard";
import { Creator } from "../types/Creator";
import { creatorAPI } from "../services/api";
import { mockCreators } from "../data/mockData";
import { Loader2, Search, Filter } from "lucide-react";
import { Input } from "./ui/input";
import FilterDialog from "./FilterDialog";
import WhatsAppButton from "./WhatsAppButton";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardProps {
	activeGenre: string;
	onCreatorClick: (creator: Creator) => void;
}

interface FilterState {
	platform: string;
	locations: string[];
	priceRange: [number, number];
	followersRange: [number, number];
}

const Dashboard: React.FC<DashboardProps> = ({
	activeGenre,
	onCreatorClick,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const isMobile = useIsMobile();

	const [filters, setFilters] = useState<FilterState>({
		platform: "All",
		locations: [],
		priceRange: [0, 10000],
		followersRange: [0, 1000],
	});

	const {
		data: creators = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["creators"],
		queryFn: () => creatorAPI.getAll(),
		meta: {
			onError: (error: any) => {
				console.error("Failed to fetch creators:", error);
			},
		},
	});

	const allCreators: Creator[] =
		Array.isArray(creators) && creators.length > 0 ? creators : mockCreators;

	const filteredCreators = useMemo(() => {
		return allCreators.filter((creator) => {
			// Genre filter
			if (activeGenre !== "All Creators") {
				const creatorGenre = creator.genre?.toLowerCase().trim() || "";
				const activeGenreNormalized = activeGenre.toLowerCase().trim();
				if (creatorGenre !== activeGenreNormalized) return false;
			}

			// Search filter
			if (searchTerm.trim()) {
				const searchLower = searchTerm.toLowerCase();
				const nameMatch = creator.name.toLowerCase().includes(searchLower);
				const tagsMatch = creator.details?.tags?.some((tag) =>
					tag.toLowerCase().includes(searchLower)
				);
				if (!nameMatch && !tagsMatch) return false;
			}

			// Platform filter
			if (filters.platform !== "All") {
				if (
					creator.platform?.toLowerCase() !== filters.platform.toLowerCase()
				) {
					return false;
				}
			}

			// Location filter
			if (filters.locations.length > 0) {
				const creatorLocation =
					creator.location || creator.details?.location || "";
				if (!filters.locations.includes(creatorLocation)) {
					return false;
				}
			}

			// Followers range filter
			const followers = creator.details?.analytics?.followers || 0;
			const followersInK = followers / 1000;
			if (
				followersInK < filters.followersRange[0] ||
				followersInK > filters.followersRange[1]
			) {
				return false;
			}

			return true;
		});
	}, [allCreators, activeGenre, searchTerm, filters]);

	const handleClearFilters = () => {
		setFilters({
			platform: "All",
			locations: [],
			priceRange: [0, 10000],
			followersRange: [0, 1000],
		});
	};

	const hasActiveFilters =
		filters.platform !== "All" ||
		filters.locations.length > 0 ||
		filters.followersRange[0] !== 0 ||
		filters.followersRange[1] !== 1000;

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-full space-y-4">
				<div className="loader" />
				<p className="text-sm text-gray-600">Loading creators...</p>
			</div>
		);
	}

	if (error) {
		console.error("Error loading creators:", error);
	}

	return (
		<div className="flex-1 overflow-auto">
			<div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-3">
				{/* Header */}
				<div className="mb-4">
					<h1 className="text-xl font-bold text-gray-900 mb-1">
						{activeGenre}
					</h1>
					<p className="text-gray-600 text-xs lg:text-base">
						Discover amazing content creators and collaborate with them
					</p>
				</div>

				{/* Search and Filter Bar */}
				<div className="mb-4 flex flex-col sm:flex-row gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
						<Input
							placeholder="Search creators by name or tags..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-9 pr-4 py-2 w-full h-9"
						/>
					</div>
					<button
						onClick={() => setIsFilterOpen(true)}
						className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors text-sm ${
							hasActiveFilters
								? "bg-purple-100 border-purple-300 text-purple-700"
								: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
						}`}
					>
						<Filter className="h-4 w-4" />
						<span>Filters</span>
						{hasActiveFilters && (
							<span className="bg-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
								{[
									filters.platform !== "All" ? 1 : 0,
									filters.locations.length,
									filters.followersRange[0] !== 0 ||
									filters.followersRange[1] !== 1000
										? 1
										: 0,
								].reduce((a, b) => a + b, 0)}
							</span>
						)}
					</button>
				</div>

				{/* Results count */}
				<div className="mb-4">
					<p className="text-xs text-gray-600">
						{filteredCreators.length} creator
						{filteredCreators.length !== 1 ? "s" : ""} found
						{searchTerm && ` for "${searchTerm}"`}
					</p>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto">
					<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
						{filteredCreators.map((creator) => (
							<CreatorCard
								key={creator._id || creator.name}
								creator={creator}
								onClick={() => onCreatorClick(creator)}
							/>
						))}
					</div>

					{filteredCreators.length === 0 && (
						<div className="text-center py-8">
							<div className="text-gray-400 mb-3">
								<Search className="h-10 w-10 mx-auto" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								No creators found
							</h3>
							<p className="text-gray-600 mb-4 text-sm">
								Try adjusting your search terms or filters to find more
								creators.
							</p>
							{hasActiveFilters && (
								<button
									onClick={handleClearFilters}
									className="text-purple-600 hover:text-purple-700 font-medium text-sm"
								>
									Clear all filters
								</button>
							)}
						</div>
					)}
				</div>

				<FilterDialog
					isOpen={isFilterOpen}
					onClose={() => setIsFilterOpen(false)}
					filters={filters}
					onFiltersChange={setFilters}
					onClearFilters={handleClearFilters}
				/>
			</div>
			{isMobile && <WhatsAppButton variant="floating" />}
		</div>
	);
};

export default Dashboard;
