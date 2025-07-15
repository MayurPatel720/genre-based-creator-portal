import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Creator, CreateCreatorData, UpdateCreatorData } from "../../types/Creator";
import { creatorAPI } from "../../services/api";
import { useToast } from "../../hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loader2, Upload, X } from "lucide-react";
import { uploadToCloudinary } from "../../services/cloudinary";
import LocationInput from "./LocationInput";
import MediaManager from "./MediaManager";

interface CreatorFormProps {
	creator?: Creator | null;
	onSuccess: () => void;
	onCancel: () => void;
}

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Creator name must be at least 2 characters.",
	}),
	genre: z.string().min(2, {
		message: "Genre must be at least 2 characters.",
	}),
	avatar: z.string().optional(),
	platform: z.enum(["Instagram", "YouTube", "TikTok", "Twitter", "Other"]),
	socialLink: z.string().url({ message: "Please enter a valid URL." }),
	location: z.string().optional(),
	phoneNumber: z.string().optional(),
	mediaKit: z.string().optional(),
	bio: z.string().min(10, {
		message: "Bio must be at least 10 characters.",
	}),
	followers: z.number().min(0, {
		message: "Followers must be a positive number.",
	}),
	totalViews: z.number().min(0, {
		message: "Total views must be a positive number.",
	}),
	averageViews: z.number().optional(),
	reels: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const CreatorForm = ({ creator, onSuccess, onCancel }: CreatorFormProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const { toast } = useToast();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FormData>({
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
				bio: creator.details.bio,
				followers: creator.details.analytics.followers,
				totalViews: creator.details.analytics.totalViews,
				averageViews: creator.details.analytics.averageViews || 0,
				reels: creator.details.reels.join(", ") || "",
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
				bio: "",
				followers: 0,
				totalViews: 0,
				averageViews: 0,
				reels: "",
			},
	});

	useEffect(() => {
		if (creator) {
			Object.keys(creator).forEach((key) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				setValue(key as keyof FormData, creator[key] as any);
			});
			setValue("bio", creator.details.bio);
			setValue("followers", creator.details.analytics.followers);
			setValue("totalViews", creator.details.analytics.totalViews);
			setValue("averageViews", creator.details.analytics.averageViews || 0);
			setValue("reels", creator.details.reels.join(", ") || "");
		}
	}, [creator, setValue]);

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setAvatarFile(file);
			// Optionally, display a preview of the image
			const reader = new FileReader();
			reader.onloadend = () => setValue("avatar", reader.result as string);
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveAvatar = () => {
		setAvatarFile(null);
		setValue("avatar", ""); // Clear the avatar URL
	};

	const handleMediaDelete = async (mediaId: string) => {
		try {
			if (!creator?._id) {
				toast({
					title: "Error",
					description: "Creator ID is missing.",
					variant: "destructive",
				});
				return;
			}
			// Optimistically update the UI
			const updatedMedia = creator.details?.media?.filter(m => m.id !== mediaId) || [];

			// Update the creator's media array in the database
			const updateData: UpdateCreatorData = {
				details: {
					media: updatedMedia,
				},
			};

			await creatorAPI.update(creator._id, updateData);

			toast({
				title: "Success!",
				description: "Media deleted successfully.",
			});
		} catch (error) {
			console.error('Error deleting media:', error);
			toast({
				title: "Error",
				description: "Failed to delete media. Please try again.",
				variant: "destructive",
			});
		}
	};

	const onSubmit = async (data: FormData) => {
		try {
			setIsSubmitting(true);

			// Handle avatar upload if a new file was selected
			let avatarUrl = data.avatar;
			if (avatarFile) {
				const uploadResult = await uploadToCloudinary(avatarFile);
				avatarUrl = uploadResult.secure_url;
			}

			const creatorData: CreateCreatorData | UpdateCreatorData = {
				name: data.name,
				genre: data.genre,
				avatar: avatarUrl,
				platform: data.platform as "Instagram" | "YouTube" | "TikTok" | "Twitter" | "Other",
				socialLink: data.socialLink,
				location: data.location,
				phoneNumber: data.phoneNumber,
				mediaKit: data.mediaKit,
				details: {
					bio: data.bio,
					location: data.location,
					analytics: {
						followers: data.followers,
						totalViews: data.totalViews,
						averageViews: data.averageViews,
					},
					reels: data.reels.split(',').map(reel => reel.trim()).filter(Boolean),
				},
			};

			if (creator?._id) {
				await creatorAPI.update(creator._id, creatorData);
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
			console.error('Error saving creator:', error);
			
			// Handle network errors specifically
			if (error.code === 'ERR_NETWORK') {
				toast({
					title: "Connection Error",
					description: "Unable to connect to the server. Please check if the backend is running on port 5000.",
					variant: "destructive",
				});
			} else {
				toast({
					title: "Error",
					description: error.response?.data?.message || "Failed to save creator. Please try again.",
					variant: "destructive",
				});
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="p-6">
			<Card>
				<CardHeader>
					<CardTitle>{creator ? "Edit Creator" : "Add New Creator"}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="name">Name</Label>
								<Input id="name" type="text" {...register("name")} />
								{errors.name && (
									<p className="text-red-500 text-sm">{errors.name.message}</p>
								)}
							</div>
							<div>
								<Label htmlFor="genre">Genre</Label>
								<Input id="genre" type="text" {...register("genre")} />
								{errors.genre && (
									<p className="text-red-500 text-sm">{errors.genre.message}</p>
								)}
							</div>
						</div>

						<div>
							<Label htmlFor="avatar">Avatar</Label>
							<div className="flex items-center space-x-2">
								<Input
									id="avatar"
									type="file"
									accept="image/*"
									onChange={handleAvatarChange}
									className="hidden"
								/>
								<Label htmlFor="avatar" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md">
									<Upload className="w-4 h-4 mr-2 inline-block" />
									Upload Avatar
								</Label>
								{avatarFile || watch("avatar") ? (
									<Button type="button" variant="ghost" size="sm" onClick={handleRemoveAvatar}>
										<X className="w-4 h-4 mr-2" />
										Remove
									</Button>
								) : null}
							</div>
							{errors.avatar && (
								<p className="text-red-500 text-sm">{errors.avatar.message}</p>
							)}
							{watch("avatar") && !avatarFile && (
								<img src={watch("avatar")} alt="Avatar Preview" className="mt-2 rounded-md w-20 h-20 object-cover" />
							)}
							{avatarFile && (
								<img
									src={URL.createObjectURL(avatarFile)}
									alt="Avatar Preview"
									className="mt-2 rounded-md w-20 h-20 object-cover"
								/>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="platform">Platform</Label>
								<Select>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select a platform" {...register("platform")} />
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
							<div>
								<Label htmlFor="socialLink">Social Link</Label>
								<Input id="socialLink" type="url" {...register("socialLink")} />
								{errors.socialLink && (
									<p className="text-red-500 text-sm">{errors.socialLink.message}</p>
								)}
							</div>
						</div>

						<LocationInput register={register} setValue={setValue} errors={errors} />

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="phoneNumber">Phone Number</Label>
								<Input id="phoneNumber" type="tel" {...register("phoneNumber")} />
								{errors.phoneNumber && (
									<p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
								)}
							</div>
							<div>
								<Label htmlFor="mediaKit">Media Kit</Label>
								<Input id="mediaKit" type="url" {...register("mediaKit")} />
								{errors.mediaKit && (
									<p className="text-red-500 text-sm">{errors.mediaKit.message}</p>
								)}
							</div>
						</div>

						<div>
							<Label htmlFor="bio">Bio</Label>
							<Textarea id="bio" {...register("bio")} />
							{errors.bio && (
								<p className="text-red-500 text-sm">{errors.bio.message}</p>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<Label htmlFor="followers">Followers</Label>
								<Input id="followers" type="number" {...register("followers", { valueAsNumber: true })} />
								{errors.followers && (
									<p className="text-red-500 text-sm">{errors.followers.message}</p>
								)}
							</div>
							<div>
								<Label htmlFor="totalViews">Total Views</Label>
								<Input id="totalViews" type="number" {...register("totalViews", { valueAsNumber: true })} />
								{errors.totalViews && (
									<p className="text-red-500 text-sm">{errors.totalViews.message}</p>
								)}
							</div>
							<div>
								<Label htmlFor="averageViews">Average Views (Optional)</Label>
								<Input id="averageViews" type="number" {...register("averageViews", { valueAsNumber: true })} />
								{errors.averageViews && (
									<p className="text-red-500 text-sm">{errors.averageViews.message}</p>
								)}
							</div>
						</div>

						<div>
							<Label htmlFor="reels">Reels (Comma Separated)</Label>
							<Input id="reels" type="text" {...register("reels")} placeholder="reel1, reel2, reel3" />
							{errors.reels && (
								<p className="text-red-500 text-sm">{errors.reels.message}</p>
							)}
						</div>

						{/* Media Management Section - Only show for existing creators */}
						{creator?._id && (
							<div className="space-y-4">
								<Label className="text-lg font-semibold">Media Management</Label>
								<MediaManager 
									creatorId={creator._id} 
									media={creator.details?.media || []}
									onMediaDelete={handleMediaDelete}
								/>
							</div>
						)}

						<div className="flex justify-between">
							<Button variant="ghost" onClick={onCancel}>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Please wait
									</>
								) : (
									"Save"
								)}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default CreatorForm;
