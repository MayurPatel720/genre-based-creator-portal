
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useToast } from "../ui/use-toast";
import { creatorAPI } from "../../services/api";
import LocationInput from "./LocationInput";

const creatorSchema = z.object({
	name: z.string().min(1, "Name is required"),
	genre: z.string().min(1, "Genre is required"),
	avatar: z.string().url("Avatar must be a valid URL").optional().or(z.literal("")),
	platform: z.enum(["Instagram", "YouTube", "TikTok", "Twitter", "Other"]),
	socialLink: z.string().url("Social link must be a valid URL"),
	location: z.string().min(1, "Location is required"),
	phoneNumber: z.string().optional(),
	mediaKit: z.string().url("Media kit must be a valid URL").optional().or(z.literal("")),
	bio: z.string().min(1, "Bio is required"),
	followers: z.number().min(0, "Followers must be a positive number"),
	totalViews: z.number().min(0, "Total views must be a positive number"),
	averageViews: z.number().min(0, "Average views must be a positive number").optional(),
	reels: z.string().min(1, "At least one reel URL is required"),
});

type CreatorFormData = z.infer<typeof creatorSchema>;

interface CreatorFormProps {
	onSuccess?: () => void;
}

const CreatorForm: React.FC<CreatorFormProps> = ({ onSuccess }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
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
		defaultValues: {
			platform: "Instagram",
			location: "",
			avatar: "",
			phoneNumber: "",
			mediaKit: "",
		},
	});

	const locationValue = watch("location");

	const onSubmit = async (data: CreatorFormData) => {
		setIsSubmitting(true);
		try {
			const reelsArray = data.reels
				.split(",")
				.map((url) => url.trim())
				.filter((url) => url.length > 0);

			const creatorData = {
				name: data.name,
				genre: data.genre,
				avatar: data.avatar || "",
				platform: data.platform,
				socialLink: data.socialLink,
				location: data.location,
				phoneNumber: data.phoneNumber || "",
				mediaKit: data.mediaKit || "",
				details: {
					bio: data.bio,
					location: data.location,
					analytics: {
						followers: data.followers,
						totalViews: data.totalViews,
						averageViews: data.averageViews || 0,
					},
					reels: reelsArray,
				},
			};

			const savedCreator = await creatorAPI.create(creatorData);
			
			toast({
				title: "Success",
				description: "Creator profile has been submitted for approval.",
			});

			reset();
			onSuccess?.();
			
		} catch (error) {
			console.error("Error creating creator:", error);
			toast({
				title: "Error",
				description: "Failed to create creator profile. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-bold mb-6">Create Creator Profile</h2>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name *</Label>
						<Input
							id="name"
							{...register("name")}
							className={errors.name ? "border-red-500" : ""}
						/>
						{errors.name && (
							<p className="text-red-500 text-xs">{errors.name.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="genre">Genre *</Label>
						<Select onValueChange={(value) => setValue("genre", value)}>
							<SelectTrigger className={errors.genre ? "border-red-500" : ""}>
								<SelectValue placeholder="Select genre" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Comedy">Comedy</SelectItem>
								<SelectItem value="Fashion">Fashion</SelectItem>
								<SelectItem value="Food">Food</SelectItem>
								<SelectItem value="Travel">Travel</SelectItem>
								<SelectItem value="Tech">Tech</SelectItem>
								<SelectItem value="Fitness">Fitness</SelectItem>
								<SelectItem value="Music">Music</SelectItem>
								<SelectItem value="Art">Art</SelectItem>
								<SelectItem value="Lifestyle">Lifestyle</SelectItem>
								<SelectItem value="Other">Other</SelectItem>
							</SelectContent>
						</Select>
						{errors.genre && (
							<p className="text-red-500 text-xs">{errors.genre.message}</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="avatar">Avatar URL</Label>
					<Input
						id="avatar"
						{...register("avatar")}
						placeholder="https://example.com/avatar.jpg"
						className={errors.avatar ? "border-red-500" : ""}
					/>
					{errors.avatar && (
						<p className="text-red-500 text-xs">{errors.avatar.message}</p>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="platform">Platform *</Label>
						<Select onValueChange={(value) => setValue("platform", value as any)}>
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
							<p className="text-red-500 text-xs">{errors.platform.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="socialLink">Social Link *</Label>
						<Input
							id="socialLink"
							{...register("socialLink")}
							placeholder="https://instagram.com/username"
							className={errors.socialLink ? "border-red-500" : ""}
						/>
						{errors.socialLink && (
							<p className="text-red-500 text-xs">{errors.socialLink.message}</p>
						)}
					</div>
				</div>

				<LocationInput
					value={locationValue}
					onChange={(value) => setValue("location", value)}
					error={errors.location?.message}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="phoneNumber">Phone Number</Label>
						<Input
							id="phoneNumber"
							{...register("phoneNumber")}
							placeholder="+1234567890"
							className={errors.phoneNumber ? "border-red-500" : ""}
						/>
						{errors.phoneNumber && (
							<p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="mediaKit">Media Kit URL</Label>
						<Input
							id="mediaKit"
							{...register("mediaKit")}
							placeholder="https://example.com/mediakit.pdf"
							className={errors.mediaKit ? "border-red-500" : ""}
						/>
						{errors.mediaKit && (
							<p className="text-red-500 text-xs">{errors.mediaKit.message}</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="bio">Bio *</Label>
					<Textarea
						id="bio"
						{...register("bio")}
						placeholder="Tell us about yourself..."
						className={errors.bio ? "border-red-500" : ""}
						rows={4}
					/>
					{errors.bio && (
						<p className="text-red-500 text-xs">{errors.bio.message}</p>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<div className="space-y-2">
						<Label htmlFor="followers">Followers *</Label>
						<Input
							id="followers"
							type="number"
							{...register("followers", { valueAsNumber: true })}
							className={errors.followers ? "border-red-500" : ""}
						/>
						{errors.followers && (
							<p className="text-red-500 text-xs">{errors.followers.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="totalViews">Total Views *</Label>
						<Input
							id="totalViews"
							type="number"
							{...register("totalViews", { valueAsNumber: true })}
							className={errors.totalViews ? "border-red-500" : ""}
						/>
						{errors.totalViews && (
							<p className="text-red-500 text-xs">{errors.totalViews.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="averageViews">Average Views</Label>
						<Input
							id="averageViews"
							type="number"
							{...register("averageViews", { valueAsNumber: true })}
							className={errors.averageViews ? "border-red-500" : ""}
						/>
						{errors.averageViews && (
							<p className="text-red-500 text-xs">{errors.averageViews.message}</p>
						)}
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="reels">Reel URLs *</Label>
					<Textarea
						id="reels"
						{...register("reels")}
						placeholder="Enter reel URLs separated by commas"
						className={errors.reels ? "border-red-500" : ""}
						rows={3}
					/>
					{errors.reels && (
						<p className="text-red-500 text-xs">{errors.reels.message}</p>
					)}
				</div>

				<Button type="submit" className="w-full" disabled={isSubmitting}>
					{isSubmitting ? "Submitting..." : "Submit for Approval"}
				</Button>
			</form>
		</div>
	);
};

export default CreatorForm;
