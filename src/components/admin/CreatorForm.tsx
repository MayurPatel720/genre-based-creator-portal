
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useCreators } from "../../hooks/useCreators";
import { Creator } from "../../types/Creator";
import { CreateCreatorData } from "../../services/api";
import LocationInput from "./LocationInput";

interface CreatorFormProps {
	creator?: Creator | null;
	onSuccess: () => void;
	onCancel: () => void;
}

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	genre: z.string().min(1, "Genre is required"),
	avatar: z.string().url("Avatar must be a valid URL"),
	platform: z.enum(["Instagram", "YouTube", "TikTok", "Twitter", "Other"]),
	socialLink: z.string().url("Social link must be a valid URL"),
	location: z.string().min(1, "Location is required"),
	phoneNumber: z.string().optional(),
	mediaKit: z.string().url("Media kit must be a valid URL").optional().or(z.literal("")),
	details: z.object({
		bio: z.string().min(1, "Bio is required"),
		analytics: z.object({
			followers: z.number().min(0, "Followers must be 0 or greater"),
			totalViews: z.number().min(0, "Total views must be 0 or greater"),
			averageViews: z.number().min(0, "Average views must be 0 or greater").optional(),
		}),
		reels: z.array(z.string()).default([]),
	}),
});

type FormData = z.infer<typeof formSchema>;

