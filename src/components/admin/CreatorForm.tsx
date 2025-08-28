
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCreators } from "@/hooks/useCreators";
import { Creator } from "@/types/Creator";

interface CreatorFormProps {
	creator?: Creator | null;
	onSuccess: () => void;
	onCancel: () => void;
}

const PREDEFINED_LOCATIONS = [
	"Mumbai",
	"Delhi", 
	"Bangalore",
	"Hyderabad",
	"Chennai",
	"Kolkata",
	"Pune",
	"Ahmedabad",
	"Jaipur",
	"Lucknow",
	"Other"
];

const CreatorForm: React.FC<CreatorFormProps> = ({ creator, onSuccess, onCancel }) => {
	const { toast } = useToast();
	const { createCreator, updateCreator, loading } = useCreators();
	
	const [formData, setFormData] = useState({
		name: "",
		genre: "",
		platform: "",
		socialLink: "",
		location: "",
		phoneNumber: "",
		mediaKit: "",
		bio: "",
		followers: 0,
		totalViews: 0,
		averageViews: 0,
		reels: [] as string[],
		avatar: "",
	});

	const [customLocation, setCustomLocation] = useState("");
	const [showCustomLocation, setShowCustomLocation] = useState(false);

	// Populate form when editing
	useEffect(() => {
		if (creator) {
			setFormData({
				name: creator.name || "",
				genre: creator.genre || "",
				platform: creator.platform || "",
				socialLink: creator.socialLink || "",
				location: creator.location || "",
				phoneNumber: creator.phoneNumber || "",
				mediaKit: creator.mediaKit || "",
				bio: creator.details?.bio || "",
				followers: creator.details?.analytics?.followers || 0,
				totalViews: creator.details?.analytics?.totalViews || 0,
				averageViews: creator.details?.analytics?.averageViews || 0,
				reels: creator.details?.reels || [],
				avatar: creator.avatar || "",
			});

			// Check if location is custom
			if (creator.location && !PREDEFINED_LOCATIONS.includes(creator.location)) {
				setShowCustomLocation(true);
				setCustomLocation(creator.location);
				setFormData(prev => ({ ...prev, location: "Other" }));
			}
		}
	}, [creator]);

	const handleLocationChange = (value: string) => {
		if (value === "Other") {
			setShowCustomLocation(true);
			setFormData(prev => ({ ...prev, location: value }));
		} else {
			setShowCustomLocation(false);
			setCustomLocation("");
			setFormData(prev => ({ ...prev, location: value }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		try {
			const finalLocation = formData.location === "Other" ? customLocation : formData.location;
			
			const creatorData = {
				name: formData.name,
				genre: formData.genre,
				platform: formData.platform as "Instagram" | "YouTube" | "TikTok" | "Twitter" | "Other",
				socialLink: formData.socialLink,
				location: finalLocation,
				phoneNumber: formData.phoneNumber,
				mediaKit: formData.mediaKit,
				avatar: formData.avatar,
				details: {
					bio: formData.bio,
					location: finalLocation,
					analytics: {
						followers: Number(formData.followers),
						totalViews: Number(formData.totalViews),
						averageViews: Number(formData.averageViews),
					},
					reels: formData.reels,
				},
			};

			if (creator?._id) {
				// Update existing creator
				await updateCreator(creator._id, creatorData);
				toast({
					title: "Success!",
					description: "Creator updated successfully.",
				});
			} else {
				// Create new creator
				await createCreator(creatorData);
				toast({
					title: "Success!",
					description: "Creator created successfully.",
				});
			}
			
			onSuccess();
		} catch (error) {
			console.error("Form submission error:", error);
			toast({
				title: "Error",
				description: creator?._id ? "Failed to update creator." : "Failed to create creator.",
				variant: "destructive",
			});
		}
	};

	return (
		<Card className="w-full max-w-4xl mx-auto">
			<CardHeader>
				<CardTitle>{creator?._id ? "Edit Creator" : "Add New Creator"}</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Basic Information */}
						<div className="space-y-4">
							<div>
								<Label htmlFor="name">Creator Name *</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
									required
								/>
							</div>

							<div>
								<Label htmlFor="genre">Genre *</Label>
								<Select value={formData.genre} onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}>
									<SelectTrigger>
										<SelectValue placeholder="Select genre" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Fashion">Fashion</SelectItem>
										<SelectItem value="Lifestyle">Lifestyle</SelectItem>
										<SelectItem value="Tech">Tech</SelectItem>
										<SelectItem value="Food">Food</SelectItem>
										<SelectItem value="Travel">Travel</SelectItem>
										<SelectItem value="Fitness">Fitness</SelectItem>
										<SelectItem value="Beauty">Beauty</SelectItem>
										<SelectItem value="Gaming">Gaming</SelectItem>
										<SelectItem value="Other">Other</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="platform">Platform *</Label>
								<Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
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

							<div>
								<Label htmlFor="socialLink">Social Media Link *</Label>
								<Input
									id="socialLink"
									type="url"
									value={formData.socialLink}
									onChange={(e) => setFormData(prev => ({ ...prev, socialLink: e.target.value }))}
									required
								/>
							</div>

							<div>
								<Label htmlFor="location">Location *</Label>
								<Select value={formData.location} onValueChange={handleLocationChange}>
									<SelectTrigger>
										<SelectValue placeholder="Select location" />
									</SelectTrigger>
									<SelectContent>
										{PREDEFINED_LOCATIONS.map((location) => (
											<SelectItem key={location} value={location}>
												{location}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{showCustomLocation && (
								<div>
									<Label htmlFor="customLocation">Custom Location *</Label>
									<Input
										id="customLocation"
										value={customLocation}
										onChange={(e) => setCustomLocation(e.target.value)}
										placeholder="Enter custom location"
										required
									/>
								</div>
							)}

							<div>
								<Label htmlFor="phoneNumber">Phone Number</Label>
								<Input
									id="phoneNumber"
									type="tel"
									value={formData.phoneNumber}
									onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
								/>
							</div>
						</div>

						{/* Additional Information */}
						<div className="space-y-4">
							<div>
								<Label htmlFor="avatar">Avatar URL</Label>
								<Input
									id="avatar"
									type="url"
									value={formData.avatar}
									onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
								/>
							</div>

							<div>
								<Label htmlFor="mediaKit">Media Kit URL</Label>
								<Input
									id="mediaKit"
									type="url"
									value={formData.mediaKit}
									onChange={(e) => setFormData(prev => ({ ...prev, mediaKit: e.target.value }))}
								/>
							</div>

							<div>
								<Label htmlFor="bio">Bio</Label>
								<Textarea
									id="bio"
									value={formData.bio}
									onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
									rows={3}
								/>
							</div>

							<div>
								<Label htmlFor="followers">Followers</Label>
								<Input
									id="followers"
									type="number"
									value={formData.followers}
									onChange={(e) => setFormData(prev => ({ ...prev, followers: Number(e.target.value) }))}
								/>
							</div>

							<div>
								<Label htmlFor="totalViews">Total Views</Label>
								<Input
									id="totalViews"
									type="number"
									value={formData.totalViews}
									onChange={(e) => setFormData(prev => ({ ...prev, totalViews: Number(e.target.value) }))}
								/>
							</div>

							<div>
								<Label htmlFor="averageViews">Average Views</Label>
								<Input
									id="averageViews"
									type="number"
									value={formData.averageViews}
									onChange={(e) => setFormData(prev => ({ ...prev, averageViews: Number(e.target.value) }))}
								/>
							</div>
						</div>
					</div>

					<div className="flex gap-4 pt-6">
						<Button type="submit" disabled={loading}>
							{loading ? "Saving..." : (creator?._id ? "Update Creator" : "Create Creator")}
						</Button>
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default CreatorForm;
