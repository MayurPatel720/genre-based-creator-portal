/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { CreateCreatorData } from "../../services/api";
import { useCreators } from "../../hooks/useCreators";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Creator } from "@/types/Creator";
import ImageUpload from "../ImageUpload";
import MediaManager from "./MediaManager";
import { imageUploadAPI } from "../../services/imageUpload";
import { mediaService } from "../../services/mediaAPI";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Upload } from "lucide-react";
import Papa from "papaparse";

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
	const { createCreator, updateCreator } = useCreators();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorList, setErrorList] = useState<string[]>([]);
	const [formData, setFormData] = useState<
		CreateCreatorData & { location: string; averageViews: number }
	>({
		name: "",
		genre: "",
		avatar: "",
		platform: "",
		socialLink: "",
		location: "",
		phoneNumber: "",
		mediaKit: "",
		bio: "",
		followers: 0,
		totalViews: 0,
		reels: [],
		averageViews: 0,
	});
	const [currentPublicId, setCurrentPublicId] = useState<string | null>(null);
	const [media, setMedia] = useState(creator?.details?.media || []);

	// Populate form with creator data when editing
	useEffect(() => {
		if (creator) {
			setFormData({
				name: creator.name || "",
				genre: creator.genre || "",
				avatar: creator.avatar || "",
				platform: creator.platform || "",
				socialLink: creator.socialLink || "",
				location: creator.location || creator.details?.location || "",
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

	const handleImageUpload = (imageUrl: string) => {
		setFormData((prev) => ({ ...prev, avatar: imageUrl }));
	};

	const handleImageDelete = async () => {
		if (currentPublicId) {
			try {
				await imageUploadAPI.deleteImage(currentPublicId);
				setFormData((prev) => ({ ...prev, avatar: "" }));
				setCurrentPublicId(null);
			} catch (error) {
				console.error("Failed to delete image:", error);
			}
		}
	};

	const handleMediaAdd = async (file: File, caption: string) => {
		if (!creator?._id) return;

		try {
			const newMedia = await mediaService.addMedia(creator._id, file, caption);
			setMedia((prev) => [...prev, newMedia]);
		} catch (error) {
			console.error("Failed to add media:", error);
		}
	};

	const handleMediaDelete = async (mediaId: string) => {
		if (!creator?._id) return;

		try {
			await mediaService.deleteMedia(creator._id, mediaId);
			setMedia((prev) => prev.filter((item) => item.id !== mediaId));
		} catch (error) {
			console.error("Failed to delete media:", error);
		}
	};

	const handleCSVImport = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) {
			setError("No file selected");
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		setSuccessMessage(null);
		setErrorList([]);

		try {
			const reader = new FileReader();
			reader.onload = async (e) => {
				const csv = e.target?.result;
				if (typeof csv !== "string") {
					setError("Failed to read CSV file");
					setLoading(false);
					return;
				}

				Papa.parse(csv, {
					header: true,
					skipEmptyLines: true,
					transformHeader: (header) => header.trim().toLowerCase(),
					transform: (value) => value.trim().replace(/^"|"$/g, ""),
					complete: async (results) => {
						const lines = results.data;
						if (lines.length === 0) {
							setError("CSV file is empty");
							setLoading(false);
							return;
						}

						let successCount = 0;
						let errorCount = 0;
						const errors: string[] = [];

						for (let i = 0; i < lines.length; i++) {
							const data = lines[i] as any;
							try {
								const csvData: CreateCreatorData = {
									name: data.name || data.creator_name || data.full_name || "",
									genre: data.genre || data.category || data.niche || "",
									avatar:
										data.avatar ||
										data.profile_pic ||
										data.image ||
										data.photo ||
										"",
									platform:
										data.platform || data.social_platform || data.channel || "",
									socialLink:
										data.sociallink ||
										data.social_link ||
										data.profile_url ||
										data.url ||
										"",
									location:
										data.location ||
										data.country ||
										data.city ||
										data.region ||
										"Other",
									phoneNumber:
										data.phonenumber ||
										data.phone_number ||
										data.phone ||
										data.contact ||
										"",
									mediaKit:
										data.mediakit ||
										data.media_kit ||
										data.presskit ||
										data.portfolio ||
										data.mediakiturl ||
										"",
									bio:
										data.bio ||
										data.description ||
										data.about ||
										data.summary ||
										"",
									followers:
										parseFloat(
											data.followers ||
												data.subscriber_count ||
												data.audience ||
												data.fans ||
												"0"
										) || 0,
									totalViews:
										parseInt(
											data.totalviews ||
												data.total_views ||
												data.views ||
												data.total_reach ||
												"0"
										) || 0,
									averageViews:
										parseInt(
											data.avgviews ||
												data.average_views ||
												data.avg_views ||
												data.typical_views ||
												"0"
										) || 0,
									reels:
										data.reels || data.videos || data.content
											? (data.reels || data.videos || data.content)
													.split(";")
													.map((r: string) => r.trim())
													.filter(Boolean)
											: [],
								};

								// Validate required fields (excluding avatar and bio)
								const missingFields = [];
								if (!csvData.name) missingFields.push("name");
								if (!csvData.genre) missingFields.push("genre");
								if (!csvData.platform) missingFields.push("platform");
								if (!csvData.socialLink) missingFields.push("socialLink");

								if (missingFields.length > 0) {
									errors.push(
										`Row ${
											i + 2
										}: Missing required fields: ${missingFields.join(", ")}`
									);
									errorCount++;
									continue;
								}

								// Validate URLs
								const urlRegex = /^https?:\/\/.+/;
								if (!urlRegex.test(csvData.socialLink)) {
									errors.push(
										`Row ${i + 2}: Invalid social link URL: ${
											csvData.socialLink
										}`
									);
									errorCount++;
									continue;
								}
								if (csvData.mediaKit && !urlRegex.test(csvData.mediaKit)) {
									errors.push(
										`Row ${i + 2}: Invalid media kit URL: ${csvData.mediaKit}`
									);
									errorCount++;
									continue;
								}

								// Validate numerical fields
								if (csvData.followers < 0) {
									errors.push(
										`Row ${i + 2}: Followers cannot be negative: ${
											csvData.followers
										}`
									);
									errorCount++;
									continue;
								}
								if (csvData.totalViews < 0) {
									errors.push(
										`Row ${i + 2}: Total views cannot be negative: ${
											csvData.totalViews
										}`
									);
									errorCount++;
									continue;
								}
								if (csvData.averageViews < 0) {
									errors.push(
										`Row ${i + 2}: Average views cannot be negative: ${
											csvData.averageViews
										}`
									);
									errorCount++;
									continue;
								}

								await createCreator(csvData);
								successCount++;
							} catch (error: any) {
								errors.push(
									`Row ${i + 2}: ${error.message || "Failed to create creator"}`
								);
								errorCount++;
							}
						}

						if (successCount > 0) {
							setSuccessMessage(
								`Successfully imported ${successCount} creators. ${errorCount} rows failed.`
							);
							setErrorList(errors);
							if (errorCount === 0) {
								onSuccess();
							}
						} else {
							setError("No creators were imported successfully.");
							setErrorList(errors);
						}
						setLoading(false);
					},
					error: (err) => {
						setError(`CSV parsing failed: ${err.message}`);
						setErrorList([]);
						setLoading(false);
					},
				});
			};
			reader.readAsText(file);
		} catch (error: any) {
			setError(`CSV import failed: ${error.message}`);
			setErrorList([]);
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccessMessage(null);
		setErrorList([]);

		// Client-side validation
		const missingFields = [];
		if (!formData.name) missingFields.push("name");
		if (!formData.genre) missingFields.push("genre");
		if (!formData.avatar) missingFields.push("avatar");
		if (!formData.platform) missingFields.push("platform");
		if (!formData.socialLink) missingFields.push("socialLink");
		if (!formData.bio) missingFields.push("bio");
		if (formData.followers === undefined || formData.followers < 0)
			missingFields.push("followers");
		if (formData.totalViews === undefined || formData.totalViews < 0)
			missingFields.push("totalViews");

		if (missingFields.length > 0) {
			setError(
				`Please fill in the following fields: ${missingFields.join(", ")}`
			);
			setLoading(false);
			return;
		}

		// Validate socialLink format
		if (!/^https?:\/\/.+/.test(formData.socialLink)) {
			setError("Please provide a valid URL for socialLink");
			setLoading(false);
			return;
		}

		// Validate mediaKit URL if provided
		if (formData.mediaKit && !/^https?:\/\/.+/.test(formData.mediaKit)) {
			setError("Please provide a valid URL for mediaKit");
			setLoading(false);
			return;
		}

		try {
			const payload: CreateCreatorData = {
				name: formData.name,
				genre: formData.genre,
				avatar: formData.avatar,
				platform: formData.platform,
				socialLink: formData.socialLink,
				location: formData.location || "Other",
				phoneNumber: formData.phoneNumber,
				mediaKit: formData.mediaKit,
				bio: formData.bio,
				followers: parseFloat(formData.followers.toString()) || 0,
				totalViews: parseInt(formData.totalViews.toString()) || 0,
				averageViews: parseInt(formData.averageViews.toString()) || 0,
				reels: formData.reels || [],
			};

			if (creator) {
				await updateCreator(creator._id!, payload);
			} else {
				await createCreator(payload);
			}
			onSuccess();
		} catch (error: any) {
			console.error("Failed to save creator:", error);
			setError(error.message || "Failed to save creator");
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (
		field: keyof (CreateCreatorData & {
			location: string;
			averageViews: number;
		}),
		value: unknown
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleArrayChange = (field: "reels", value: string) => {
		const items = value
			.split(",")
			.map((item) => item.trim())
			.filter(Boolean);
		setFormData((prev) => ({ ...prev, [field]: items }));
	};

	return (
		<div className="p-6 max-w-6xl mx-auto">
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">
					{creator ? "Edit Creator" : "Add New Creator"}
				</h2>

				<div className="flex gap-2">
					<label className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
						<Upload size={16} />
						Import CSV (Multiple Creators)
						<input
							type="file"
							accept=".csv"
							onChange={handleCSVImport}
							className="hidden"
							disabled={loading}
						/>
					</label>
				</div>
			</div>

			{error && (
				<div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded whitespace-pre-wrap">
					{error}
				</div>
			)}

			{successMessage && (
				<div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded">
					{successMessage}
				</div>
			)}

			{errorList.length > 0 && (
				<div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded max-h-64 overflow-y-auto">
					<h3 className="text-lg font-semibold mb-2">Import Errors:</h3>
					<ul className="list-disc pl-5">
						{errorList.map((err, index) => (
							<li key={index} className="mb-1">
								{err}
							</li>
						))}
					</ul>
				</div>
			)}

			<Tabs defaultValue="basic" className="w-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="basic">Basic Information</TabsTrigger>
					<TabsTrigger value="media" disabled={!creator}>
						Media Gallery
					</TabsTrigger>
				</TabsList>

				<TabsContent value="basic" className="space-y-6">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Left Column - Basic Information */}
							<div className="space-y-4">
								<div>
									<Label htmlFor="name">Name *</Label>
									<Input
										id="name"
										value={formData.name}
										onChange={(e) => handleInputChange("name", e.target.value)}
										required
										placeholder="Enter creator's name"
									/>
								</div>

								<div>
									<Label htmlFor="genre">Genre *</Label>
									<Select
										value={formData.genre}
										onValueChange={(value) => handleInputChange("genre", value)}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select a genre" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="AI Creators">AI Creators</SelectItem>
											<SelectItem value="Video Editing">
												Video Editing
											</SelectItem>
											<SelectItem value="Tech Product">Tech Product</SelectItem>
											<SelectItem value="Lifestyle">Lifestyle</SelectItem>
											<SelectItem value="Business">Business</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>Avatar Image *</Label>
									<ImageUpload
										currentImage={formData.avatar}
										onImageUpload={handleImageUpload}
										onImageDelete={handleImageDelete}
										className="mt-2"
									/>
								</div>

								<div>
									<Label htmlFor="platform">Platform *</Label>
									<Select
										value={formData.platform}
										onValueChange={(value) =>
											handleInputChange("platform", value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select a platform" />
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
									<Label htmlFor="socialLink">Social Profile URL *</Label>
									<Input
										id="socialLink"
										value={formData.socialLink}
										onChange={(e) =>
											handleInputChange("socialLink", e.target.value)
										}
										placeholder="https://instagram.com/username"
										type="url"
										required
									/>
								</div>

								<div>
									<Label htmlFor="phoneNumber">Phone Number</Label>
									<Input
										id="phoneNumber"
										value={formData.phoneNumber}
										onChange={(e) =>
											handleInputChange("phoneNumber", e.target.value)
										}
										placeholder="+1234567890"
										type="tel"
									/>
								</div>

								<div>
									<Label htmlFor="mediaKit">Media Kit URL</Label>
									<Input
										id="mediaKit"
										value={formData.mediaKit}
										onChange={(e) =>
											handleInputChange("mediaKit", e.target.value)
										}
										placeholder="https://example.com/mediakit"
										type="url"
									/>
								</div>

								<div>
									<Label htmlFor="location">Location</Label>
									<Select
										value={formData.location}
										onValueChange={(value) =>
											handleInputChange("location", value)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select location" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="USA">USA</SelectItem>
											<SelectItem value="Canada">Canada</SelectItem>
											<SelectItem value="UK">UK</SelectItem>
											<SelectItem value="Australia">Australia</SelectItem>
											<SelectItem value="Germany">Germany</SelectItem>
											<SelectItem value="France">France</SelectItem>
											<SelectItem value="India">India</SelectItem>
											<SelectItem value="Japan">Japan</SelectItem>
											<SelectItem value="Brazil">Brazil</SelectItem>
											<SelectItem value="Spain">Spain</SelectItem>
											<SelectItem value="Other">Other</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							{/* Right Column - Analytics and Other Fields */}
							<div className="space-y-4">
								<div>
									<Label htmlFor="followers">Followers *</Label>
									<Input
										id="followers"
										type="number"
										step="0.1"
										value={formData.followers}
										onChange={(e) =>
											handleInputChange(
												"followers",
												parseFloat(e.target.value) || 0
											)
										}
										placeholder="e.g., 1000.5"
										min="0"
										required
									/>
								</div>

								<div>
									<Label htmlFor="totalViews">Total Views *</Label>
									<Input
										id="totalViews"
										type="number"
										value={formData.totalViews}
										onChange={(e) =>
											handleInputChange(
												"totalViews",
												parseInt(e.target.value) || 0
											)
										}
										placeholder="e.g., 50000"
										min="0"
										required
									/>
								</div>

								<div>
									<Label htmlFor="averageViews">Average Views</Label>
									<Input
										id="averageViews"
										type="number"
										value={formData.averageViews}
										onChange={(e) =>
											handleInputChange(
												"averageViews",
												parseInt(e.target.value) || 0
											)
										}
										placeholder="e.g., 5000"
										min="0"
									/>
								</div>
							</div>
						</div>

						{/* Full width fields */}
						<div>
							<Label htmlFor="bio">Bio *</Label>
							<Textarea
								id="bio"
								value={formData.bio}
								onChange={(e) => handleInputChange("bio", e.target.value)}
								rows={4}
								placeholder="Creator biography..."
								required
								className="min-h-[100px]"
							/>
						</div>

						{/* Form Actions */}
						<div className="flex justify-end space-x-4 pt-6 border-t">
							<Button type="button" variant="outline" onClick={onCancel}>
								Cancel
							</Button>
							<Button type="submit" disabled={loading}>
								{loading
									? "Saving..."
									: creator
									? "Update Creator"
									: "Create Creator"}
							</Button>
						</div>
					</form>
				</TabsContent>

				<TabsContent value="media">
					{creator?._id ? (
						<MediaManager
							creatorId={creator._id}
							media={media}
							onMediaAdd={handleMediaAdd}
							onMediaDelete={handleMediaDelete}
						/>
					) : (
						<div className="text-center py-8 text-gray-500">
							Save the creator first to manage media files
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default CreatorForm;
