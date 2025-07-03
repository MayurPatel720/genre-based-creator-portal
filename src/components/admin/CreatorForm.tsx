
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Creator } from "../../types/Creator";
import { useCreators } from "../../hooks/useCreators";
import { Loader2 } from "lucide-react";

interface CreatorFormProps {
	creator?: Creator | null;
	onSuccess: () => void;
	onCancel: () => void;
}

const CreatorForm: React.FC<CreatorFormProps> = ({ creator, onSuccess, onCancel }) => {
	const { createCreator, updateCreator, loading } = useCreators();
	
	const [formData, setFormData] = useState({
		name: "",
		genre: "",
		avatar: "",
		platform: "Instagram",
		socialLink: "",
		mediaKitUrl: "",
		location: "",
		contactNumber: "",
		countryPrefix: "+91",
		bio: "",
		followers: 0,
		totalViews: 0,
		averageViews: 0,
		engagement: "",
		reels: [] as string[],
		tags: [] as string[],
	});

	const [tagsInput, setTagsInput] = useState("");
	const [reelsInput, setReelsInput] = useState("");

	useEffect(() => {
		if (creator) {
			console.log("Loading creator data:", creator);
			setFormData({
				name: creator.name || "",
				genre: creator.genre || "",
				avatar: creator.avatar || "",
				platform: creator.platform || "Instagram",
				socialLink: creator.socialLink || "",
				mediaKitUrl: creator.mediaKitUrl || "",
				location: creator.location || "",
				contactNumber: creator.contactNumber || "",
				countryPrefix: creator.countryPrefix || "+91",
				bio: creator.details?.bio || "",
				followers: creator.details?.analytics?.followers || 0,
				totalViews: creator.details?.analytics?.totalViews || 0,
				averageViews: creator.details?.analytics?.averageViews || 0,
				engagement: creator.details?.analytics?.engagement || "",
				reels: creator.details?.reels || [],
				tags: creator.details?.tags || [],
			});
			setTagsInput(creator.details?.tags?.join(", ") || "");
			setReelsInput(creator.details?.reels?.join(", ") || "");
		}
	}, [creator]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		const submitData = {
			...formData,
			tags: tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0),
			reels: reelsInput.split(",").map(reel => reel.trim()).filter(reel => reel.length > 0),
		};

		console.log("Submitting data:", submitData);

		try {
			if (creator?._id) {
				await updateCreator(creator._id, submitData);
			} else {
				await createCreator(submitData);
			}
			onSuccess();
		} catch (error) {
			console.error("Form submission error:", error);
		}
	};

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-6">
				{creator ? "Edit Creator" : "Add New Creator"}
			</h2>
			
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<Label htmlFor="name">Name *</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							required
						/>
					</div>

					<div>
						<Label htmlFor="genre">Genre *</Label>
						<Input
							id="genre"
							value={formData.genre}
							onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
							required
						/>
					</div>

					<div>
						<Label htmlFor="avatar">Avatar URL *</Label>
						<Input
							id="avatar"
							value={formData.avatar}
							onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
							required
						/>
					</div>

					<div>
						<Label htmlFor="platform">Platform *</Label>
						<Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
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
							onChange={(e) => setFormData({ ...formData, socialLink: e.target.value })}
							required
						/>
					</div>

					<div>
						<Label htmlFor="mediaKitUrl">MediaKit URL</Label>
						<Input
							id="mediaKitUrl"
							value={formData.mediaKitUrl}
							onChange={(e) => setFormData({ ...formData, mediaKitUrl: e.target.value })}
							placeholder="https://drive.google.com/your-media-kit"
						/>
					</div>

					<div>
						<Label htmlFor="location">Location</Label>
						<Input
							id="location"
							value={formData.location}
							onChange={(e) => setFormData({ ...formData, location: e.target.value })}
						/>
					</div>

					<div className="flex gap-2">
						<div className="w-1/3">
							<Label htmlFor="countryPrefix">Country Code</Label>
							<Input
								id="countryPrefix"
								value={formData.countryPrefix}
								onChange={(e) => setFormData({ ...formData, countryPrefix: e.target.value })}
								placeholder="+91"
							/>
						</div>
						<div className="w-2/3">
							<Label htmlFor="contactNumber">Contact Number</Label>
							<Input
								id="contactNumber"
								value={formData.contactNumber}
								onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
								placeholder="1234567890"
							/>
						</div>
					</div>

					<div>
						<Label htmlFor="followers">Followers *</Label>
						<Input
							id="followers"
							type="number"
							value={formData.followers}
							onChange={(e) => setFormData({ ...formData, followers: Number(e.target.value) })}
							required
						/>
					</div>

					<div>
						<Label htmlFor="totalViews">Total Views *</Label>
						<Input
							id="totalViews"
							type="number"
							value={formData.totalViews}
							onChange={(e) => setFormData({ ...formData, totalViews: Number(e.target.value) })}
							required
						/>
					</div>

					<div>
						<Label htmlFor="averageViews">Average Views</Label>
						<Input
							id="averageViews"
							type="number"
							value={formData.averageViews}
							onChange={(e) => setFormData({ ...formData, averageViews: Number(e.target.value) })}
						/>
					</div>

					<div>
						<Label htmlFor="engagement">Engagement Rate</Label>
						<Input
							id="engagement"
							value={formData.engagement}
							onChange={(e) => setFormData({ ...formData, engagement: e.target.value })}
							placeholder="5.2%"
						/>
					</div>
				</div>

				<div>
					<Label htmlFor="bio">Bio *</Label>
					<Textarea
						id="bio"
						value={formData.bio}
						onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
						required
						rows={4}
					/>
				</div>

				<div>
					<Label htmlFor="tags">Tags (comma separated)</Label>
					<Input
						id="tags"
						value={tagsInput}
						onChange={(e) => setTagsInput(e.target.value)}
						placeholder="tech, ai, content"
					/>
				</div>

				<div>
					<Label htmlFor="reels">Reels URLs (comma separated)</Label>
					<Textarea
						id="reels"
						value={reelsInput}
						onChange={(e) => setReelsInput(e.target.value)}
						placeholder="https://instagram.com/reel1, https://instagram.com/reel2"
						rows={3}
					/>
				</div>

				<div className="flex gap-4 pt-4">
					<Button type="submit" disabled={loading}>
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{creator ? "Update Creator" : "Create Creator"}
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
