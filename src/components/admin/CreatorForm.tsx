
import React, { useState, useEffect } from "react";
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
import { useCreators } from "../../hooks/useCreators";
import { useToast } from "../../hooks/use-toast";
import { Creator } from "../../types/Creator";

interface CreatorFormProps {
	creator?: Creator | null;
	onSuccess: () => void;
	onCancel: () => void;
}

const creatorSchema = z.object({
	name: z.string().min(1, "Name is required"),
	genre: z.string().min(1, "Genre is required"),
	avatar: z.string().url("Avatar must be a valid URL"),
	platform: z.enum(["Instagram", "YouTube", "TikTok", "Twitter", "Other"]),
	socialLink: z.string().url("Social link must be a valid URL"),
	location: z.string().min(1, "Location is required"),
	phoneNumber: z.string().optional(),
	mediaKit: z.string().optional(),
	bio: z.string().min(1, "Bio is required"),
	followers: z.coerce.number().min(0, "Followers must be a positive number"),
	totalViews: z.coerce.number().min(0, "Total views must be a positive number"),
	averageViews: z.coerce.number().optional(),
});

type CreatorFormData = z.infer<typeof creatorSchema>;

const predefinedGenres = [
	"Fashion",
	"Beauty",
	"Travel",
	"Food",
	"Fitness",
	"Technology",
	"Gaming",
	"Lifestyle",
	"Comedy",
	"Education",
	"Music",
	"Dance",
	"Art",
	"Business",
	"Health",
];

const predefinedLocations = [
	"Mumbai",
	"Delhi",
	"Bangalore",
	"Chennai",
	"Kolkata",
	"Hyderabad",
	"Pune",
	"Ahmedabad",
	"Jaipur",
	"Surat",
];

