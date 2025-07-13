import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { X, Search } from "lucide-react";
import { API_BASE_URL } from "@/services/api";

interface FilterState {
	platform: string;
	locations: string[];
	priceRange: [number, number];
	followersRange: [number, number];
}

interface FilterDialogProps {
	isOpen: boolean;
	onClose: () => void;
	filters: FilterState;
	onFiltersChange: (filters: FilterState) => void;
	onClearFilters: () => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
	isOpen,
	onClose,
	filters,
	onFiltersChange,
	onClearFilters,
}) => {
	const [locationSearch, setLocationSearch] = useState("");

	const platforms = [
		"All",
		"Instagram",
		"YouTube",
		"TikTok",
		"Twitter",
		"LinkedIn",
	];

	// Fetch distinct locations from API
	const { data: allLocations = [] } = useQuery({
		queryKey: ["distinct-locations"],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/locations/distinct`);
			if (!response.ok) throw new Error("Failed to fetch locations");
			return response.json();
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	const filteredLocations = allLocations.filter((location: string) =>
		location.toLowerCase().includes(locationSearch.toLowerCase())
	);

	const handlePlatformChange = (platform: string) => {
		onFiltersChange({ ...filters, platform });
	};

	const handleLocationChange = (location: string, checked: boolean) => {
		if (checked) {
			onFiltersChange({
				...filters,
				locations: [...filters.locations, location],
			});
		} else {
			onFiltersChange({
				...filters,
				locations: filters.locations.filter((loc) => loc !== location),
			});
		}
	};

	const handleFollowersRangeChange = (value: number[]) => {
		onFiltersChange({
			...filters,
			followersRange: [value[0], value[1]],
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center justify-between">
						Filters
						<Button
							variant="ghost"
							size="default"
							onClick={onClose}
							className="h-6 w-6"
						></Button>
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-6">
					{/* Platform Filter */}
					<div>
						<h3 className="text-sm font-medium mb-3">Platform</h3>
						<div className="grid grid-cols-2 gap-2">
							{platforms.map((platform) => (
								<button
									key={platform}
									onClick={() => handlePlatformChange(platform)}
									className={`px-3 py-2 text-sm rounded-md border transition-colors ${
										filters.platform === platform
											? "bg-purple-100 border-purple-300 text-purple-700"
											: "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
									}`}
								>
									{platform}
								</button>
							))}
						</div>
					</div>

					{/* Location Filter */}
					<div>
						<h3 className="text-sm font-medium mb-3">Location</h3>
						<div className="relative mb-3">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search locations..."
								value={locationSearch}
								onChange={(e) => setLocationSearch(e.target.value)}
								className="pl-9"
							/>
						</div>
						<div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
							{filteredLocations.map((location: string) => (
								<div key={location} className="flex items-center space-x-2">
									<Checkbox
										id={location}
										checked={filters.locations.includes(location)}
										onCheckedChange={(checked) =>
											handleLocationChange(location, checked as boolean)
										}
									/>
									<label
										htmlFor={location}
										className="text-sm text-gray-700 cursor-pointer flex-1"
									>
										{location}
									</label>
								</div>
							))}
							{filteredLocations.length === 0 && (
								<div className="text-sm text-gray-500 text-center py-2">
									No locations found
								</div>
							)}
						</div>
						{filters.locations.length > 0 && (
							<div className="mt-2">
								<div className="text-xs text-gray-500 mb-1">
									Selected locations:
								</div>
								<div className="flex flex-wrap gap-1">
									{filters.locations.map((location) => (
										<span
											key={location}
											className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"
										>
											{location}
											<button
												onClick={() => handleLocationChange(location, false)}
												className="hover:text-purple-900"
											>
												<X size={10} />
											</button>
										</span>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Followers Range */}
					<div>
						<h3 className="text-sm font-medium mb-3">
							Followers Range ({filters.followersRange[0]}K -{" "}
							{filters.followersRange[1]}K)
						</h3>
						<Slider
							value={filters.followersRange}
							onValueChange={handleFollowersRangeChange}
							max={15000}
							min={0}
							step={100}
							className="w-full"
						/>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2 pt-4">
						<Button
							variant="outline"
							onClick={onClearFilters}
							className="flex-1"
						>
							Clear All
						</Button>
						<Button onClick={onClose} className="flex-1">
							Apply Filters
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default FilterDialog;