const CreatorForm: React.FC<CreatorFormProps> = ({
	creator,
	onSuccess,
	onCancel,
}) => {
	const { createCreator, updateCreator, loading } = useCreators();
	const [reelInput, setReelInput] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
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
		},
	});

	const watchedReels = watch("details.reels");

	useEffect(() => {
		if (creator) {
			reset({
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
					analytics: {
						followers: creator.details.analytics.followers,
						totalViews: creator.details.analytics.totalViews,
						averageViews: creator.details.analytics.averageViews || 0,
					},
					reels: creator.details.reels || [],
				},
			});
		}
	}, [creator, reset]);

	const onSubmit = async (data: FormData) => {
		try {
			const formattedData: CreateCreatorData = {
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
					location: data.location,
					analytics: {
						followers: data.details.analytics.followers,
						totalViews: data.details.analytics.totalViews,
						averageViews: data.details.analytics.averageViews,
					},
					reels: data.details.reels,
				},
			};

			if (creator?._id) {
				await updateCreator(creator._id, formattedData);
			} else {
				await createCreator(formattedData);
			}
			onSuccess();
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	const addReel = () => {
		if (reelInput.trim()) {
			const currentReels = watchedReels || [];
			setValue("details.reels", [...currentReels, reelInput.trim()]);
			setReelInput("");
		}
	};

	const removeReel = (index: number) => {
		const currentReels = watchedReels || [];
		setValue("details.reels", currentReels.filter((_, i) => i !== index));
	};

	return (
		<div className="p-6">
			<h2 className="text-xl font-semibold mb-6">
				{creator ? "Edit Creator" : "Add New Creator"}
			</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Basic Information */}
					<div>
						<Label htmlFor="name">Name *</Label>
						<Input
							id="name"
							{...register("name")}
							className={errors.name ? "border-red-500" : ""}
						/>
						{errors.name && (
							<p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
						)}
					</div>

					<div>
						<Label htmlFor="genre">Genre *</Label>
						<Input
							id="genre"
							{...register("genre")}
							className={errors.genre ? "border-red-500" : ""}
						/>
						{errors.genre && (
							<p className="text-red-500 text-xs mt-1">{errors.genre.message}</p>
						)}
					</div>

					<div>
						<Label htmlFor="avatar">Avatar URL *</Label>
						<Input
							id="avatar"
							{...register("avatar")}
							className={errors.avatar ? "border-red-500" : ""}
							placeholder="https://example.com/avatar.jpg"
						/>
						{errors.avatar && (
							<p className="text-red-500 text-xs mt-1">{errors.avatar.message}</p>
						)}
					</div>

					<div>
						<Label htmlFor="platform">Platform *</Label>
						<Select
							value={watch("platform")}
							onValueChange={(value) => setValue("platform", value as "Instagram" | "YouTube" | "TikTok" | "Twitter" | "Other")}
						>
							<SelectTrigger className={errors.platform ? "border-red-500" : ""}>
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
							<p className="text-red-500 text-xs mt-1">{errors.platform.message}</p>
						)}
					</div>

					<div>
						<Label htmlFor="socialLink">Social Link *</Label>
						<Input
							id="socialLink"
							{...register("socialLink")}
							className={errors.socialLink ? "border-red-500" : ""}
							placeholder="https://instagram.com/username"
						/>
						{errors.socialLink && (
							<p className="text-red-500 text-xs mt-1">{errors.socialLink.message}</p>
						)}
					</div>

					<div>
						<LocationInput
							value={watch("location")}
							onChange={(value) => setValue("location", value)}
							error={errors.location?.message}
						/>
					</div>

					<div>
						<Label htmlFor="phoneNumber">Phone Number</Label>
						<Input
							id="phoneNumber"
							{...register("phoneNumber")}
							className={errors.phoneNumber ? "border-red-500" : ""}
						/>
						{errors.phoneNumber && (
							<p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
						)}
					</div>

					<div>
						<Label htmlFor="mediaKit">Media Kit URL</Label>
						<Input
							id="mediaKit"
							{...register("mediaKit")}
							className={errors.mediaKit ? "border-red-500" : ""}
							placeholder="https://example.com/mediakit.pdf"
						/>
						{errors.mediaKit && (
							<p className="text-red-500 text-xs mt-1">{errors.mediaKit.message}</p>
						)}
					</div>
				</div>

				{/* Details Section */}
				<div className="space-y-4">
					<h3 className="text-lg font-medium">Details</h3>

					<div>
						<Label htmlFor="bio">Bio *</Label>
						<Textarea
							id="bio"
							{...register("details.bio")}
							className={errors.details?.bio ? "border-red-500" : ""}
							rows={4}
						/>
						{errors.details?.bio && (
							<p className="text-red-500 text-xs mt-1">{errors.details.bio.message}</p>
						)}
					</div>

					{/* Analytics */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div>
							<Label htmlFor="followers">Followers *</Label>
							<Input
								id="followers"
								type="number"
								{...register("details.analytics.followers", { valueAsNumber: true })}
								className={errors.details?.analytics?.followers ? "border-red-500" : ""}
							/>
							{errors.details?.analytics?.followers && (
								<p className="text-red-500 text-xs mt-1">{errors.details.analytics.followers.message}</p>
							)}
						</div>

						<div>
							<Label htmlFor="totalViews">Total Views *</Label>
							<Input
								id="totalViews"
								type="number"
								{...register("details.analytics.totalViews", { valueAsNumber: true })}
								className={errors.details?.analytics?.totalViews ? "border-red-500" : ""}
							/>
							{errors.details?.analytics?.totalViews && (
								<p className="text-red-500 text-xs mt-1">{errors.details.analytics.totalViews.message}</p>
							)}
						</div>

						<div>
							<Label htmlFor="averageViews">Average Views</Label>
							<Input
								id="averageViews"
								type="number"
								{...register("details.analytics.averageViews", { valueAsNumber: true })}
								className={errors.details?.analytics?.averageViews ? "border-red-500" : ""}
							/>
							{errors.details?.analytics?.averageViews && (
								<p className="text-red-500 text-xs mt-1">{errors.details.analytics.averageViews.message}</p>
							)}
						</div>
					</div>

					{/* Reels */}
					<div>
						<Label>Reels</Label>
						<div className="flex gap-2 mb-2">
							<Input
								value={reelInput}
								onChange={(e) => setReelInput(e.target.value)}
								placeholder="Enter reel URL"
								className="flex-1"
							/>
							<Button type="button" onClick={addReel} variant="outline">
								Add
							</Button>
						</div>
						{watchedReels && watchedReels.length > 0 && (
							<div className="space-y-2">
								{watchedReels.map((reel, index) => (
									<div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
										<span className="flex-1 text-sm">{reel}</span>
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => removeReel(index)}
										>
											Remove
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Form Actions */}
				<div className="flex gap-4 pt-4">
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
