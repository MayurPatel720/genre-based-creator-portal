import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { useCreators } from "../../hooks/useCreators";
import { useToast } from "../../hooks/use-toast";
import { Creator } from "../../types/Creator";
import ImageUpload from "../ImageUpload";

// Define the schema for form validation
const formSchema = z.object({
	name: z.string().min(2, {
		message: "Creator name must be at least 2 characters.",
	}),
	genre: z.string().min(2, {
		message: "Genre must be at least 2 characters.",
	}),
	avatar: z.string().url({ message: "Avatar must be a valid URL." }),
	platform: z.enum(["Instagram", "YouTube", "TikTok", "Twitter", "Other"]),
	socialLink: z.string().url({ message: "Social link must be a valid URL." }),
	location: z.string().optional(),
	phoneNumber: z.string().optional(),
	mediaKit: z.string().optional(),
	details: z.object({
		bio: z.string().min(10, {
			message: "Bio must be at least 10 characters.",
		}),
		location: z.string().optional(),
		analytics: z.object({
			followers: z.number().min(0, {
				message: "Followers must be a positive number.",
			}).default(0),
			totalViews: z.number().min(0, {
				message: "Total views must be a positive number.",
			}).default(0),
			averageViews: z.number().optional(),
		}),
		reels: z.array(z.string()).optional(),
	}),
});

// Define the form data type based on the schema
type CreatorFormData = z.infer<typeof formSchema>;

interface CreatorFormProps {
	creator?: Creator;
	onSuccess: () => void;
	onCancel: () => void;
}

