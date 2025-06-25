import React, { useState, useEffect } from "react";
import { CreateCreatorData } from "../../services/api";
import { useCreators } from "../../hooks/useCreators";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Creator } from "@/types/Creator";
import ImageUpload from "../ImageUpload";
import { imageUploadAPI } from "../../services/imageUpload";

interface CreatorFormProps {
	creator?: Creator | null;
	onSuccess: () => void;
	onCancel: () => void;
}

const CreatorForm: React.FC<CreatorFormProps> = ({
	creator,
	onSuccess,
	onCancel,
}) => {
	const { createCreator, updateCreator } = useCreators();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<CreateCreatorData>({
		name: "",
		genre: "",
		avatar: "",
		platform: "",
		socialLink: "",
		bio: "",
		followers: 0,
		totalViews: 0,
		reels: [],
		pricing: "",
		tags: [],
	});
	const [currentPublicId, setCurrentPublicId] = useState<string | null>(null);

	// Populate form with creator data when editing
	useEffect(() => {
		if (creator) {
			setFormData({
				name: creator.name || "",
				genre: creator.genre || "",
				avatar: creator.avatar || "",
				platform: creator.platform || "",
				socialLink: creator.socialLink || "",
				bio: creator.details.bio || "",
				followers: creator.details.analytics.followers || 0,
				totalViews: creator.details.analytics.totalViews || 0,
				reels: creator.details.reels || [],
				pricing: creator.details.pricing || "",
				tags: creator.details.tags || [],
			});
		}
	}, [creator]);

	const handleImageUpload = (imageUrl: string) => {
		setFormData(prev => ({ ...prev, avatar: imageUrl }));
	};

	const handleImageDelete = async () => {
		if (currentPublicId) {
			try {
				await imageUploadAPI.deleteImage(currentPublicId);
				setFormData(prev => ({ ...prev, avatar: "" }));
				setCurrentPublicId(null);
			} catch (error) {
				console.error('Failed to delete image:', error);
			}
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		// Client-side validation
		const missingFields = [];
		if (!formData.name) missingFields.push("name");
		if (!formData.genre) missingFields.push("genre");
		if (!formData.avatar) missingFields.push("avatar");
		if (!formData.platform) missingFields.push("platform");
		if (!formData.socialLink) missingFields.push("socialLink");
		if (!formData.bio) missingFields.push("bio");
		if (!formData.pricing) missingFields.push("pricing");
		if (formData.followers === undefined || formData.followers < 0)
			missingFields.push("followers");
		if (formData.totalViews === undefined || formData.totalViews < 0)
			missingFields.push("totalViews");

		if (missingFields.length > 0) {
			setError(
				`Please fill in the following fields: ${missingFields.join(", ")}`
			);
			setLoading(false);
			return;
		}

		// Validate socialLink format
		if (!/^https?:\/\/.+/.test(formData.socialLink)) {
			setError("Please provide a valid URL for socialLink");
			setLoading(false);
			return;
		}

		try {
			// Construct payload matching CreateCreatorData
			const payload: CreateCreatorData = {
				name: formData.name,
				genre: formData.genre,
				avatar: formData.avatar,
				platform: formData.platform,
				socialLink: formData.socialLink,
				bio: formData.bio,
				followers: parseFloat(formData.followers.toString()) || 0,
				totalViews: parseInt(formData.totalViews.toString()) || 0,
				reels: formData.reels || [],
				pricing: formData.pricing,
				tags: formData.tags || [],
			};

			if (creator) {
				await updateCreator(creator._id!, payload);
			} else {
				await createCreator(payload);
			}
			onSuccess();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error("Failed to save creator:", error);
			setError(error.message || "Failed to save creator");
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (
		field: keyof CreateCreatorData,
		value: unknown
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleArrayChange = (field: "reels" | "tags", value: string) => {
		const items = value
			.split(",")
			.map((item) => item.trim())
			.filter(Boolean);
		setFormData((prev) => ({ ...prev, [field]: items }));
	};

	return (
		<div className="p-6 max-w-3xl mx-auto">
			<h2 className="text-2xl font-bold mb-6">
				{creator ? "Edit Creator" : "Add New Creator"}
			</h2>

			{error && <p className="text-red-500 mb-4">{error}</p>}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<div>
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								value={formData.name}
								onChange={(e) => handleInputChange("name", e.target.value)}
								required
								placeholder="Enter creator's name"
							/>
						</div>

						<div>
							<Label htmlFor="genre">Genre</Label>
							<Select
								value={formData.genre}
								onValueChange={(value) => handleInputChange("genre", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a genre" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Video Editing/AI">
										Video Editing/AI
									</SelectItem>
									<SelectItem value="Tips & Tricks/AI">
										Tips & Tricks/AI
									</SelectItem>
									<SelectItem value="Tech Products">Tech Products</SelectItem>
									<SelectItem value="Lifestyle">Lifestyle</SelectItem>
									<SelectItem value="Business">Business</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label>Avatar Image</Label>
							<ImageUpload
								currentImage={formData.avatar}
								onImageUpload={handleImageUpload}
								onImageDelete={handleImageDelete}
								className="mt-2"
							/>
						</div>

						<div>
							<Label htmlFor="platform">Platform</Label>
							<Select
								value={formData.platform}
								onValueChange={(value) => handleInputChange("platform", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select a platform" />
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
							<Label htmlFor="socialLink">Social Profile URL</Label>
							<Input
								id="socialLink"
								value={formData.socialLink}
								onChange={(e) =>
									handleInputChange("socialLink", e.target.value)
								}
								placeholder="https://instagram.com/username"
								type="url"
								required
							/>
						</div>
					</div>

					{/* Analytics and Other Fields */}
					<div className="space-y-4">
						<div>
							<Label htmlFor="followers">Followers</Label>
							<Input
								id="followers"
								type="number"
								step="0.1"
								value={formData.followers}
								onChange={(e) =>
									handleInputChange(
										"followers",
										parseFloat(e.target.value) || 0
									)
								}
								placeholder="e.g., 1000.5"
								min="0"
								required
							/>
						</div>

						<div>
							<Label htmlFor="totalViews">Total Views</Label>
							<Input
								id="totalViews"
								type="number"
								value={formData.totalViews}
								onChange={(e) =>
									handleInputChange("totalViews", parseInt(e.target.value) || 0)
								}
								placeholder="e.g., 50000"
								min="0"
								required
							/>
						</div>

						<div>
							<Label htmlFor="pricing">Pricing</Label>
							<Input
								id="pricing"
								value={formData.pricing}
								onChange={(e) => handleInputChange("pricing", e.target.value)}
								placeholder="e.g., $500-1000/post"
								required
							/>
						</div>

						<div>
							<Label htmlFor="tags">Tags (comma-separated)</Label>
							<Input
								id="tags"
								value={formData.tags.join(", ")}
								onChange={(e) => handleArrayChange("tags", e.target.value)}
								placeholder="tech, AI, editing"
							/>
						</div>
					</div>
				</div>

				{/* Full width fields */}
				<div>
					<Label htmlFor="bio">Bio</Label>
					<Textarea
						id="bio"
						value={formData.bio}
						onChange={(e) => handleInputChange("bio", e.target.value)}
						rows={4}
						placeholder="Creator biography..."
						required
					/>
				</div>

				<div>
					<Label htmlFor="reels">Reel URLs (comma-separated)</Label>
					<Textarea
						id="reels"
						value={formData.reels.join(", ")}
						onChange={(e) => handleArrayChange("reels", e.target.value)}
						rows={3}
						placeholder="https://example.com/reel1, https://example.com/reel2"
					/>
				</div>

				{/* Form Actions */}
				<div className="flex justify-end space-x-4 pt-6 border-t">
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit" disabled={loading}>
						{loading
							? "Saving..."
							: creator
							? "Update Creator"
							: "Create Creator"}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CreatorForm;
