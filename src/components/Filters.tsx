/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Filter, DollarSign, MapPin, Users, Monitor } from "lucide-react";
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
		if (option) {
			return (
				<div className="flex align-items-center">
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

		return <span>{props.placeholder}</span>;
	};

	const countryOptionTemplate = (option: Country) => {
		return (
			<div className="flex align-items-center">
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
				<Dropdown
					value={filters.platform}
					onChange={(e: DropdownChangeEvent) =>
						handleFilterChange("platform", e.value)
					}
					options={platforms}
					placeholder="Select Platform"
					className="w-full"
				/>
			</div>

			{/* Location Filter */}
			<div className="space-y-3">
				<Label className="flex items-center gap-2">
					<MapPin size={14} />
					Location
				</Label>
				<Dropdown
					value={filters.location}
					onChange={(e: DropdownChangeEvent) =>
						handleFilterChange("location", e.value)
					}
					options={countries}
					optionLabel="name"
					placeholder="Select a Country"
					valueTemplate={selectedCountryTemplate}
					itemTemplate={countryOptionTemplate}
					className="w-full"
				/>
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