const CreatorForm: React.FC<CreatorFormProps> = ({ creator, onSuccess, onCancel }) => {
	const { createCreator, updateCreator } = useCreators();
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Initialize the form with react-hook-form
	const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreatorFormData>({
		resolver: zodResolver(formSchema),
		defaultValues: creator
			? {
				name: creator.name,
				genre: creator.genre,
				avatar: creator.avatar,
				platform: creator.platform,
				socialLink: creator.socialLink,
				location: creator.location || "",
				phoneNumber: creator.phoneNumber || "",
				mediaKit: creator.mediaKit || "",
				details: {
					bio: creator.details.bio,
					location: creator.details.location || "",
					analytics: {
						followers: creator.details.analytics.followers,
						totalViews: creator.details.analytics.totalViews,
						averageViews: creator.details.analytics.averageViews,
					},
					reels: creator.details.reels || [],
				},
			}
			: {
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

	useEffect(() => {
		if (creator) {
			// Update form values when editing a creator
			setValue("name", creator.name);
			setValue("genre", creator.genre);
			setValue("avatar", creator.avatar);
			setValue("platform", creator.platform);
			setValue("socialLink", creator.socialLink);
			setValue("location", creator.location || "");
			setValue("phoneNumber", creator.phoneNumber || "");
			setValue("mediaKit", creator.mediaKit || "");
			setValue("details.bio", creator.details.bio);
			setValue("details.location", creator.details.location || "");
			setValue("details.analytics.followers", creator.details.analytics.followers);
			setValue("details.analytics.totalViews", creator.details.analytics.totalViews);
			setValue("details.analytics.averageViews", creator.details.analytics.averageViews);
			setValue("details.reels", creator.details.reels || []);
		}
	}, [creator, setValue]);

	const handleAvatarUpload = (imageUrl: string) => {
		setValue("avatar", imageUrl);
	};

	const handleAvatarDelete = () => {
		setValue("avatar", "");
	};

	// Handle form submission
	const onSubmit = async (data: CreatorFormData) => {
		setIsSubmitting(true);
		try {
			if (creator) {
				// Update existing creator
				await updateCreator(creator._id as string, data);
				toast({
					title: "Success!",
					description: "Creator updated successfully.",
				});
			} else {
				// Create new creator
				await createCreator(data);
				toast({
					title: "Success!",
					description: "Creator created successfully.",
				});
			}
			onSuccess();
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "Failed to save creator. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold">
						{creator ? "Edit Creator" : "Add New Creator"}
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Avatar Upload Section */}
						<div className="space-y-2">
							<Label>Avatar</Label>
							<ImageUpload
								currentImage={watch("avatar")}
								onImageUpload={handleAvatarUpload}
								onImageDelete={handleAvatarDelete}
								className="flex justify-center"
							/>
						</div>

						{/* Name Input */}
						<div className="space-y-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="Enter creator name"
								{...register("name")}
							/>
							{errors.name && (
								<p className="text-red-500 text-sm">{errors.name.message}</p>
							)}
						</div>

						{/* Genre Input */}
						<div className="space-y-2">
							<Label htmlFor="genre">Genre</Label>
							<Input
								id="genre"
								type="text"
								placeholder="Enter genre"
								{...register("genre")}
							/>
							{errors.genre && (
								<p className="text-red-500 text-sm">{errors.genre.message}</p>
							)}
						</div>

						{/* Platform Select */}
						<div className="space-y-2">
							<Label htmlFor="platform">Platform</Label>
							<Select>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Select platform" {...register("platform")} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Instagram" {...register("platform")}>Instagram</SelectItem>
									<SelectItem value="YouTube" {...register("platform")}>YouTube</SelectItem>
									<SelectItem value="TikTok" {...register("platform")}>TikTok</SelectItem>
									<SelectItem value="Twitter" {...register("platform")}>Twitter</SelectItem>
									<SelectItem value="Other" {...register("platform")}>Other</SelectItem>
								</SelectContent>
							</Select>
							{errors.platform && (
								<p className="text-red-500 text-sm">{errors.platform.message}</p>
							)}
						</div>

						{/* Social Link Input */}
						<div className="space-y-2">
							<Label htmlFor="socialLink">Social Link</Label>
							<Input
								id="socialLink"
								type="text"
								placeholder="Enter social link"
								{...register("socialLink")}
							/>
							{errors.socialLink && (
								<p className="text-red-500 text-sm">{errors.socialLink.message}</p>
							)}
						</div>

						{/* Location Input */}
						<div className="space-y-2">
							<Label htmlFor="location">Location</Label>
							<Input
								id="location"
								type="text"
								placeholder="Enter location"
								{...register("location")}
							/>
							{errors.location && (
								<p className="text-red-500 text-sm">{errors.location.message}</p>
							)}
						</div>

						{/* Phone Number Input */}
						<div className="space-y-2">
							<Label htmlFor="phoneNumber">Phone Number</Label>
							<Input
								id="phoneNumber"
								type="text"
								placeholder="Enter phone number"
								{...register("phoneNumber")}
							/>
							{errors.phoneNumber && (
								<p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
							)}
						</div>

						{/* Media Kit Input */}
						<div className="space-y-2">
							<Label htmlFor="mediaKit">Media Kit</Label>
							<Input
								id="mediaKit"
								type="text"
								placeholder="Enter media kit link"
								{...register("mediaKit")}
							/>
							{errors.mediaKit && (
								<p className="text-red-500 text-sm">{errors.mediaKit.message}</p>
							)}
						</div>

						{/* Bio Textarea */}
						<div className="space-y-2">
							<Label htmlFor="bio">Bio</Label>
							<Textarea
								id="bio"
								placeholder="Enter bio"
								{...register("details.bio")}
							/>
							{errors.details?.bio && (
								<p className="text-red-500 text-sm">{errors.details.bio.message}</p>
							)}
						</div>

						{/* Details Location Input */}
						<div className="space-y-2">
							<Label htmlFor="detailsLocation">Details Location</Label>
							<Input
								id="detailsLocation"
								type="text"
								placeholder="Enter details location"
								{...register("details.location")}
							/>
							{errors.details?.location && (
								<p className="text-red-500 text-sm">{errors.details.location.message}</p>
							)}
						</div>

						{/* Analytics Followers Input */}
						<div className="space-y-2">
							<Label htmlFor="followers">Followers</Label>
							<Input
								id="followers"
								type="number"
								placeholder="Enter followers count"
								{...register("details.analytics.followers", { valueAsNumber: true })}
							/>
							{errors.details?.analytics?.followers && (
								<p className="text-red-500 text-sm">{errors.details.analytics.followers.message}</p>
							)}
						</div>

						{/* Analytics Total Views Input */}
						<div className="space-y-2">
							<Label htmlFor="totalViews">Total Views</Label>
							<Input
								id="totalViews"
								type="number"
								placeholder="Enter total views count"
								{...register("details.analytics.totalViews", { valueAsNumber: true })}
							/>
							{errors.details?.analytics?.totalViews && (
								<p className="text-red-500 text-sm">{errors.details.analytics.totalViews.message}</p>
							)}
						</div>

						{/* Analytics Average Views Input */}
						<div className="space-y-2">
							<Label htmlFor="averageViews">Average Views</Label>
							<Input
								id="averageViews"
								type="number"
								placeholder="Enter average views count"
								{...register("details.analytics.averageViews", { valueAsNumber: true })}
							/>
							{errors.details?.analytics?.averageViews && (
								<p className="text-red-500 text-sm">{errors.details.analytics.averageViews.message}</p>
							)}
						</div>

						<Separator />

						{/* Form Actions */}
						<div className="flex justify-end space-x-4">
							<Button type="button" variant="outline" onClick={onCancel}>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Saving..." : creator ? "Update Creator" : "Create Creator"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default CreatorForm;
