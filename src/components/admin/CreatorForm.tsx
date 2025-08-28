
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { API_BASE_URL } from "../../services/api";
import LocationInput from "./LocationInput";

interface CreatorFormProps {
	onSuccess: () => void;
	onCancel: () => void;
}

interface CreatorFormData {
	name: string;
	genre: string;
	avatar: string;
	platform: string;
	socialLink: string;
	location: string;
	phoneNumber: string;
	mediaKit: string;
	details: {
		bio: string;
		analytics: {
			followers: number;
			totalViews: number;
			averageViews: number;
		};
		reels: string[];
	};
}

const CreatorForm: React.FC<CreatorFormProps> = ({ onSuccess, onCancel }) => {
	const queryClient = useQueryClient();
	
	const [formData, setFormData] = useState<CreatorFormData>({
		name: "",
		genre: "",
		avatar: "",
		platform: "Instagram",
		socialLink: "",
		location: "",
		phoneNumber: "",
		mediaKit: "",
		details: {
			bio: "",
			analytics: {
				followers: 0,
				totalViews: 0,
				averageViews: 0,
			},
			reels: [],
		},
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	// Fetch distinct genres from existing creators
	const { data: genres = [] } = useQuery({
		queryKey: ["distinct-genres"],
		queryFn: async () => {
			const response = await fetch(`${API_BASE_URL}/creators`);
			if (!response.ok) throw new Error("Failed to fetch creators");
			const creators = await response.json();
			const uniqueGenres = [...new Set(creators.map((creator: any) => creator.genre))];
			return uniqueGenres.filter(Boolean).sort();
		},
	});

	// Create creator mutation
	const createCreatorMutation = useMutation({
		mutationFn: async (data: CreatorFormData) => {
			const response = await fetch(`${API_BASE_URL}/creators`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (!response.ok) {
				throw new Error("Failed to create creator");
			}
			return response.json();
		},
		onSuccess: () => {
			toast.success("Creator created successfully!");
			queryClient.invalidateQueries({ queryKey: ["creators"] });
			queryClient.invalidateQueries({ queryKey: ["creators-admin"] });
			onSuccess();
		},
		onError: (error: Error) => {
			toast.error(`Failed to create creator: ${error.message}`);
		},
	});

	const handleInputChange = (field: string, value: any) => {
		if (field.includes(".")) {
			const [parent, child, grandchild] = field.split(".");
			setFormData((prev) => ({
				...prev,
				[parent]: {
					...prev[parent as keyof CreatorFormData],
					[child]: grandchild 
						? {
							...(prev[parent as keyof CreatorFormData] as any)[child],
							[grandchild]: value,
						}
						: value,
				},
			}));
		} else {
			setFormData((prev) => ({ ...prev, [field]: value }));
		}
		
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) newErrors.name = "Name is required";
		if (!formData.genre.trim()) newErrors.genre = "Genre is required";
		if (!formData.avatar.trim()) newErrors.avatar = "Avatar URL is required";
		if (!formData.socialLink.trim()) newErrors.socialLink = "Social link is required";
		if (!formData.location.trim()) newErrors.location = "Location is required";
		if (!formData.details.bio.trim()) newErrors["details.bio"] = "Bio is required";
		if (formData.details.analytics.followers < 0) newErrors["details.analytics.followers"] = "Followers must be positive";
		if (formData.details.analytics.totalViews < 0) newErrors["details.analytics.totalViews"] = "Total views must be positive";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!validateForm()) {
			toast.error("Please fix the form errors");
			return;
		}

		createCreatorMutation.mutate(formData);
	};

	return (
		<div className="space-y-6">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label htmlFor="name">Name *</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) => handleInputChange("name", e.target.value)}
							className={errors.name ? "border-red-500" : ""}
						/>
						{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
					</div>

					<div>
						<Label htmlFor="genre">Genre *</Label>
						<Select
							value={formData.genre}
							onValueChange={(value) => handleInputChange("genre", value)}
						>
							<SelectTrigger className={errors.genre ? "border-red-500" : ""}>
								<SelectValue placeholder="Select or enter genre" />
							</SelectTrigger>
							<SelectContent>
								{genres.map((genre: string) => (
									<SelectItem key={genre} value={genre}>
										{genre}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.genre && <p className="text-red-500 text-xs mt-1">{errors.genre}</p>}
					</div>
				</div>

				<div>
					<Label htmlFor="avatar">Avatar URL *</Label>
					<Input
						id="avatar"
						value={formData.avatar}
						onChange={(e) => handleInputChange("avatar", e.target.value)}
						className={errors.avatar ? "border-red-500" : ""}
					/>
					{errors.avatar && <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>}
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label htmlFor="platform">Platform *</Label>
						<Select
							value={formData.platform}
							onValueChange={(value) => handleInputChange("platform", value)}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Instagram">Instagram</SelectItem>
								<SelectItem value="YouTube">YouTube</SelectItem>
								<SelectItem value="TikTok">TikTok</SelectItem>
								<SelectItem value="Twitter">Twitter</SelectItem>
								<SelectItem value="Other">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor="socialLink">Social Link *</Label>
						<Input
							id="socialLink"
							value={formData.socialLink}
							onChange={(e) => handleInputChange("socialLink", e.target.value)}
							className={errors.socialLink ? "border-red-500" : ""}
						/>
						{errors.socialLink && <p className="text-red-500 text-xs mt-1">{errors.socialLink}</p>}
					</div>
				</div>

				<LocationInput
					value={formData.location}
					onChange={(value) => handleInputChange("location", value)}
					error={errors.location}
				/>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label htmlFor="phoneNumber">Phone Number</Label>
						<Input
							id="phoneNumber"
							value={formData.phoneNumber}
							onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
						/>
					</div>

					<div>
						<Label htmlFor="mediaKit">Media Kit URL</Label>
						<Input
							id="mediaKit"
							value={formData.mediaKit}
							onChange={(e) => handleInputChange("mediaKit", e.target.value)}
						/>
					</div>
				</div>

				<div>
					<Label htmlFor="bio">Bio *</Label>
					<Textarea
						id="bio"
						value={formData.details.bio}
						onChange={(e) => handleInputChange("details.bio", e.target.value)}
						className={errors["details.bio"] ? "border-red-500" : ""}
						rows={3}
					/>
					{errors["details.bio"] && <p className="text-red-500 text-xs mt-1">{errors["details.bio"]}</p>}
				</div>

				<div className="grid grid-cols-3 gap-4">
					<div>
						<Label htmlFor="followers">Followers *</Label>
						<Input
							id="followers"
							type="number"
							value={formData.details.analytics.followers}
							onChange={(e) => handleInputChange("details.analytics.followers", parseInt(e.target.value) || 0)}
							className={errors["details.analytics.followers"] ? "border-red-500" : ""}
						/>
						{errors["details.analytics.followers"] && <p className="text-red-500 text-xs mt-1">{errors["details.analytics.followers"]}</p>}
					</div>

					<div>
						<Label htmlFor="totalViews">Total Views *</Label>
						<Input
							id="totalViews"
							type="number"
							value={formData.details.analytics.totalViews}
							onChange={(e) => handleInputChange("details.analytics.totalViews", parseInt(e.target.value) || 0)}
							className={errors["details.analytics.totalViews"] ? "border-red-500" : ""}
						/>
						{errors["details.analytics.totalViews"] && <p className="text-red-500 text-xs mt-1">{errors["details.analytics.totalViews"]}</p>}
					</div>

					<div>
						<Label htmlFor="averageViews">Average Views</Label>
						<Input
							id="averageViews"
							type="number"
							value={formData.details.analytics.averageViews}
							onChange={(e) => handleInputChange("details.analytics.averageViews", parseInt(e.target.value) || 0)}
						/>
					</div>
				</div>

				<div className="flex justify-end space-x-2 pt-4">
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit" disabled={createCreatorMutation.isPending}>
						{createCreatorMutation.isPending ? "Creating..." : "Create Creator"}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CreatorForm;
