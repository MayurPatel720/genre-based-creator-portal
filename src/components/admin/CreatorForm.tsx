import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { ArrowLeft, Save, Users, BarChart3, MapPin, Phone, Link as LinkIcon } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { Creator, CreateCreatorData, UpdateCreatorData } from "../../types/Creator";
import { creatorAPI, API_BASE_URL } from "../../services/api";
import { mediaService } from "../../services/mediaAPI";
import LocationInput from "./LocationInput";
import MediaManager from "./MediaManager";

interface CreatorFormProps {
	creator?: Creator;
	onSubmit: (data: CreateCreatorData | UpdateCreatorData) => Promise<void>;
	isEditing?: boolean;
}

const CreatorForm: React.FC<CreatorFormProps> = ({
	creator,
	onSubmit,
	isEditing = false,
}) => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { toast } = useToast();

	const [formData, setFormData] = useState({
		name: creator?.name || "",
		genre: creator?.genre || "",
		avatar: creator?.avatar || "",
		platform: creator?.platform || ("Instagram" as const),
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

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentCreator, setCurrentCreator] = useState<Creator | undefined>(creator);

	useEffect(() => {
		if (isEditing && id && !creator) {
			fetchCreator();
		}
	}, [isEditing, id, creator]);

	const fetchCreator = async () => {
		if (!id) return;
		
		try {
			const fetchedCreator = await creatorAPI.getById(id);
			setCurrentCreator(fetchedCreator);
			setFormData({
				name: fetchedCreator.name,
				genre: fetchedCreator.genre,
				avatar: fetchedCreator.avatar,
				platform: fetchedCreator.platform,
				socialLink: fetchedCreator.socialLink,
				location: fetchedCreator.location || "",
				phoneNumber: fetchedCreator.phoneNumber || "",
				mediaKit: fetchedCreator.mediaKit || "",
				bio: fetchedCreator.details?.bio || "",
				followers: fetchedCreator.details?.analytics?.followers || 0,
				totalViews: fetchedCreator.details?.analytics?.totalViews || 0,
				averageViews: fetchedCreator.details?.analytics?.averageViews || 0,
				reels: fetchedCreator.details?.reels || [],
			});
		} catch (error) {
			console.error("Error fetching creator:", error);
			toast({
				title: "Error",
				description: "Failed to load creator data",
				variant: "destructive",
			});
		}
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name.includes("followers") || name.includes("Views") ? Number(value) : value,
		}));
	};

	const handleLocationChange = (location: string) => {
		setFormData((prev) => ({
			...prev,
			location,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const submitData: CreateCreatorData | UpdateCreatorData = {
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

			await onSubmit(submitData);

			toast({
				title: "Success!",
				description: `Creator ${isEditing ? "updated" : "created"} successfully`,
			});

			navigate("/admin");
		} catch (error) {
			console.error("Error submitting form:", error);
			toast({
				title: "Error",
				description: `Failed to ${isEditing ? "update" : "create"} creator`,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleMediaAdd = async (file: File, caption: string) => {
		if (!currentCreator?._id) {
			toast({
				title: "Error",
				description: "Creator not found",
				variant: "destructive",
			});
			return;
		}

		try {
			await mediaService.uploadMedia(currentCreator._id, file, caption);

			toast({
				title: "Success!",
				description: "Media uploaded successfully",
			});

			// Refresh creator data to show new media
			await fetchCreator();
		} catch (error) {
			console.error("Error uploading media:", error);
			toast({
				title: "Error",
				description: "Failed to upload media",
				variant: "destructive",
			});
		}
	};

	const handleMediaDelete = async (mediaId: string) => {
		if (!currentCreator?._id) {
			toast({
				title: "Error",
				description: "Creator not found",
				variant: "destructive",
			});
			return;
		}

		console.log("Deleting media:", mediaId);

		try {
			await mediaService.deleteMedia(currentCreator._id, mediaId);

			toast({
				title: "Success!",
				description: "Media deleted successfully",
			});

			// Refresh creator data to reflect deletion
			await fetchCreator();
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
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="mb-6">
				<Button
					variant="outline"
					onClick={() => navigate("/admin")}
					className="mb-4"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Admin
				</Button>
				<h1 className="text-3xl font-bold">
					{isEditing ? "Edit Creator" : "Add New Creator"}
				</h1>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="w-5 h-5" />
								Creator Information
							</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="name">Creator Name</Label>
										<Input
											id="name"
											name="name"
											value={formData.name}
											onChange={handleInputChange}
											required
										/>
									</div>
									<div>
										<Label htmlFor="genre">Genre</Label>
										<select
											id="genre"
											name="genre"
											value={formData.genre}
											onChange={handleInputChange}
											className="w-full p-2 border border-gray-300 rounded-md"
											required
										>
											<option value="">Select Genre</option>
											<option value="Comedy">Comedy</option>
											<option value="Dance">Dance</option>
											<option value="Fashion">Fashion</option>
											<option value="Food">Food</option>
											<option value="Gaming">Gaming</option>
											<option value="Lifestyle">Lifestyle</option>
											<option value="Music">Music</option>
											<option value="Tech">Tech</option>
											<option value="Travel">Travel</option>
											<option value="Fitness">Fitness</option>
											<option value="Beauty">Beauty</option>
											<option value="Education">Education</option>
										</select>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="platform">Platform</Label>
										<select
											id="platform"
											name="platform"
											value={formData.platform}
											onChange={handleInputChange}
											className="w-full p-2 border border-gray-300 rounded-md"
											required
										>
											<option value="Instagram">Instagram</option>
											<option value="YouTube">YouTube</option>
											<option value="TikTok">TikTok</option>
											<option value="Twitter">Twitter</option>
											<option value="Other">Other</option>
										</select>
									</div>
									<div>
										<Label htmlFor="avatar">Avatar URL</Label>
										<Input
											id="avatar"
											name="avatar"
											value={formData.avatar}
											onChange={handleInputChange}
											placeholder="https://example.com/avatar.jpg"
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Label htmlFor="socialLink" className="flex items-center gap-2">
											<LinkIcon className="w-4 h-4" />
											Social Media Link
										</Label>
										<Input
											id="socialLink"
											name="socialLink"
											value={formData.socialLink}
											onChange={handleInputChange}
											placeholder="https://instagram.com/username"
										/>
									</div>
									<div>
										<Label htmlFor="phoneNumber" className="flex items-center gap-2">
											<Phone className="w-4 h-4" />
											Phone Number
										</Label>
										<Input
											id="phoneNumber"
											name="phoneNumber"
											value={formData.phoneNumber}
											onChange={handleInputChange}
											placeholder="+1234567890"
										/>
									</div>
								</div>

								<LocationInput
									value={formData.location}
									onChange={handleLocationChange}
								/>

								<div>
									<Label htmlFor="bio">Bio</Label>
									<Textarea
										id="bio"
										name="bio"
										value={formData.bio}
										onChange={handleInputChange}
										rows={4}
										placeholder="Tell us about this creator..."
									/>
								</div>

								<Separator />

								<div>
									<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
										<BarChart3 className="w-5 h-5" />
										Analytics
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
										<div>
											<Label htmlFor="followers">Followers</Label>
											<Input
												id="followers"
												name="followers"
												type="number"
												value={formData.followers}
												onChange={handleInputChange}
												min="0"
											/>
										</div>
										<div>
											<Label htmlFor="totalViews">Total Views</Label>
											<Input
												id="totalViews"
												name="totalViews"
												type="number"
												value={formData.totalViews}
												onChange={handleInputChange}
												min="0"
											/>
										</div>
										<div>
											<Label htmlFor="averageViews">Average Views</Label>
											<Input
												id="averageViews"
												name="averageViews"
												type="number"
												value={formData.averageViews}
												onChange={handleInputChange}
												min="0"
											/>
										</div>
									</div>
								</div>

								<div className="flex justify-end">
									<Button
										type="submit"
										disabled={isSubmitting}
										className="min-w-[120px]"
									>
										{isSubmitting ? (
											"Saving..."
										) : (
											<>
												<Save className="w-4 h-4 mr-2" />
												{isEditing ? "Update" : "Create"} Creator
											</>
										)}
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-6">
					{/* Media Management - Only show for existing creators */}
					{isEditing && currentCreator && (
						<Card>
							<CardHeader>
								<CardTitle>Media Management</CardTitle>
							</CardHeader>
							<CardContent>
								<MediaManager
									creatorId={currentCreator._id}
									media={currentCreator.details?.media || []}
									onMediaAdd={handleMediaAdd}
									onMediaDelete={handleMediaDelete}
								/>
							</CardContent>
						</Card>
					)}

					{/* Preview Card */}
					<Card>
						<CardHeader>
							<CardTitle>Preview</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-center">
								{formData.avatar ? (
									<img
										src={formData.avatar}
										alt={formData.name}
										className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
									/>
								) : (
									<div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center">
										<Users className="w-8 h-8 text-gray-400" />
									</div>
								)}
								<h3 className="font-semibold text-lg">{formData.name || "Creator Name"}</h3>
								<p className="text-gray-600">{formData.genre || "Genre"}</p>
								<p className="text-sm text-gray-500 mt-2">{formData.bio || "Bio"}</p>
								<div className="flex justify-center space-x-4 mt-4 text-sm">
									<div>
										<span className="font-semibold">{formData.followers.toLocaleString()}</span>
										<p className="text-gray-500">Followers</p>
									</div>
									<div>
										<span className="font-semibold">{formData.totalViews.toLocaleString()}</span>
										<p className="text-gray-500">Total Views</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default CreatorForm;
