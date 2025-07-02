
import React, { useState, useMemo } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { X, MapPin, Users, Monitor, Search } from "lucide-react";
import { Checkbox } from "./ui/checkbox";

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

const majorIndianCities = [
	"Agra",
	"Ahmedabad",
	"Ajmer",
	"Akola",
	"Aligarh",
	"Allahabad",
	"Amravati",
	"Amritsar",
	"Asansol",
	"Aurangabad",
	"Bangalore",
	"Bareilly",
	"Belgaum",
	"Bhavnagar",
	"Bhilai Nagar",
	"Bhiwandi",
	"Bhopal",
	"Bhubaneswar",
	"Bikaner",
	"Chennai",
	"Chandigarh",
	"Coimbatore",
	"Cuttack",
	"Dehradun",
	"Delhi",
	"Dhanbad",
	"Durgapur",
	"Erode",
	"Faridabad",
	"Firozabad",
	"Gaya",
	"Ghaziabad",
	"Gorakhpur",
	"Gulbarga",
	"Guntur",
	"Gurgaon",
	"Guwahati",
	"Gwalior",
	"Howrah",
	"Hubli-Dharwad",
	"Hyderabad",
	"Indore",
	"Jabalpur",
	"Jaipur",
	"Jalgaon",
	"Jalandhar",
	"Jammu",
	"Jamnagar",
	"Jamshedpur",
	"Jhansi",
	"Jodhpur",
	"Kalyan-Dombivli",
	"Kanpur",
	"Kochi",
	"Kolhapur",
	"Kolkata",
	"Kota",
	"Lucknow",
	"Ludhiana",
	"Madurai",
	"Maheshtala",
	"Malegaon",
	"Mangalore",
	"Meerut",
	"Mira-Bhayandar",
	"Moradabad",
	"Mumbai",
	"Mysore",
	"Nagpur",
	"Nanded",
	"Nashik",
	"Navi Mumbai",
	"Nellore",
	"Noida",
	"Patna",
	"Pimpri-Chinchwad",
	"Pune",
	"Raipur",
	"Rajkot",
	"Ranchi",
	"Rourkela",
	"Saharanpur",
	"Salem",
	"Sangli-Miraj & Kupwad",
	"Siliguri",
	"Solapur",
	"Srinagar",
	"Thane",
	"Thiruvananthapuram",
	"Tiruchirappalli",
	"Tirunelveli",
	"Udaipur",
	"Maheshtala"
];

const platforms = [
	"All",
	"Instagram",
	"YouTube",
	"TikTok",
	"Twitter",
	"LinkedIn"
];

const FilterDialog: React.FC<FilterDialogProps> = ({
	isOpen,
	onClose,
	filters,
	onFiltersChange,
	onClearFilters,
}) => {
	const [locationSearch, setLocationSearch] = useState("");

	const filteredCities = useMemo(() => {
		if (!locationSearch.trim()) return majorIndianCities;
		return majorIndianCities.filter(city =>
			city.toLowerCase().includes(locationSearch.toLowerCase())
		);
	}, [locationSearch]);

	const handleFilterChange = (key: keyof FilterState, value: any) => {
		onFiltersChange({
			...filters,
			[key]: value,
		});
	};

	const handleLocationToggle = (location: string) => {
		const newLocations = filters.locations.includes(location)
			? filters.locations.filter(loc => loc !== location)
			: [...filters.locations, location];
		
		handleFilterChange("locations", newLocations);
	};

	const hasActiveFilters =
		filters.platform !== "All" ||
		filters.locations.length > 0 ||
		filters.followersRange[0] !== 0 ||
		filters.followersRange[1] !== 1000;

	const formatFollowers = (followers: number) => {
		if (followers >= 1000) {
			return `${(followers / 1000).toFixed(0)}M`;
		}
		return `${followers}K`;
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Monitor className="h-5 w-5 text-purple-600" />
						Filter Creators
					</DialogTitle>
					<DialogDescription>
						Filter creators by platform, location, and follower count
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* Platform Filter */}
					<div className="space-y-2">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Monitor className="h-4 w-4 text-blue-500" />
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
						<Label className="flex items-center gap-2 text-sm font-medium">
							<MapPin className="h-4 w-4 text-green-500" />
							Locations (Major Indian Cities)
						</Label>
						
						{/* Search Input */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<Input
								placeholder="Search cities..."
								value={locationSearch}
								onChange={(e) => setLocationSearch(e.target.value)}
								className="pl-10"
							/>
						</div>

						{/* Selected Locations Display */}
						{filters.locations.length > 0 && (
							<div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
								{filters.locations.map((location) => (
									<span
										key={location}
										className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs"
									>
										{location}
										<button
											onClick={() => handleLocationToggle(location)}
											className="hover:bg-purple-200 rounded-full p-0.5"
										>
											<X className="h-3 w-3" />
										</button>
									</span>
								))}
							</div>
						)}

						{/* Cities List */}
						<div className="max-h-48 overflow-y-auto border rounded-lg">
							{filteredCities.map((city) => (
								<div
									key={city}
									className="flex items-center space-x-3 p-3 hover:bg-gray-50 border-b last:border-b-0"
								>
									<Checkbox
										id={city}
										checked={filters.locations.includes(city)}
										onCheckedChange={() => handleLocationToggle(city)}
									/>
									<label
										htmlFor={city}
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
									>
										{city}
									</label>
								</div>
							))}
							{filteredCities.length === 0 && (
								<div className="p-4 text-center text-gray-500 text-sm">
									No cities found matching your search
								</div>
							)}
						</div>
					</div>

					{/* Followers Range Filter */}
					<div className="space-y-4">
						<Label className="flex items-center gap-2 text-sm font-medium">
							<Users className="h-4 w-4 text-purple-500" />
							Followers Range
						</Label>
						<div className="px-3">
							<Slider
								value={filters.followersRange}
								onValueChange={(value) =>
									handleFilterChange(
										"followersRange",
										value as [number, number]
									)
								}
								max={1000}
								min={0}
								step={50}
								className="w-full"
							/>
							<div className="flex justify-between items-center mt-2 text-sm text-gray-600">
								<span className="font-medium">
									{formatFollowers(filters.followersRange[0])}
								</span>
								<span className="text-gray-400">to</span>
								<span className="font-medium">
									{formatFollowers(filters.followersRange[1])}
								</span>
							</div>
						</div>
					</div>

					{/* Active Filters Summary */}
					{hasActiveFilters && (
						<div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
							<h4 className="font-medium text-purple-800 mb-2 text-sm">
								Active Filters:
							</h4>
							<div className="flex flex-wrap gap-2">
								{filters.platform !== "All" && (
									<span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
										{filters.platform}
									</span>
								)}
								{filters.locations.map((location) => (
									<span key={location} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
										{location}
									</span>
								))}
								{(filters.followersRange[0] !== 0 ||
									filters.followersRange[1] !== 1000) && (
									<span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
										{formatFollowers(filters.followersRange[0])} -{" "}
										{formatFollowers(filters.followersRange[1])} followers
									</span>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Dialog Footer */}
				<div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
					<Button
						variant="outline"
						onClick={onClearFilters}
						className="flex-1 sm:flex-none"
						disabled={!hasActiveFilters}
					>
						<X className="h-4 w-4 mr-2" />
						Clear All
					</Button>
					<Button onClick={onClose} className="flex-1">
						Apply Filters
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default FilterDialog;
