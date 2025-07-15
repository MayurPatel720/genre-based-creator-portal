import React, { useState, useEffect } from "react";
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
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Creator } from "../../types/Creator";
import { useCreators } from "../../hooks/useCreators";
import {
	API_BASE_URL,
	CreateCreatorData,
	UpdateCreatorData,
} from "../../services/api";
import LocationInput from "./LocationInput";
import ImageUpload from "../ImageUpload";
import MediaManager from "./MediaManager";
import { useToast } from "../../hooks/use-toast";

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
	const { createCreator, updateCreator, loading } = useCreators();
	const { toast } = useToast();

	const [formData, setFormData] = useState({
		name: "",
		genre: "",
		avatar: "",
		platform: "Instagram" as const,
		socialLink: "",
		location: "Other",
		phoneNumber: "",
		mediaKit: "",
		bio: "",
		followers: 0,
		totalViews: 0,
		averageViews: 0,
		reels: [] as string[],
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		if (creator) {
			setFormData({
				name: creator.name || "",
				genre: creator.genre || "",
				avatar: creator.avatar || "",
				platform: (creator.platform as any) || "Instagram",
				socialLink: creator.socialLink || "",
				location: creator.location || "Other",
				phoneNumber: creator.phoneNumber || "",
				mediaKit: creator.mediaKit || "",
				bio: creator.details?.bio || "",
				followers: creator.details?.analytics?.followers || 0,
				totalViews: creator.details?.analytics?.totalViews || 0,
				averageViews: creator.details?.analytics?.averageViews || 0,
				reels: creator.details?.reels || [],
			});
		}
	}, [creator]);

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) newErrors.name = "Name is required";
		if (!formData.genre.trim()) newErrors.genre = "Genre is required";
		if (!formData.avatar.trim()) newErrors.avatar = "Avatar is required";
		if (!formData.socialLink.trim())
			newErrors.socialLink = "Social link is required";
		if (!formData.bio.trim()) newErrors.bio = "Bio is required";
		if (!formData.location.trim()) newErrors.location = "Location is required";
		if (formData.followers < 0)
			newErrors.followers = "Followers must be positive";
		if (formData.totalViews < 0)
			newErrors.totalViews = "Total views must be positive";

		if (formData.socialLink && !formData.socialLink.match(/^https?:\/\/.+/i)) {
			newErrors.socialLink = "Social link must be a valid URL";
		}

		if (formData.mediaKit && !formData.mediaKit.match(/^https?:\/\/.+/i)) {
			newErrors.mediaKit = "Media kit must be a valid URL";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			const creatorData: CreateCreatorData | UpdateCreatorData = {
				name: formData.name,
				genre: formData.genre,
				avatar: formData.avatar,
				platform: formData.platform,
				socialLink: formData.socialLink,
				location: formData.location,
				phoneNumber: formData.phoneNumber,
				mediaKit: formData.mediaKit,
				details: {
					bio: formData.bio,
					location: formData.location,
					analytics: {
						followers: formData.followers,
						totalViews: formData.totalViews,
						averageViews: formData.averageViews,
					},
					reels: formData.reels,
				},
			};

			if (creator?._id) {
				await updateCreator(creator._id, creatorData);
				toast({
					title: "Success!",
					description: "Creator updated successfully",
				});
			} else {
				await createCreator(creatorData as CreateCreatorData);
				toast({
					title: "Success!",
					description: "Creator created successfully",
				});
			}

			onSuccess();
		} catch (error) {
			console.error("Error saving creator:", error);
			toast({
				title: "Error",
				description: "Failed to save creator. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleInputChange = (field: string, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	const handleMediaAdd = async (file: File, caption: string) => {
		if (!creator?._id) {
			toast({
				title: "Error",
				description: "Please save the creator first before adding media",
				variant: "destructive",
			});
			return;
		}

		try {
			const formData = new FormData();
			formData.append("media", file);
			formData.append("caption", caption);

			const response = await fetch(`${API_BASE_URL}/media/${creator._id}`, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to upload media");
			}

			const mediaFile = await response.json();

			toast({
				title: "Success!",
				description: "Media uploaded successfully",
			});

			// Refresh the creator data to show new media
			window.location.reload();
		} catch (error) {
			console.error("Error uploading media:", error);
			toast({
				title: "Error",
				description: "Failed to upload media. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleMediaDelete = async (mediaId: string) => {
		if (!creator?._id) return;

		console.log("Deleting media:", mediaId);
		try {
			// Import mediaService at the top if not already imported
			const { mediaService } = await import("../../services/mediaAPI");
			
			await mediaService.deleteMedia(creator._id, mediaId);

			toast({
				title: "Success!",
				description: "Media deleted successfully",
			});

			// Refresh the creator data
			window.location.reload();
		} catch (error) {
			console.error("Error deleting media:", error);
			toast({
				title: "Error",
				description: "Failed to delete media. Please try again.",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-900">
					{creator ? "Edit Creator" : "Add New Creator"}
				</h2>
				<p className="text-gray-600">
					{creator
						? "Update creator information"
						: "Fill in the details to create a new creator profile"}
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
						<CardDescription>Essential creator details</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="name">Creator Name *</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									className={errors.name ? "border-red-500" : ""}
								/>
								{errors.name && (
									<p className="text-red-500 text-xs">{errors.name}</p>
								)}
							</div>

							<div>
								<Label htmlFor="genre">Genre *</Label>
								<Input
									id="genre"
									value={formData.genre}
									onChange={(e) => handleInputChange("genre", e.target.value)}
									className={errors.genre ? "border-red-500" : ""}
								/>
								{errors.genre && (
									<p className="text-red-500 text-xs">{errors.genre}</p>
								)}
							</div>
						</div>

						<div>
							<Label>Avatar Image *</Label>
							<ImageUpload
								currentImage={formData.avatar}
								onImageUpload={(url) => handleInputChange("avatar", url)}
								onImageDelete={() => handleInputChange("avatar", "")}
							/>
							{errors.avatar && (
								<p className="text-red-500 text-xs">{errors.avatar}</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="platform">Platform *</Label>
								<Select
									value={formData.platform}
									onValueChange={(value) =>
										handleInputChange("platform", value)
									}
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
									type="url"
									value={formData.socialLink}
									onChange={(e) =>
										handleInputChange("socialLink", e.target.value)
									}
									className={errors.socialLink ? "border-red-500" : ""}
								/>
								{errors.socialLink && (
									<p className="text-red-500 text-xs">{errors.socialLink}</p>
								)}
							</div>
						</div>

						<LocationInput
							value={formData.location}
							onChange={(value) => handleInputChange("location", value)}
							error={errors.location}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="phoneNumber">Phone Number</Label>
								<Input
									id="phoneNumber"
									value={formData.phoneNumber}
									onChange={(e) =>
										handleInputChange("phoneNumber", e.target.value)
									}
								/>
							</div>

							<div>
								<Label htmlFor="mediaKit">Media Kit URL</Label>
								<Input
									id="mediaKit"
									type="url"
									value={formData.mediaKit}
									onChange={(e) =>
										handleInputChange("mediaKit", e.target.value)
									}
									className={errors.mediaKit ? "border-red-500" : ""}
								/>
								{errors.mediaKit && (
									<p className="text-red-500 text-xs">{errors.mediaKit}</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Creator Details */}
				<Card>
					<CardHeader>
						<CardTitle>Creator Details</CardTitle>
						<CardDescription>Bio and analytics information</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="bio">Bio *</Label>
							<Textarea
								id="bio"
								rows={4}
								value={formData.bio}
								onChange={(e) => handleInputChange("bio", e.target.value)}
								className={errors.bio ? "border-red-500" : ""}
							/>
							{errors.bio && (
								<p className="text-red-500 text-xs">{errors.bio}</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<Label htmlFor="followers">Followers *</Label>
								<Input
									id="followers"
									type="number"
									min="0"
									value={formData.followers}
									onChange={(e) =>
										handleInputChange(
											"followers",
											parseInt(e.target.value) || 0
										)
									}
									className={errors.followers ? "border-red-500" : ""}
								/>
								{errors.followers && (
									<p className="text-red-500 text-xs">{errors.followers}</p>
								)}
							</div>

							<div>
								<Label htmlFor="totalViews">Total Views *</Label>
								<Input
									id="totalViews"
									type="number"
									min="0"
									value={formData.totalViews}
									onChange={(e) =>
										handleInputChange(
											"totalViews",
											parseInt(e.target.value) || 0
										)
									}
									className={errors.totalViews ? "border-red-500" : ""}
								/>
								{errors.totalViews && (
									<p className="text-red-500 text-xs">{errors.totalViews}</p>
								)}
							</div>

							<div>
								<Label htmlFor="averageViews">Average Views</Label>
								<Input
									id="averageViews"
									type="number"
									min="0"
									value={formData.averageViews}
									onChange={(e) =>
										handleInputChange(
											"averageViews",
											parseInt(e.target.value) || 0
										)
									}
								/>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Media Management - Only show if creator exists */}
				{creator?._id && (
					<Card>
						<CardHeader>
							<CardTitle>Media Gallery</CardTitle>
							<CardDescription>Manage creator's media files</CardDescription>
						</CardHeader>
						<CardContent>
							<MediaManager
								creatorId={creator._id}
								media={creator.details?.media || []}
								onMediaAdd={handleMediaAdd}
								onMediaDelete={handleMediaDelete}
							/>
						</CardContent>
					</Card>
				)}

				{/* Form Actions */}
				<div className="flex gap-4 pt-6">
					<Button type="submit" disabled={loading} className="flex-1">
						{loading
							? "Saving..."
							: creator
							? "Update Creator"
							: "Create Creator"}
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={onCancel}
						className="flex-1"
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CreatorForm;
