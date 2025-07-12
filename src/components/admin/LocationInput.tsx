
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";

interface LocationInputProps {
	value: string;
	onChange: (value: string) => void;
	error?: string;
}

interface Location {
	_id: string;
	name: string;
	isPredefined: boolean;
}

const LocationInput: React.FC<LocationInputProps> = ({
	value,
	onChange,
	error,
}) => {
	const [showCustomInput, setShowCustomInput] = useState(false);
	const [customLocation, setCustomLocation] = useState("");
	const [showManageDialog, setShowManageDialog] = useState(false);
	const [newPredefinedLocation, setNewPredefinedLocation] = useState("");

	// Fetch ALL locations (predefined + distinct from creators)
	const { data: allLocations = [], refetch: refetchLocations } = useQuery({
		queryKey: ["all-locations"],
		queryFn: async () => {
			const response = await fetch("http://localhost:3000/api/locations/distinct");
			if (!response.ok) throw new Error("Failed to fetch locations");
			return response.json();
		},
	});

	// Fetch predefined locations for management
	const { data: predefinedLocations = [] } = useQuery({
		queryKey: ["predefined-locations"],
		queryFn: async () => {
			const response = await fetch("http://localhost:3000/api/locations/predefined");
			if (!response.ok) throw new Error("Failed to fetch predefined locations");
			return response.json();
		},
	});

	// Check if current value is custom (not in all locations list)
	useEffect(() => {
		if (value && !allLocations.includes(value)) {
			setShowCustomInput(true);
			setCustomLocation(value);
		}
	}, [value, allLocations]);

	const handleLocationSelect = (selectedValue: string) => {
		if (selectedValue === "custom") {
			setShowCustomInput(true);
			setCustomLocation("");
			onChange("");
		} else {
			setShowCustomInput(false);
			setCustomLocation("");
			onChange(selectedValue);
		}
	};

	const handleCustomLocationChange = (customValue: string) => {
		setCustomLocation(customValue);
		onChange(customValue);
	};

	const handleAddPredefinedLocation = async () => {
		if (!newPredefinedLocation.trim()) return;

		try {
			const response = await fetch("http://localhost:3000/api/locations/predefined", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: newPredefinedLocation.trim() }),
			});

			if (response.ok) {
				setNewPredefinedLocation("");
				refetchLocations();
			}
		} catch (error) {
			console.error("Error adding predefined location:", error);
		}
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<Label htmlFor="location">Location *</Label>
				<Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
					<DialogTrigger asChild>
						<Button variant="outline" size="sm" type="button">
							<Plus className="h-4 w-4 mr-1" />
							Manage
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Manage Predefined Locations</DialogTitle>
						</DialogHeader>
						<div className="space-y-4">
							<div className="flex gap-2">
								<Input
									placeholder="Add new predefined location"
									value={newPredefinedLocation}
									onChange={(e) => setNewPredefinedLocation(e.target.value)}
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddPredefinedLocation();
										}
									}}
								/>
								<Button onClick={handleAddPredefinedLocation} type="button">
									Add
								</Button>
							</div>
							<div className="space-y-2">
								<h4 className="text-sm font-medium">Current Predefined Locations:</h4>
								<div className="max-h-40 overflow-y-auto space-y-1">
									{predefinedLocations.map((location: Location) => (
										<div
											key={location._id}
											className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
										>
											<span>{location.name}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			<Select
				value={showCustomInput ? "custom" : value}
				onValueChange={handleLocationSelect}
			>
				<SelectTrigger className={error ? "border-red-500" : ""}>
					<SelectValue placeholder="Select or enter location" />
				</SelectTrigger>
				<SelectContent>
					{allLocations.map((location: string, index: number) => (
						<SelectItem key={index} value={location}>
							{location}
						</SelectItem>
					))}
					<SelectItem value="custom">
						<div className="flex items-center">
							<Plus className="h-4 w-4 mr-2" />
							Enter custom location
						</div>
					</SelectItem>
				</SelectContent>
			</Select>

			{showCustomInput && (
				<div className="flex gap-2 items-center">
					<Input
						placeholder="Enter custom location"
						value={customLocation}
						onChange={(e) => handleCustomLocationChange(e.target.value)}
						className={error ? "border-red-500" : ""}
					/>
					<Button
						variant="outline"
						size="sm"
						onClick={() => {
							setShowCustomInput(false);
							setCustomLocation("");
							onChange("");
						}}
						type="button"
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			)}

			{error && <p className="text-red-500 text-xs">{error}</p>}
		</div>
	);
};

export default LocationInput;
