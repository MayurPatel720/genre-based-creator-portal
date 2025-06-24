
import React, { useState, useEffect } from "react";
import { Creator } from "../../types/Creator";
import { useCreators } from "../../hooks/useCreators";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface CreatorFormProps {
  creator?: Creator | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CreatorForm: React.FC<CreatorFormProps> = ({ creator, onSuccess, onCancel }) => {
  const { createCreator, updateCreator } = useCreators();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    genre: "",
    avatar: "",
    bio: "",
    followers: 0,
    engagement: "",
    totalViews: 0,
    reels: [] as string[],
    pricing: "",
    tags: [] as string[],
  });

  // Populate form with creator data when editing
  useEffect(() => {
    if (creator) {
      setFormData({
        name: creator.name,
        genre: creator.genre,
        avatar: creator.avatar,
        bio: creator.details.bio,
        followers: creator.details.analytics.followers,
        engagement: creator.details.analytics.engagement,
        totalViews: creator.details.analytics.totalViews,
        reels: creator.details.reels,
        pricing: creator.details.pricing,
        tags: creator.details.tags,
      });
    }
  }, [creator]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (creator) {
        await updateCreator(creator.id, formData);
      } else {
        await createCreator(formData);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save creator:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: "reels" | "tags", value: string) => {
    const items = value.split(",").map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {creator ? "Edit Creator" : "Add New Creator"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="genre">Genre</Label>
              <Select
                value={formData.genre}
                onValueChange={(value) => handleInputChange("genre", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Video Editing/AI">Video Editing/AI</SelectItem>
                  <SelectItem value="Tips & Tricks/AI">Tips & Tricks/AI</SelectItem>
                  <SelectItem value="Tech Products">Tech Products</SelectItem>
                  <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={formData.avatar}
                onChange={(e) => handleInputChange("avatar", e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <Label htmlFor="pricing">Pricing</Label>
              <Input
                id="pricing"
                value={formData.pricing}
                onChange={(e) => handleInputChange("pricing", e.target.value)}
                placeholder="e.g., $500-1000/post"
              />
            </div>
          </div>

          {/* Analytics */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="followers">Followers</Label>
              <Input
                id="followers"
                type="number"
                value={formData.followers}
                onChange={(e) => handleInputChange("followers", parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="engagement">Engagement Rate</Label>
              <Input
                id="engagement"
                value={formData.engagement}
                onChange={(e) => handleInputChange("engagement", e.target.value)}
                placeholder="e.g., 4.2%"
              />
            </div>

            <div>
              <Label htmlFor="totalViews">Total Views</Label>
              <Input
                id="totalViews"
                type="number"
                value={formData.totalViews}
                onChange={(e) => handleInputChange("totalViews", parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags.join(", ")}
                onChange={(e) => handleArrayChange("tags", e.target.value)}
                placeholder="tech, AI, editing"
              />
            </div>
          </div>
        </div>

        {/* Full width fields */}
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            rows={4}
            placeholder="Creator biography..."
          />
        </div>

        <div>
          <Label htmlFor="reels">Reel URLs (comma-separated)</Label>
          <Textarea
            id="reels"
            value={formData.reels.join(", ")}
            onChange={(e) => handleArrayChange("reels", e.target.value)}
            rows={3}
            placeholder="https://example.com/reel1, https://example.com/reel2"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : creator ? "Update Creator" : "Create Creator"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatorForm;
