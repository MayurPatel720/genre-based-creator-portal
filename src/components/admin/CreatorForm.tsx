
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useCreators } from "../../hooks/useCreators";
import { creatorAPI } from "../../services/api";
import { Creator } from "../../types/Creator";
import { useToast } from "../../hooks/use-toast";
import ImageUpload from "../ImageUpload";

const creatorSchema = z.object({
	name: z.string().min(1, "Name is required"),
	genre: z.string().min(1, "Genre is required"),
	avatar: z.string().url("Avatar must be a valid URL"),
	platform: z.enum(["Instagram", "YouTube", "TikTok", "Twitter", "Other"]),
	socialLink: z.string().url("Social link must be a valid URL"),
	location: z.string().min(1, "Location is required"),
	phoneNumber: z.string().optional(),
	mediaKit: z.string().optional(),
	details: z.object({
		bio: z.string().min(1, "Bio is required"),
		location: z.string().min(1, "Location is required"),
		analytics: z.object({
			followers: z.number().min(0),
			totalViews: z.number().min(0),
			averageViews: z.number().min(0).optional(),
		}),
		reels: z.array(z.string()).default([]),
	}),
});

type CreatorFormData = z.infer<typeof creatorSchema>;

interface CreatorFormProps {
	creator?: Creator | null;
	onSuccess: () => void;
	onCancel: () => void;
}

