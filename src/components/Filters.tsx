/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Filter, DollarSign, MapPin, Users, Monitor } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

interface FiltersProps {
	filters: {
		platform: string;
		priceRange: [number, number];
		location: string;
		followersRange: [number, number];
	};
	onFiltersChange: (filters: any) => void;
	onClearFilters: () => void;
}

const Filters: React.FC<FiltersProps> = ({
	filters,
	onFiltersChange,
	onClearFilters,
}) => {
	const platforms = [
		"All",
		"Instagram",
		"YouTube",
		"TikTok",
		"Twitter",
		"Other",
	];
	const locations = [
		"All",
		"USA",
		"UK",
		"Canada",
		"Australia",
		"India",
		"Other",
	];

	const handleFilterChange = (key: string, value: any) => {
		onFiltersChange({
			...filters,
			[key]: value,
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold flex items-center gap-2">
					<Filter size={16} />
					Filters
				</h3>
				<button
					onClick={onClearFilters}
					className="text-sm text-gray-500 hover:text-gray-700"
				>
					Clear All
				</button>
			</div>

			{/* Platform Filter */}
			<div className="space-y-3">
				<Label className="flex items-center gap-2">
					<Monitor size={14} />
					Platform
				</Label>
				<Select
					value={filters.platform}
					onValueChange={(value) => handleFilterChange("platform", value)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select platform" />
					</SelectTrigger>
					<SelectContent>
						{platforms.map((platform) => (
							<SelectItem key={platform} value={platform}>
								{platform}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Location Filter */}
			<div className="space-y-3">
				<Label className="flex items-center gap-2">
					<MapPin size={14} />
					Location
				</Label>
				<Select
					value={filters.location}
					onValueChange={(value) => handleFilterChange("location", value)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select location" />
					</SelectTrigger>
					<SelectContent>
						{locations.map((location) => (
							<SelectItem key={location} value={location}>
								{location}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			{/* Price Range Filter */}
			<div className="space-y-3">
				<Label className="flex items-center gap-2">
					<DollarSign size={14} />
					Price Range ($)
				</Label>
				<div className="px-2">
					<Slider
						value={filters.priceRange}
						onValueChange={(value) => handleFilterChange("priceRange", value)}
						max={5000}
						min={0}
						step={100}
						className="w-full"
					/>
					<div className="flex justify-between text-xs text-gray-500 mt-1">
						<span>${filters.priceRange[0]}</span>
						<span>${filters.priceRange[1]}</span>
					</div>
				</div>
			</div>
			{/* Followers Range Filter */}
			<div className="space-y-3">
				<Label className="flex items-center gap-2">
					<Users size={14} />
					Followers Range (K)
				</Label>
				<div className="px-2">
					<Slider
						value={filters.followersRange}
						onValueChange={(value) =>
							handleFilterChange("followersRange", value)
						}
						max={1000}
						min={0}
						step={10}
						className="w-full"
					/>
					<div className="flex justify-between text-xs text-gray-500 mt-1">
						<span>{filters.followersRange[0]}K</span>
						<span>{filters.followersRange[1]}K</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Filters;
