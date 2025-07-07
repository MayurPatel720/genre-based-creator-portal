/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import CreatorCard from "./CreatorCard";
import { Creator } from "../types/Creator";
import { creatorAPI } from "../services/api";
import { Loader2, Search, Filter, AlertCircle, RefreshCw } from "lucide-react";
import { Input } from "./ui/input";
import FilterDialog from "./FilterDialog";
import WhatsAppButton from "./WhatsAppButton";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardProps {
	activeGenre: string;
	onCreatorClick: (creator: Creator) => void;
	isModalOpen?: boolean;
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
	isModalOpen = false,
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
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["creators"],
		queryFn: () => creatorAPI.getAll(),
		retry: 3,
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		staleTime: 5 * 60 * 1000, // 5 minutes
		meta: {
			onError: (error: any) => {
				console.error("Failed to fetch creators:", error);
			},
		},
	});

	const filteredCreators = useMemo(() => {
		if (!Array.isArray(creators) || creators.length === 0) {
			return [];
		}

		return creators.filter((creator) => {
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
				if (!nameMatch) return false;
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
	}, [creators, activeGenre, searchTerm, filters]);

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

	const handleRetry = () => {
		refetch();
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center h-full space-y-4 font-poppins">
				<div className="loader" />
				<p className="text-sm text-gray-600">Loading creators...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center h-full space-y-6 font-poppins p-6">
				<div className="text-center space-y-4">
					<AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
					<h3 className="text-xl font-semibold text-brand-black font-anton">
						Failed to Load Creators
					</h3>
					<div className="space-y-2">
						<p className="text-gray-600 max-w-md">
							{error instanceof Error 
								? error.message 
								: "There was an error loading the creators. This might be due to server startup time."
							}
						</p>
						<p className="text-sm text-gray-500">
							Please try again or wait a moment for the server to fully start.
						</p>
					</div>
					<button
						onClick={handleRetry}
						disabled={isRefetching}
						className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange hover:bg-brand-orange/90 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isRefetching ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Retrying...
							</>
						) : (
							<>
								<RefreshCw className="h-4 w-4" />
								Try Again
							</>
						)}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 overflow-auto font-poppins">
			<div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-3">
				{/* Header */}
				<div className="mb-4">
					<h1 className="text-xl font-bold text-brand-black mb-1 font-anton">
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
							className="pl-9 pr-4 py-2 w-full h-9 border-gray-300 focus:border-brand-orange focus:ring-brand-orange/20 font-poppins"
						/>
					</div>
					<button
						onClick={() => setIsFilterOpen(true)}
						className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-colors text-sm ${
							hasActiveFilters
								? "bg-brand-purple/10 border-brand-purple text-brand-purple"
								: "bg-white border-gray-300 text-gray-700 hover:bg-brand-aureolin/10 hover:border-brand-orange"
						}`}
					>
						<Filter className="h-4 w-4" />
						<span>Filters</span>
						{hasActiveFilters && (
							<span className="bg-brand-orange text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
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

					{filteredCreators.length === 0 && !isLoading && (
						<div className="text-center py-8">
							<div className="text-gray-400 mb-3">
								<Search className="h-10 w-10 mx-auto" />
							</div>
							<h3 className="text-lg font-medium text-brand-black mb-2 font-anton">
								No creators found
							</h3>
							<p className="text-gray-600 mb-4 text-sm">
								Try adjusting your search terms or filters to find more
								creators.
							</p>
							{hasActiveFilters && (
								<button
									onClick={handleClearFilters}
									className="text-brand-orange hover:text-brand-purple font-medium text-sm transition-colors"
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
			{isMobile && <WhatsAppButton variant="floating" hidden={isModalOpen} />}
		</div>
	);
};

export default Dashboard;
