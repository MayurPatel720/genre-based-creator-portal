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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
	Creator,
	CreateCreatorData,
	UpdateCreatorData,
	MediaFile,
} from "../../types/Creator";
import { creatorAPI } from "../../services/api";
import { mediaAPI } from "../../services/mediaAPI";
import { cloudinaryService } from "../../services/cloudinary";
import LocationInput from "./LocationInput";
import MediaManager from "./MediaManager";
import { useToast } from "../../hooks/use-toast";
import { useEffect, useState } from "react";

const GENRE_OPTIONS = [
	"AI Creators",
	"Video Editing",
	"Tech Product",
	"Tips & Tricks",
	"Business",
	"Lifestyle",
];

const FormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	genre: z.string().min(1, "Genre is required"),
	avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
	platform: z.enum(["Instagram", "YouTube", "TikTok", "Twitter", "Other"]),
	socialLink: z.string().url("Must be a valid URL"),
	location: z.string().optional(),
	phoneNumber: z.string().optional(),
	mediaKit: z.string().url("Must be a valid URL").optional().or(z.literal("")),
	bio: z.string().min(1, "Bio is required"),
	followers: z.number().min(0, "Must be a positive number"),
	totalViews: z.number().min(0, "Must be a positive number"),
	averageViews: z.number().min(0, "Must be a positive number").optional(),
	reels: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

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
	const [loading, setLoading] = useState(false);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string>("");
	const [media, setMedia] = useState<MediaFile[]>([]);
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: "",
			genre: "",
			avatar: "",
			platform: "Instagram" as const,
			socialLink: "",
			location: "",
			phoneNumber: "",
			mediaKit: "",
			bio: "",
			followers: 0,
			totalViews: 0,
			averageViews: 0,
			reels: "",
		},
	});

	useEffect(() => {
		if (creator) {
			reset({
				name: creator.name || "",
				genre: creator.genre || "",
				avatar: creator.avatar || "",
				platform: creator.platform as
					| "Instagram"
					| "YouTube"
					| "TikTok"
					| "Twitter"
					| "Other",
				socialLink: creator.socialLink || "",
				location: creator.location || "",
				phoneNumber: creator.phoneNumber || "",
				mediaKit: creator.mediaKit || "",
				bio: creator.details?.bio || "",
				followers: creator.details?.analytics?.followers || 0,
				totalViews: creator.details?.analytics?.totalViews || 0,
				averageViews: creator.details?.analytics?.averageViews || 0,
				reels: creator.details?.reels?.join("\n") || "",
			});
			setAvatarPreview(creator.avatar || "");
			setMedia(creator.details?.media || []);
		}
	}, [creator, reset]);

	const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setAvatarFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				setAvatarPreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const uploadAvatar = async (): Promise<string> => {
		if (!avatarFile) {
			return watch("avatar") || "";
		}

		try {
			const result = await cloudinaryService.uploadImage(avatarFile);
			return result.secure_url;
		} catch (error) {
			console.error("Avatar upload failed:", error);
			throw new Error("Failed to upload avatar");
		}
	};

	const refreshMedia = async () => {
		if (creator?._id) {
			try {
				const updatedCreator = await creatorAPI.getById(creator._id);
				setMedia(updatedCreator.details?.media || []);
			} catch (error) {
				console.error("Failed to refresh media:", error);
			}
		}
	};

	const handleMediaAdd = async (file: File, caption: string): Promise<void> => {
		if (!creator?._id) {
			throw new Error("Creator ID is required");
		}

		try {
			const newMedia = await mediaAPI.uploadMedia(creator._id, file, caption);
			setMedia((prevMedia) => [...prevMedia, newMedia]);
			toast({
				title: "Success!",
				description: "Media uploaded successfully.",
			});
		} catch (error) {
			console.error("Media upload failed:", error);
			toast({
				title: "Error",
				description: "Failed to upload media. Please try again.",
				variant: "destructive",
			});
			throw error;
		}
	};

	const handleMediaDelete = async (mediaId: string): Promise<void> => {
		if (!creator?._id) {
			throw new Error("Creator ID is required");
		}

		try {
			console.log("Deleting media:", mediaId, "for creator:", creator._id);
			await mediaAPI.deleteMedia(creator._id, mediaId);

			// Remove from local state immediately
			setMedia((prevMedia) => prevMedia.filter((m) => m.id !== mediaId));

			// Also refresh from server to ensure consistency
			await refreshMedia();

			toast({
				title: "Success!",
				description: "Media deleted successfully.",
			});
		} catch (error) {
			console.error("Error deleting media:", error);
			toast({
				title: "Error",
				description: "Failed to delete media. Please try again.",
				variant: "destructive",
			});
			throw error;
		}
	};

	const onSubmit = async (data: FormData) => {
		setLoading(true);
		try {
			const avatarUrl = await uploadAvatar();

			const creatorData: CreateCreatorData | UpdateCreatorData = {
				name: data.name,
				genre: data.genre,
				avatar: avatarUrl,
				platform: data.platform,
				socialLink: data.socialLink,
				location: data.location || "Other",
				phoneNumber: data.phoneNumber,
				mediaKit: data.mediaKit,
				details: {
					bio: data.bio,
					location: data.location || "Other",
					analytics: {
						followers: data.followers,
						totalViews: data.totalViews,
						averageViews: data.averageViews,
					},
					reels: data.reels ? data.reels.split("\n").filter(Boolean) : [],
					media: media,
				},
			};

			if (creator?._id) {
				await creatorAPI.update(creator._id, creatorData as UpdateCreatorData);
				toast({
					title: "Success!",
					description: "Creator updated successfully.",
				});
			} else {
				await creatorAPI.create(creatorData as CreateCreatorData);
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
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl font-bold text-gray-900">
						{creator ? "Edit Creator" : "Add New Creator"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div>
									<Label htmlFor="name">Name *</Label>
									<Input id="name" {...register("name")} className="mt-1" />
									{errors.name && (
										<p className="text-red-500 text-sm mt-1">
											{errors.name.message}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="genre">Genre *</Label>
									<Select
										value={watch("genre")}
										onValueChange={(value) => setValue("genre", value)}
									>
										<SelectTrigger className="mt-1">
											<SelectValue placeholder="Select genre" />
										</SelectTrigger>
										<SelectContent className="bg-white z-50">
											{GENRE_OPTIONS.map((genre) => (
												<SelectItem key={genre} value={genre}>
													{genre}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{errors.genre && (
										<p className="text-red-500 text-sm mt-1">
											{errors.genre.message}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="platform">Platform *</Label>
									<Select
										value={watch("platform")}
										onValueChange={(value) =>
											// eslint-disable-next-line @typescript-eslint/no-explicit-any
											setValue("platform", value as any)
										}
									>
										<SelectTrigger className="mt-1">
											<SelectValue placeholder="Select platform" />
										</SelectTrigger>
										<SelectContent className="bg-white z-50">
											<SelectItem value="Instagram">Instagram</SelectItem>
											<SelectItem value="YouTube">YouTube</SelectItem>
											<SelectItem value="TikTok">TikTok</SelectItem>
											<SelectItem value="Twitter">Twitter</SelectItem>
											<SelectItem value="Other">Other</SelectItem>
										</SelectContent>
									</Select>
									{errors.platform && (
										<p className="text-red-500 text-sm mt-1">
											{errors.platform.message}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="socialLink">Social Link *</Label>
									<Input
										id="socialLink"
										{...register("socialLink")}
										className="mt-1"
									/>
									{errors.socialLink && (
										<p className="text-red-500 text-sm mt-1">
											{errors.socialLink.message}
										</p>
									)}
								</div>

								<LocationInput
									value={watch("location") || ""}
									onChange={(value) => setValue("location", value)}
									error={errors.location?.message}
								/>

								<div>
									<Label htmlFor="phoneNumber">Phone Number</Label>
									<Input
										id="phoneNumber"
										{...register("phoneNumber")}
										className="mt-1"
									/>
									{errors.phoneNumber && (
										<p className="text-red-500 text-sm mt-1">
											{errors.phoneNumber.message}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="mediaKit">Media Kit URL</Label>
									<Input
										id="mediaKit"
										{...register("mediaKit")}
										className="mt-1"
									/>
									{errors.mediaKit && (
										<p className="text-red-500 text-sm mt-1">
											{errors.mediaKit.message}
										</p>
									)}
								</div>
							</div>

							<div className="space-y-4">
								<div>
									<Label htmlFor="avatar">Avatar</Label>
									<div className="mt-1 space-y-2">
										<Input
											id="avatar"
											type="file"
											accept="image/*"
											onChange={handleAvatarChange}
										/>
										{avatarPreview && (
											<img
												src={avatarPreview}
												alt="Avatar preview"
												className="w-20 h-20 object-cover rounded-full"
											/>
										)}
									</div>
								</div>

								<div>
									<Label htmlFor="bio">Bio *</Label>
									<Textarea
										id="bio"
										{...register("bio")}
										rows={3}
										className="mt-1"
									/>
									{errors.bio && (
										<p className="text-red-500 text-sm mt-1">
											{errors.bio.message}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="followers">Followers *</Label>
									<Input
										id="followers"
										type="number"
										{...register("followers", { valueAsNumber: true })}
										className="mt-1"
									/>
									{errors.followers && (
										<p className="text-red-500 text-sm mt-1">
											{errors.followers.message}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="totalViews">Total Views *</Label>
									<Input
										id="totalViews"
										type="number"
										{...register("totalViews", { valueAsNumber: true })}
										className="mt-1"
										placeholder="Enter total views"
									/>
									{errors.totalViews && (
										<p className="text-red-500 text-sm mt-1">
											{errors.totalViews.message}
										</p>
									)}
								</div>

								<div>
									<Label htmlFor="averageViews">Average Views</Label>
									<Input
										id="averageViews"
										type="number"
										{...register("averageViews", { valueAsNumber: true })}
										className="mt-1"
									/>
									{errors.averageViews && (
										<p className="text-red-500 text-sm mt-1">
											{errors.averageViews.message}
										</p>
									)}
								</div>
							</div>
						</div>

						{creator?._id && (
							<MediaManager
								creatorId={creator._id}
								media={media}
								onMediaAdd={handleMediaAdd}
								onMediaDelete={handleMediaDelete}
							/>
						)}

						<div className="flex gap-4 pt-6">
							<Button type="submit" disabled={loading}>
								{loading
									? "Saving..."
									: creator
									? "Update Creator"
									: "Create Creator"}
							</Button>
							<Button type="button" variant="outline" onClick={onCancel}>
								Cancel
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default CreatorForm;
