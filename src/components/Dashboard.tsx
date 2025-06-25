
import React, { useState, useEffect } from "react";
import CreatorCard from "./CreatorCard";
import Filters from "./Filters";
import WhatsAppButton from "./WhatsAppButton";
import { Creator } from "../types/Creator";
import { creatorAPI } from "../services/api";
import { Users, Search, Filter } from "lucide-react";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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
	const [showFiltersDialog, setShowFiltersDialog] = useState(false);
	const [filters, setFilters] = useState({
		platform: 'All',
		priceRange: [0, 5000] as [number, number],
		location: 'All',
		followersRange: [0, 1000] as [number, number],
	});

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

	// Apply advanced filters
	if (filters.platform !== 'All') {
		filteredCreators = filteredCreators.filter(
			(creator) => creator.platform === filters.platform
		);
	}

	// Filter by followers range (convert K to actual numbers)
	filteredCreators = filteredCreators.filter(
		(creator) => {
			const followers = creator.details.analytics.followers / 1000; // Convert to K
			return followers >= filters.followersRange[0] && followers <= filters.followersRange[1];
		}
	);

	// Filter by price range (extract price from pricing string)
	filteredCreators = filteredCreators.filter(
		(creator) => {
			const pricingText = creator.details.pricing.toLowerCase();
			const priceMatch = pricingText.match(/\$(\d+)/);
			if (priceMatch) {
				const price = parseInt(priceMatch[1]);
				return price >= filters.priceRange[0] && price <= filters.priceRange[1];
			}
			return true; // Include if no price found
		}
	);

	const handleFiltersChange = (newFilters: typeof filters) => {
		setFilters(newFilters);
	};

	const handleClearFilters = () => {
		setFilters({
			platform: 'All',
			priceRange: [0, 5000],
			location: 'All',
			followersRange: [0, 1000],
		});
	};

	if (loading) {
		return (
			<div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
				<header className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
					<div className="flex flex-col space-y-4">
						<div>
							<Skeleton className="h-8 w-48 mb-2" />
							<Skeleton className="h-4 w-32" />
						</div>
						<div className="flex items-center space-x-3">
							<Skeleton className="h-10 flex-1" />
							<Skeleton className="h-10 w-10" />
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

					{/* Search and Filter */}
					<div className="flex items-center space-x-3">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search creators..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10 w-full"
							/>
						</div>
						
						<Dialog open={showFiltersDialog} onOpenChange={setShowFiltersDialog}>
							<DialogTrigger asChild>
								<button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
									<Filter size={20} className="text-gray-600" />
								</button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-md">
								<DialogHeader>
									<DialogTitle>Filter Creators</DialogTitle>
								</DialogHeader>
								<Filters
									filters={filters}
									onFiltersChange={handleFiltersChange}
									onClearFilters={handleClearFilters}
								/>
							</DialogContent>
						</Dialog>
					</div>
				</div>
			</header>

			{/* Content */}
			<div className="flex-1 overflow-y-auto p-4 lg:p-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
					{filteredCreators.map((creator) => (
						<CreatorCard
							key={creator._id}
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

			{/* Mobile WhatsApp Button */}
			<WhatsAppButton variant="floating" />
		</div>
	);
};

export default Dashboard;
