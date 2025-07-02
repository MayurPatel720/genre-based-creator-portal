
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Filter, DollarSign, MapPin, Users, Monitor, X } from "lucide-react";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

interface Country {
	name: string;
	code: string;
}

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

	const countries: Country[] = [
		{ name: "All", code: "ALL" },
		{ name: "Australia", code: "AU" },
		{ name: "Brazil", code: "BR" },
		{ name: "China", code: "CN" },
		{ name: "Egypt", code: "EG" },
		{ name: "France", code: "FR" },
		{ name: "Germany", code: "DE" },
		{ name: "India", code: "IN" },
		{ name: "Japan", code: "JP" },
		{ name: "Spain", code: "ES" },
		{ name: "United States", code: "US" },
	];

	const selectedCountryTemplate = (option: Country, props: any) => {
		if (option && option.code !== "ALL") {
			return (
				<div className="flex items-center">
					<img
						alt={option.name}
						src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
						className="mr-2"
						style={{ width: "18px" }}
					/>
					<div>{option.name}</div>
				</div>
			);
		}

		return <span>{option?.name || props.placeholder}</span>;
	};

	const countryOptionTemplate = (option: Country) => {
		if (option.code === "ALL") {
			return <div className="font-medium">All Locations</div>;
		}
		
		return (
			<div className="flex items-center">
				<img
					alt={option.name}
					src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
					className="mr-2"
					style={{ width: "18px" }}
				/>
				<div>{option.name}</div>
			</div>
		);
	};

	const handleFilterChange = (key: string, value: any) => {
		onFiltersChange({
			...filters,
			[key]: value,
		});
	};

	const hasActiveFilters = 
		filters.platform !== "All" ||
		filters.location !== "All" ||
		filters.priceRange[0] !== 0 ||
		filters.priceRange[1] !== 5000 ||
		filters.followersRange[0] !== 0 ||
		filters.followersRange[1] !== 1000;

	return (
		<div className="space-y-6 p-1">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold flex items-center gap-2 text-lg">
					<Filter size={18} className="text-purple-600" />
					Filters
				</h3>
				{hasActiveFilters && (
					<button
						onClick={onClearFilters}
						className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors"
					>
						<X size={14} />
						Clear All
					</button>
				)}
			</div>

			{/* Platform Filter */}
			<div className="space-y-3">
				<Label className="flex items-center gap-2 font-medium text-gray-700">
					<Monitor size={16} className="text-blue-500" />
					Platform
				</Label>
				<Dropdown
					value={filters.platform}
					onChange={(e: DropdownChangeEvent) =>
						handleFilterChange("platform", e.value)
					}
					options={platforms}
					placeholder="Select Platform"
					className="w-full"
					showClear={filters.platform !== "All"}
				/>
			</div>

			{/* Location Filter */}
			<div className="space-y-3">
				<Label className="flex items-center gap-2 font-medium text-gray-700">
					<MapPin size={16} className="text-green-500" />
					Location
				</Label>
				<Dropdown
					value={filters.location === "All" ? "All" : filters.location}
					onChange={(e: DropdownChangeEvent) =>
						handleFilterChange("location", e.value)
					}
					options={countries}
					optionLabel="name"
					optionValue="name"
					placeholder="Select a Country"
					valueTemplate={selectedCountryTemplate}
					itemTemplate={countryOptionTemplate}
					className="w-full"
					showClear={filters.location !== "All"}
					filter
					filterPlaceholder="Search countries..."
				/>
			</div>

			{/* Price Range Filter */}
			<div className="space-y-4">
				<Label className="flex items-center gap-2 font-medium text-gray-700">
					<DollarSign size={16} className="text-yellow-500" />
					Price Range
				</Label>
				<div className="px-3 py-2 bg-gray-50 rounded-lg">
					<Slider
						value={filters.priceRange}
						onValueChange={(value) => handleFilterChange("priceRange", value)}
						max={5000}
						min={0}
						step={100}
						className="w-full"
					/>
					<div className="flex justify-between items-center text-sm text-gray-600 mt-3">
						<div className="bg-white px-2 py-1 rounded shadow-sm border">
							<span className="font-medium">${filters.priceRange[0]}</span>
						</div>
						<div className="text-xs text-gray-400">to</div>
						<div className="bg-white px-2 py-1 rounded shadow-sm border">
							<span className="font-medium">${filters.priceRange[1]}</span>
						</div>
					</div>
				</div>
			</div>

			{/* Followers Range Filter */}
			<div className="space-y-4">
				<Label className="flex items-center gap-2 font-medium text-gray-700">
					<Users size={16} className="text-purple-500" />
					Followers Range
				</Label>
				<div className="px-3 py-2 bg-gray-50 rounded-lg">
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
					<div className="flex justify-between items-center text-sm text-gray-600 mt-3">
						<div className="bg-white px-2 py-1 rounded shadow-sm border">
							<span className="font-medium">{filters.followersRange[0]}K</span>
						</div>
						<div className="text-xs text-gray-400">to</div>
						<div className="bg-white px-2 py-1 rounded shadow-sm border">
							<span className="font-medium">{filters.followersRange[1]}K</span>
						</div>
					</div>
				</div>
			</div>

			{/* Active Filters Summary */}
			{hasActiveFilters && (
				<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
					<h4 className="font-medium text-purple-800 mb-2">Active Filters:</h4>
					<div className="flex flex-wrap gap-2">
						{filters.platform !== "All" && (
							<span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
								{filters.platform}
							</span>
						)}
						{filters.location !== "All" && (
							<span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
								{filters.location}
							</span>
						)}
						{(filters.priceRange[0] !== 0 || filters.priceRange[1] !== 5000) && (
							<span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
								${filters.priceRange[0]} - ${filters.priceRange[1]}
							</span>
						)}
						{(filters.followersRange[0] !== 0 || filters.followersRange[1] !== 1000) && (
							<span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
								{filters.followersRange[0]}K - {filters.followersRange[1]}K followers
							</span>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Filters;