const CreatorForm: React.FC<CreatorFormProps> = ({
	creator,
	onSuccess,
	onCancel,
}) => {
	const [customGenre, setCustomGenre] = useState("");
	const [customLocation, setCustomLocation] = useState("");
	const [showCustomGenre, setShowCustomGenre] = useState(false);
	const [showCustomLocation, setShowCustomLocation] = useState(false);

	const { createCreator, updateCreator, loading } = useCreators();
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
			name: "",
			genre: "",
			avatar: "",
			platform: "Instagram",
			socialLink: "",
			location: "",
			phoneNumber: "",
			mediaKit: "",
			bio: "",
			followers: 0,
			totalViews: 0,
			averageViews: 0,
		},
	});

	const selectedGenre = watch("genre");
	const selectedLocation = watch("location");

	useEffect(() => {
		if (creator) {
			const formData = {
				name: creator.name,
				genre: creator.genre,
				avatar: creator.avatar,
				platform: creator.platform as "Instagram" | "YouTube" | "TikTok" | "Twitter" | "Other",
				socialLink: creator.socialLink,
				location: creator.location || creator.details.location,
				phoneNumber: creator.phoneNumber || "",
				mediaKit: creator.mediaKit || "",
				bio: creator.details.bio,
				followers: creator.details.analytics.followers,
				totalViews: creator.details.analytics.totalViews,
				averageViews: creator.details.analytics.averageViews || 0,
			};
			
			reset(formData);

			// Check if genre is custom
			if (!predefinedGenres.includes(creator.genre)) {
				setShowCustomGenre(true);
				setCustomGenre(creator.genre);
			}

			// Check if location is custom
			const location = creator.location || creator.details.location;
			if (!predefinedLocations.includes(location)) {
				setShowCustomLocation(true);
				setCustomLocation(location);
			}
		}
	}, [creator, reset]);

	const onSubmit = async (data: CreatorFormData) => {
		try {
			const finalGenre = showCustomGenre ? customGenre : data.genre;
			const finalLocation = showCustomLocation ? customLocation : data.location;

			const creatorData = {
				name: data.name,
				genre: finalGenre,
				avatar: data.avatar,
				platform: data.platform,
				socialLink: data.socialLink,
				location: finalLocation,
				phoneNumber: data.phoneNumber,
				mediaKit: data.mediaKit,
				details: {
					bio: data.bio,
					location: finalLocation,
					analytics: {
						followers: data.followers,
						totalViews: data.totalViews,
						averageViews: data.averageViews,
					},
					reels: [],
				},
			};

			if (creator && creator._id) {
				await updateCreator(creator._id, creatorData);
				toast({
					title: "Success!",
					description: "Creator updated successfully.",
				});
			} else {
				await createCreator(creatorData);
				toast({
					title: "Success!",
					description: "Creator created successfully.",
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

	const handleGenreChange = (value: string) => {
		if (value === "custom") {
			setShowCustomGenre(true);
			setValue("genre", "");
		} else {
			setShowCustomGenre(false);
			setValue("genre", value);
		}
	};

	const handleLocationChange = (value: string) => {
		if (value === "custom") {
			setShowCustomLocation(true);
			setValue("location", "");
		} else {
			setShowCustomLocation(false);
			setValue("location", value);
		}
	};

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-6">
				{creator ? "Edit Creator" : "Add New Creator"}
			</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<Label htmlFor="name">Name *</Label>
						<Input
							id="name"
							{...register("name")}
							placeholder="Creator name"
						/>
						{errors.name && (
							<p className="text-sm text-red-600">{errors.name.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="genre">Genre *</Label>
						{showCustomGenre ? (
							<div className="flex gap-2">
								<Input
									value={customGenre}
									onChange={(e) => {
										setCustomGenre(e.target.value);
										setValue("genre", e.target.value);
									}}
									placeholder="Enter custom genre"
								/>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setShowCustomGenre(false);
										setCustomGenre("");
										setValue("genre", "");
									}}
								>
									Cancel
								</Button>
							</div>
						) : (
							<Select value={selectedGenre} onValueChange={handleGenreChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select genre" />
								</SelectTrigger>
								<SelectContent>
									{predefinedGenres.map((genre) => (
										<SelectItem key={genre} value={genre}>
											{genre}
										</SelectItem>
									))}
									<SelectItem value="custom">Other (Custom)</SelectItem>
								</SelectContent>
							</Select>
						)}
						{errors.genre && (
							<p className="text-sm text-red-600">{errors.genre.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="avatar">Avatar URL *</Label>
						<Input
							id="avatar"
							{...register("avatar")}
							placeholder="https://example.com/avatar.jpg"
						/>
						{errors.avatar && (
							<p className="text-sm text-red-600">{errors.avatar.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="platform">Platform *</Label>
						<Select onValueChange={(value) => setValue("platform", value as any)}>
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
					</div>

					<div className="space-y-2">
						<Label htmlFor="socialLink">Social Link *</Label>
						<Input
							id="socialLink"
							{...register("socialLink")}
							placeholder="https://instagram.com/username"
						/>
						{errors.socialLink && (
							<p className="text-sm text-red-600">{errors.socialLink.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="location">Location *</Label>
						{showCustomLocation ? (
							<div className="flex gap-2">
								<Input
									value={customLocation}
									onChange={(e) => {
										setCustomLocation(e.target.value);
										setValue("location", e.target.value);
									}}
									placeholder="Enter custom location"
								/>
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setShowCustomLocation(false);
										setCustomLocation("");
										setValue("location", "");
									}}
								>
									Cancel
								</Button>
							</div>
						) : (
							<Select value={selectedLocation} onValueChange={handleLocationChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select location" />
								</SelectTrigger>
								<SelectContent>
									{predefinedLocations.map((location) => (
										<SelectItem key={location} value={location}>
											{location}
										</SelectItem>
									))}
									<SelectItem value="custom">Other (Custom)</SelectItem>
								</SelectContent>
							</Select>
						)}
						{errors.location && (
							<p className="text-sm text-red-600">{errors.location.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="phoneNumber">Phone Number</Label>
						<Input
							id="phoneNumber"
							{...register("phoneNumber")}
							placeholder="+91 9876543210"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="mediaKit">Media Kit URL</Label>
						<Input
							id="mediaKit"
							{...register("mediaKit")}
							placeholder="https://example.com/mediakit.pdf"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="followers">Followers *</Label>
						<Input
							id="followers"
							type="number"
							{...register("followers")}
							placeholder="10000"
						/>
						{errors.followers && (
							<p className="text-sm text-red-600">{errors.followers.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="totalViews">Total Views *</Label>
						<Input
							id="totalViews"
							type="number"
							{...register("totalViews")}
							placeholder="1000000"
						/>
						{errors.totalViews && (
							<p className="text-sm text-red-600">{errors.totalViews.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="averageViews">Average Views</Label>
						<Input
							id="averageViews"
							type="number"
							{...register("averageViews")}
							placeholder="50000"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="bio">Bio *</Label>
					<Textarea
						id="bio"
						{...register("bio")}
						placeholder="Tell us about yourself..."
						rows={4}
					/>
					{errors.bio && (
						<p className="text-sm text-red-600">{errors.bio.message}</p>
					)}
				</div>

				<div className="flex gap-4">
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
