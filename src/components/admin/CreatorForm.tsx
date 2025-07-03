
import React, { useState, useEffect } from "react";
import { Creator } from "../../types/Creator";
import { useCreators } from "../../hooks/useCreators";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { X, Plus } from "lucide-react";

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
	const { createCreator, updateCreator, loading } = useCreators();
	const [formData, setFormData] = useState({
		name: "",
		genre: "",
		avatar: "",
		platform: "Instagram",
		socialLink: "",
		mediaKitUrl: "",
		contactNumber: "",
		location: "",
		bio: "",
		followers: 0,
		totalViews: 0,
		averageViews: 0,
		engagement: "",
		reels: [] as string[],
		tags: [] as string[],
	});
	const [newReel, setNewReel] = useState("");
	const [newTag, setNewTag] = useState("");

	useEffect(() => {
		if (creator) {
			setFormData({
				name: creator.name || "",
				genre: creator.genre || "",
				avatar: creator.avatar || "",
				platform: creator.platform || "Instagram",
				socialLink: creator.socialLink || "",
				mediaKitUrl: creator.mediaKitUrl || "",
				contactNumber: creator.contactNumber || "",
				location: creator.location || "",
				bio: creator.details?.bio || "",
				followers: creator.details?.analytics?.followers || 0,
				totalViews: creator.details?.analytics?.totalViews || 0,
				averageViews: creator.details?.analytics?.averageViews || 0,
				engagement: creator.details?.analytics?.engagement || "",
				reels: creator.details?.reels || [],
				tags: creator.details?.tags || [],
			});
		}
	}, [creator]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (creator?._id) {
				await updateCreator(creator._id, formData);
			} else {
				await createCreator(formData);
			}
			onSuccess();
		} catch (error) {
			console.error("Error saving creator:", error);
		}
	};

	const addReel = () => {
		if (newReel.trim()) {
			setFormData(prev => ({
				...prev,
				reels: [...prev.reels, newReel.trim()]
			}));
			setNewReel("");
		}
	};

	const removeReel = (index: number) => {
		setFormData(prev => ({
			...prev,
			reels: prev.reels.filter((_, i) => i !== index)
		}));
	};

	const addTag = () => {
		if (newTag.trim()) {
			setFormData(prev => ({
				...prev,
				tags: [...prev.tags, newTag.trim()]
			}));
			setNewTag("");
		}
	};

	const removeTag = (index: number) => {
		setFormData(prev => ({
			...prev,
			tags: prev.tags.filter((_, i) => i !== index)
		}));
	};

	return (
		<div className="p-6">
			<Card>
				<CardHeader>
					<CardTitle>
						{creator ? "Edit Creator" : "Add New Creator"}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Basic Information */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label htmlFor="name">Name *</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) =>
										setFormData(prev => ({ ...prev, name: e.target.value }))
									}
									required
								/>
							</div>

							<div>
								<Label htmlFor="genre">Genre *</Label>
								<Input
									id="genre"
									value={formData.genre}
									onChange={(e) =>
										setFormData(prev => ({ ...prev, genre: e.target.value }))
									}
									required
								/>
							</div>

							<div>
								<Label htmlFor="avatar">Avatar URL *</Label>
								<Input
									id="avatar"
									value={formData.avatar}
									onChange={(e) =>
										setFormData(prev => ({ ...prev, avatar: e.target.value }))
									}
									required
								/>
							</div>

							<div>
								<Label htmlFor="platform">Platform *</Label>
								<Select
									value={formData.platform}
									onValueChange={(value) =>
										setFormData(prev => ({ ...prev, platform: value }))
									}
								>
									<SelectTrigger>
										<SelectValue />
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
								<Label htmlFor="socialLink">Social Link *</Label>
								<Input
									id="socialLink"
									value={formData.socialLink}
									onChange={(e) =>
										setFormData(prev => ({ ...prev, socialLink: e.target.value }))
									}
									required
								/>
							</div>

							<div>
								<Label htmlFor="mediaKitUrl">MediaKit URL</Label>
								<Input
									id="mediaKitUrl"
									value={formData.mediaKitUrl}
									onChange={(e) =>
										setFormData(prev => ({ ...prev, mediaKitUrl: e.target.value }))
									}
								/>
							</div>

							<div>
								<Label htmlFor="contactNumber">Contact Number (with country code)</Label>
								<Input
									id="contactNumber"
									placeholder="+91XXXXXXXXXX"
									value={formData.contactNumber}
									onChange={(e) =>
										setFormData(prev => ({ ...prev, contactNumber: e.target.value }))
									}
								/>
							</div>

							<div>
								<Label htmlFor="location">Location</Label>
								<Input
									id="location"
									value={formData.location}
									onChange={(e) =>
										setFormData(prev => ({ ...prev, location: e.target.value }))
									}
								/>
							</div>
						</div>

						{/* Bio */}
						<div>
							<Label htmlFor="bio">Bio *</Label>
							<Textarea
								id="bio"
								value={formData.bio}
								onChange={(e) =>
									setFormData(prev => ({ ...prev, bio: e.target.value }))
								}
								required
								rows={3}
							/>
						</div>

						{/* Analytics */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
							<div>
								<Label htmlFor="followers">Followers *</Label>
								<Input
									id="followers"
									type="number"
									value={formData.followers}
									onChange={(e) =>
										setFormData(prev => ({ ...prev, followers: parseInt(e.target.value) || 0 }))
									}
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
										setFormData(prev => ({ ...prev, totalViews: parseInt(e.target.value) || 0 }))
									}
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
										setFormData(prev => ({ ...prev, averageViews: parseInt(e.target.value) || 0 }))
									}
								/>
							</div>

							<div>
								<Label htmlFor="engagement">Engagement Rate</Label>
								<Input
									id="engagement"
									placeholder="e.g., 5.2%"
									value={formData.engagement}
									onChange={(e) =>
										setFormData(prev => ({ ...prev, engagement: e.target.value }))
									}
								/>
							</div>
						</div>

						{/* Reels */}
						<div>
							<Label>Reels</Label>
							<div className="flex gap-2 mb-2">
								<Input
									placeholder="Add reel URL"
									value={newReel}
									onChange={(e) => setNewReel(e.target.value)}
								/>
								<Button type="button" onClick={addReel}>
									<Plus size={16} />
								</Button>
							</div>
							<div className="flex flex-wrap gap-2">
								{formData.reels.map((reel, index) => (
									<div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
										<span className="text-sm">{reel}</span>
										<button
											type="button"
											onClick={() => removeReel(index)}
											className="text-red-500 hover:text-red-700"
										>
											<X size={14} />
										</button>
									</div>
								))}
							</div>
						</div>

						{/* Tags */}
						<div>
							<Label>Tags</Label>
							<div className="flex gap-2 mb-2">
								<Input
									placeholder="Add tag"
									value={newTag}
									onChange={(e) => setNewTag(e.target.value)}
								/>
								<Button type="button" onClick={addTag}>
									<Plus size={16} />
								</Button>
							</div>
							<div className="flex flex-wrap gap-2">
								{formData.tags.map((tag, index) => (
									<div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded">
										<span className="text-sm">#{tag}</span>
										<button
											type="button"
											onClick={() => removeTag(index)}
											className="text-red-500 hover:text-red-700"
										>
											<X size={14} />
										</button>
									</div>
								))}
							</div>
						</div>

						{/* Actions */}
						<div className="flex gap-4 pt-4">
							<Button type="submit" disabled={loading}>
								{loading ? "Saving..." : creator ? "Update Creator" : "Create Creator"}
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
