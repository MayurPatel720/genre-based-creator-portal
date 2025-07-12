import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ImageIcon, Pencil, Plus, Upload } from "lucide-react";
import {
	CreateCreatorData,
	UpdateCreatorData,
	creatorAPI,
} from "../../services/api";
import { useCreators } from "../../hooks/useCreators";
import { Creator } from "@/types/Creator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LocationInput from "./LocationInput";

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
	platform: z.enum(["Instagram", "YouTube", "TikTok", "Twitter", "Other"], {
		required_error: "Please select a platform.",
	}),
	socialLink: z.string().url({
		message: "Please enter a valid URL.",
	}),
	location: z.string().optional(),
	phoneNumber: z.string().optional(),
	mediaKit: z.string().optional(),
	bio: z.string().optional(),
	followers: z.number().min(0, {
		message: "Followers must be a positive number.",
	}),
	totalViews: z.number().min(0, {
		message: "Total views must be a positive number.",
	}),
	averageViews: z.number().optional(),
	reels: z.array(z.string()).optional(),
});

const CreatorForm: React.FC<CreatorFormProps> = ({ creator, onSuccess, onCancel }) => {
	const [isEditMode, setIsEditMode] = useState(!!creator);
	const [avatarPreview, setAvatarPreview] = useState(creator?.avatar || "");
	const [uploading, setUploading] = useState(false);
	const [formData, setFormData] = useState({
		name: creator?.name || "",
		genre: creator?.genre || "",
		avatar: creator?.avatar || "",
		platform: creator?.platform || "Instagram",
		socialLink: creator?.socialLink || "",
		location: creator?.location || "",
		phoneNumber: creator?.phoneNumber || "",
		mediaKit: creator?.mediaKit || "",
		bio: creator?.details?.bio || "",
		followers: creator?.details?.analytics?.followers || 0,
		totalViews: creator?.details?.analytics?.totalViews || 0,
		averageViews: creator?.details?.analytics?.averageViews || 0,
		reels: creator?.details?.reels || [],
	});

	const {
		creators,
		createCreator,
		updateCreator,
		deleteCreator,
		loading,
		error,
	} = useCreators();
	const { toast } = useToast();
	const navigate = useNavigate();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: creator?.name || "",
			genre: creator?.genre || "",
			avatar: creator?.avatar || "",
			platform: creator?.platform || "Instagram",
			socialLink: creator?.socialLink || "",
			location: creator?.location || "",
			phoneNumber: creator?.phoneNumber || "",
			mediaKit: creator?.mediaKit || "",
			bio: creator?.details?.bio || "",
			followers: creator?.details?.analytics?.followers || 0,
			totalViews: creator?.details?.analytics?.totalViews || 0,
			averageViews: creator?.details?.analytics?.averageViews || 0,
			reels: creator?.details?.reels || [],
		},
		mode: "onChange",
	});

	const { handleSubmit, control, formState } = form;
	const { errors } = formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			if (creator) {
				// Update creator
				const updateData: UpdateCreatorData = {
					name: values.name,
					genre: values.genre,
					avatar: values.avatar,
					platform: values.platform,
					socialLink: values.socialLink,
					location: values.location,
					phoneNumber: values.phoneNumber,
					mediaKit: values.mediaKit,
					details: {
						bio: values.bio,
						analytics: {
							followers: values.followers,
							totalViews: values.totalViews,
							averageViews: values.averageViews,
						},
						reels: values.reels,
					},
				};
				await updateCreator(creator._id as string, updateData);
				toast({
					title: "Success",
					description: "Creator updated successfully.",
				});
			} else {
				// Create creator
				const createData: CreateCreatorData = {
					name: values.name,
					genre: values.genre,
					avatar: values.avatar,
					platform: values.platform,
					socialLink: values.socialLink,
					location: values.location,
					phoneNumber: values.phoneNumber,
					mediaKit: values.mediaKit,
					details: {
						bio: values.bio,
						analytics: {
							followers: values.followers,
							totalViews: values.totalViews,
							averageViews: values.averageViews,
						},
						reels: values.reels,
					},
				};
				await createCreator(createData);
				toast({
					title: "Success",
					description: "Creator created successfully.",
				});
			}
			onSuccess();
			navigate("/admin");
		} catch (error: any) {
			toast({
				variant: "destructive",
				title: "Error",
				description: error.message || "Failed to save creator.",
			});
		}
	};

	const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("image", file);

			const response = await fetch("http://localhost:3000/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Image upload failed");
			}

			const result = await response.json();
			setFormData((prev) => ({ ...prev, avatar: result.url }));
			setAvatarPreview(result.url);
			form.setValue("avatar", result.url);
			toast({
				title: "Success",
				description: "Avatar uploaded successfully.",
			});
		} catch (error: any) {
			toast({
				variant: "destructive",
				title: "Error",
				description: error.message || "Failed to upload avatar.",
			});
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="p-6">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Name */}
				<div>
					<FormLabel htmlFor="name">Creator Name *</FormLabel>
					<Input
						id="name"
						placeholder="Enter creator name"
						value={formData.name}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, name: e.target.value }))
						}
						className={errors.name ? "border-red-500" : ""}
					/>
					{errors.name && (
						<p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
					)}
				</div>

				{/* Genre */}
				<div>
					<FormLabel htmlFor="genre">Genre *</FormLabel>
					<Input
						id="genre"
						placeholder="e.g., Tech, Lifestyle, Music"
						value={formData.genre}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, genre: e.target.value }))
						}
						className={errors.genre ? "border-red-500" : ""}
					/>
					{errors.genre && (
						<p className="text-red-500 text-xs mt-1">{errors.genre.message}</p>
					)}
				</div>

				{/* Avatar */}
				<div>
					<FormLabel>Avatar</FormLabel>
					<div className="flex items-center space-x-4">
						<Avatar className="h-12 w-12">
							{avatarPreview ? (
								<AvatarImage src={avatarPreview} alt="Creator Avatar" />
							) : (
								<AvatarFallback>{formData.name?.charAt(0).toUpperCase()}</AvatarFallback>
							)}
						</Avatar>
						<div className="space-y-1">
							<Input
								type="file"
								id="avatar"
								accept="image/*"
								onChange={handleAvatarChange}
								disabled={uploading}
								className="hidden"
							/>
							<FormLabel
								htmlFor="avatar"
								className="cursor-pointer rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{uploading ? (
									<>
										<Upload className="mr-2 h-4 w-4 animate-spin" />
										Uploading...
									</>
								) : (
									<>
										<Upload className="mr-2 h-4 w-4" />
										Upload
									</>
								)}
							</FormLabel>
							<FormDescription>
								Upload a new avatar for the creator.
							</FormDescription>
						</div>
					</div>
				</div>

				{/* Platform */}
				<div>
					<FormLabel htmlFor="platform">Platform *</FormLabel>
					<Select
						value={formData.platform}
						onValueChange={(value) =>
							setFormData((prev) => ({ ...prev, platform: value }))
						}
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
						<p className="text-red-500 text-xs mt-1">{errors.platform}</p>
					)}
				</div>

				{/* Social Link */}
				<div>
					<FormLabel htmlFor="socialLink">Social Profile Link *</FormLabel>
					<Input
						id="socialLink"
						type="url"
						placeholder="https://..."
						value={formData.socialLink}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, socialLink: e.target.value }))
						}
						className={errors.socialLink ? "border-red-500" : ""}
					/>
					{errors.socialLink && (
						<p className="text-red-500 text-xs mt-1">{errors.socialLink}</p>
					)}
				</div>

				{/* Location - Updated to use LocationInput */}
				<LocationInput
					value={formData.location}
					onChange={(value) =>
						setFormData((prev) => ({ ...prev, location: value }))
					}
					error={errors.location}
				/>

				{/* Phone Number */}
				<div>
					<FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
					<Input
						id="phoneNumber"
						type="tel"
						placeholder="Enter phone number"
						value={formData.phoneNumber}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))
						}
					/>
				</div>

				{/* Media Kit */}
				<div>
					<FormLabel htmlFor="mediaKit">Media Kit URL</FormLabel>
					<Input
						id="mediaKit"
						type="url"
						placeholder="https://..."
						value={formData.mediaKit}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, mediaKit: e.target.value }))
						}
					/>
				</div>

				{/* Bio */}
				<div>
					<FormLabel htmlFor="bio">Bio</FormLabel>
					<Textarea
						id="bio"
						placeholder="Write a short bio"
						value={formData.bio}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, bio: e.target.value }))
						}
					/>
				</div>

				{/* Analytics */}
				<div>
					<FormLabel htmlFor="followers">Followers *</FormLabel>
					<Input
						id="followers"
						type="number"
						placeholder="Enter number of followers"
						value={formData.followers}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								followers: Number(e.target.value),
							}))
						}
						className={errors.followers ? "border-red-500" : ""}
					/>
					{errors.followers && (
						<p className="text-red-500 text-xs mt-1">{errors.followers.message}</p>
					)}
				</div>

				<div>
					<FormLabel htmlFor="totalViews">Total Views *</FormLabel>
					<Input
						id="totalViews"
						type="number"
						placeholder="Enter total views"
						value={formData.totalViews}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								totalViews: Number(e.target.value),
							}))
						}
						className={errors.totalViews ? "border-red-500" : ""}
					/>
					{errors.totalViews && (
						<p className="text-red-500 text-xs mt-1">{errors.totalViews.message}</p>
					)}
				</div>

				<div>
					<FormLabel htmlFor="averageViews">Average Views</FormLabel>
					<Input
						id="averageViews"
						type="number"
						placeholder="Enter average views (optional)"
						value={formData.averageViews}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								averageViews: Number(e.target.value),
							}))
						}
					/>
				</div>

				{/* Form Buttons */}
				<div className="flex justify-end gap-4">
					<Button variant="ghost" onClick={onCancel}>
						Cancel
					</Button>
					<Button type="submit" disabled={loading}>
						{loading ? (
							<>
								Saving...
								<Upload className="ml-2 h-4 w-4 animate-spin" />
							</>
						) : (
							<>
								{isEditMode ? "Update" : "Create"}
								<Pencil className="ml-2 h-4 w-4" />
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default CreatorForm;