const CreatorForm: React.FC<CreatorFormProps> = ({ creator, onSuccess, onCancel }) => {
	const [loading, setLoading] = useState(false);
	const { createCreator, updateCreator } = useCreators();
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<CreatorFormData>({
		resolver: zodResolver(creatorSchema),
		defaultValues: creator ? {
			name: creator.name,
			genre: creator.genre,
			avatar: creator.avatar,
			platform: creator.platform as "Instagram" | "YouTube" | "TikTok" | "Twitter" | "Other",
			socialLink: creator.socialLink,
			location: creator.location || "",
			phoneNumber: creator.phoneNumber || "",
			mediaKit: creator.mediaKit || "",
			details: {
				bio: creator.details.bio,
				location: creator.details.location,
				analytics: {
					followers: creator.details.analytics.followers,
					totalViews: creator.details.analytics.totalViews,
					averageViews: creator.details.analytics.averageViews || 0,
				},
				reels: creator.details.reels || [],
			},
		} : {
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
				location: "",
				analytics: {
					followers: 0,
					totalViews: 0,
					averageViews: 0,
				},
				reels: [],
			},
		},
	});

	const watchedAvatar = watch("avatar");

	const handleAvatarUpload = (imageUrl: string) => {
		setValue("avatar", imageUrl);
	};

	const handleAvatarDelete = () => {
		setValue("avatar", "");
	};

	const handlePlatformChange = (value: string) => {
		setValue("platform", value as "Instagram" | "YouTube" | "TikTok" | "Twitter" | "Other");
	};

	const onSubmit = async (data: CreatorFormData) => {
		setLoading(true);
		try {
			if (creator?._id) {
				// Update existing creator
				const updateData = {
					name: data.name,
					genre: data.genre,
					avatar: data.avatar,
					platform: data.platform,
					socialLink: data.socialLink,
					location: data.location,
					phoneNumber: data.phoneNumber,
					mediaKit: data.mediaKit,
					details: {
						bio: data.details.bio,
						location: data.details.location,
						analytics: {
							followers: data.details.analytics.followers,
							totalViews: data.details.analytics.totalViews,
							averageViews: data.details.analytics.averageViews,
						},
						reels: data.details.reels,
					},
				};
				await updateCreator(creator._id, updateData);
				toast({
					title: "Success!",
					description: "Creator updated successfully.",
				});
			} else {
				// Create new creator
				const createData = {
					name: data.name,
					genre: data.genre,
					avatar: data.avatar,
					platform: data.platform,
					socialLink: data.socialLink,
					location: data.location,
					phoneNumber: data.phoneNumber,
					mediaKit: data.mediaKit,
					details: {
						bio: data.details.bio,
						location: data.details.location,
						analytics: {
							followers: data.details.analytics.followers,
							totalViews: data.details.analytics.totalViews,
							averageViews: data.details.analytics.averageViews,
						},
						reels: data.details.reels,
					},
				};
				await createCreator(createData);
				toast({
					title: "Success!",
					description: "Creator created successfully.",
				});
			}
			onSuccess();
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to save creator. Please try again.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-6">
				{creator ? "Edit Creator" : "Add New Creator"}
			</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Avatar Upload */}
				<div className="space-y-2">
					<Label>Avatar</Label>
					<ImageUpload
						currentImage={watchedAvatar}
						onImageUpload={handleAvatarUpload}
						onImageDelete={handleAvatarDelete}
					/>
					{errors.avatar && (
						<p className="text-red-500 text-sm">{errors.avatar.message}</p>
					)}
				</div>

				{/* Basic Information */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name *</Label>
						<Input
							id="name"
							{...register("name")}
							placeholder="Creator name"
						/>
						{errors.name && (
							<p className="text-red-500 text-sm">{errors.name.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="genre">Genre *</Label>
						<Input
							id="genre"
							{...register("genre")}
							placeholder="e.g. Fashion, Food, Tech"
						/>
						{errors.genre && (
							<p className="text-red-500 text-sm">{errors.genre.message}</p>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="platform">Platform *</Label>
						<Select onValueChange={handlePlatformChange} defaultValue={watch("platform")}>
							<SelectTrigger>
								<SelectValue placeholder="Select platform" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Instagram">Instagram</SelectItem>
								<SelectItem value="YouTube">YouTube</SelectItem>
								<SelectItem value="TikTok">TikTok</SelectItem>
								<SelectItem value="Twitter">Twitter</SelectItem>
								<SelectItem value="Other">Other</SelectItem>
							</SelectContent>
						</Select>
						{errors.platform && (
							<p className="text-red-500 text-sm">{errors.platform.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="socialLink">Social Link *</Label>
						<Input
							id="socialLink"
							{...register("socialLink")}
							placeholder="https://instagram.com/username"
						/>
						{errors.socialLink && (
							<p className="text-red-500 text-sm">{errors.socialLink.message}</p>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="location">Location *</Label>
						<Input
							id="location"
							{...register("location")}
							placeholder="City, Country"
						/>
						{errors.location && (
							<p className="text-red-500 text-sm">{errors.location.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="phoneNumber">Phone Number</Label>
						<Input
							id="phoneNumber"
							{...register("phoneNumber")}
							placeholder="+1234567890"
						/>
						{errors.phoneNumber && (
							<p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="mediaKit">Media Kit URL</Label>
					<Input
						id="mediaKit"
						{...register("mediaKit")}
						placeholder="https://example.com/mediakit.pdf"
					/>
					{errors.mediaKit && (
						<p className="text-red-500 text-sm">{errors.mediaKit.message}</p>
					)}
				</div>

				{/* Details Section */}
				<div className="space-y-4">
					<h3 className="text-lg font-semibold">Details</h3>
					
					<div className="space-y-2">
						<Label htmlFor="bio">Bio *</Label>
						<Textarea
							id="bio"
							{...register("details.bio")}
							placeholder="Tell us about the creator..."
							rows={4}
						/>
						{errors.details?.bio && (
							<p className="text-red-500 text-sm">{errors.details.bio.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="detailsLocation">Details Location *</Label>
						<Input
							id="detailsLocation"
							{...register("details.location")}
							placeholder="Detailed location info"
						/>
						{errors.details?.location && (
							<p className="text-red-500 text-sm">{errors.details.location.message}</p>
						)}
					</div>

					{/* Analytics */}
					<div className="space-y-4">
						<h4 className="font-medium">Analytics</h4>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="followers">Followers *</Label>
								<Input
									id="followers"
									type="number"
									{...register("details.analytics.followers", { valueAsNumber: true })}
									placeholder="0"
								/>
								{errors.details?.analytics?.followers && (
									<p className="text-red-500 text-sm">{errors.details.analytics.followers.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="totalViews">Total Views *</Label>
								<Input
									id="totalViews"
									type="number"
									{...register("details.analytics.totalViews", { valueAsNumber: true })}
									placeholder="0"
								/>
								{errors.details?.analytics?.totalViews && (
									<p className="text-red-500 text-sm">{errors.details.analytics.totalViews.message}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor="averageViews">Average Views</Label>
								<Input
									id="averageViews"
									type="number"
									{...register("details.analytics.averageViews", { valueAsNumber: true })}
									placeholder="0"
								/>
								{errors.details?.analytics?.averageViews && (
									<p className="text-red-500 text-sm">{errors.details.analytics.averageViews.message}</p>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Form Actions */}
				<div className="flex gap-4 pt-6">
					<Button type="submit" disabled={loading}>
						{loading ? "Saving..." : creator ? "Update Creator" : "Create Creator"}
					</Button>
					<Button type="button" variant="outline" onClick={onCancel}>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CreatorForm;
