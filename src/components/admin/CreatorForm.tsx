
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { useCreators } from '../../hooks/useCreators';
import { Creator, CreateCreatorData, UpdateCreatorData, MediaFile } from '../../types/Creator';
import ImageUpload from '../ImageUpload';
import LocationInput from './LocationInput';
import MediaManager from './MediaManager';
import { mediaAPI } from '../../services/mediaAPI';
import { useToast } from '../../hooks/use-toast';

const creatorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  genre: z.string().min(1, 'Genre is required'),
  avatar: z.string().min(1, 'Avatar is required'),
  platform: z.enum(['Instagram', 'YouTube', 'TikTok', 'Twitter', 'Other']),
  socialLink: z.string().url('Must be a valid URL'),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  mediaKit: z.string().optional(),
  bio: z.string().min(1, 'Bio is required'),
  followers: z.number().min(0, 'Followers must be 0 or greater'),
  totalViews: z.number().min(0, 'Total views must be 0 or greater'),
  averageViews: z.number().min(0, 'Average views must be 0 or greater').optional(),
  reels: z.string().optional(),
});

type FormData = z.infer<typeof creatorSchema>;

interface CreatorFormProps {
  creator?: Creator | null;
  onSuccess?: () => void;
  onCancel: () => void;
}

const CreatorForm: React.FC<CreatorFormProps> = ({ creator, onSuccess, onCancel }) => {
  const { createCreator, updateCreator } = useCreators();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<MediaFile[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(creatorSchema),
    defaultValues: {
      name: creator?.name || '',
      genre: creator?.genre || '',
      avatar: creator?.avatar || '',
      platform: creator?.platform as "Instagram" | "YouTube" | "TikTok" | "Twitter" | "Other" || 'Instagram',
      socialLink: creator?.socialLink || '',
      location: creator?.location || '',
      phoneNumber: creator?.phoneNumber || '',
      mediaKit: creator?.mediaKit || '',
      bio: creator?.details.bio || '',
      followers: creator?.details.analytics.followers || 0,
      totalViews: creator?.details.analytics.totalViews || 0,
      averageViews: creator?.details.analytics.averageViews || 0,
      reels: creator?.details.reels.join(', ') || '',
    },
  });

  useEffect(() => {
    if (creator?.details.media) {
      setMedia(creator.details.media);
    }
  }, [creator]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const reelsArray = data.reels ? data.reels.split(',').map((reel) => reel.trim()).filter(Boolean) : [];

      const creatorData: CreateCreatorData | UpdateCreatorData = {
        name: data.name,
        genre: data.genre,
        avatar: data.avatar,
        platform: data.platform,
        socialLink: data.socialLink,
        location: data.location,
        phoneNumber: data.phoneNumber,
        mediaKit: data.mediaKit,
        details: {
          bio: data.bio,
          location: data.location || '',
          analytics: {
            followers: data.followers,
            totalViews: data.totalViews,
            averageViews: data.averageViews,
          },
          reels: reelsArray,
          media: media,
        },
      };

      if (creator) {
        await updateCreator(creator._id!, creatorData as UpdateCreatorData);
        toast({
          title: 'Success!',
          description: 'Creator updated successfully.',
        });
      } else {
        await createCreator(creatorData as CreateCreatorData);
        toast({
          title: 'Success!',
          description: 'Creator created successfully.',
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to save creator. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMediaAdd = async (file: File, caption: string): Promise<void> => {
    if (!creator?._id) {
      toast({
        title: 'Error',
        description: 'Please save the creator first before adding media.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newMedia = await mediaAPI.uploadMedia(creator._id, file, caption);
      setMedia(prev => [...prev, newMedia]);
      toast({
        title: 'Success!',
        description: 'Media uploaded successfully.',
      });
    } catch (error) {
      console.error('Media upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload media. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleMediaDelete = async (mediaId: string): Promise<void> => {
    if (!creator?._id) return;

    try {
      await mediaAPI.deleteMedia(creator._id, mediaId);
      setMedia(prev => prev.filter(item => item.id !== mediaId));
      toast({
        title: 'Success!',
        description: 'Media deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete media. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{creator ? 'Edit Creator' : 'Add New Creator'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="genre">Genre *</Label>
                <Input
                  id="genre"
                  {...register('genre')}
                  className={errors.genre ? 'border-red-500' : ''}
                />
                {errors.genre && <p className="text-red-500 text-xs">{errors.genre.message}</p>}
              </div>
            </div>

            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label>Avatar *</Label>
              <ImageUpload
                currentImage={watch('avatar')}
                onImageUpload={(url) => setValue('avatar', url)}
                onImageDelete={() => setValue('avatar', '')}
              />
              {errors.avatar && <p className="text-red-500 text-xs">{errors.avatar.message}</p>}
            </div>

            {/* Platform and Social Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select
                  value={watch('platform')}
                  onValueChange={(value) => setValue('platform', value as any)}
                >
                  <SelectTrigger className={errors.platform ? 'border-red-500' : ''}>
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
                {errors.platform && <p className="text-red-500 text-xs">{errors.platform.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialLink">Social Link *</Label>
                <Input
                  id="socialLink"
                  type="url"
                  {...register('socialLink')}
                  className={errors.socialLink ? 'border-red-500' : ''}
                />
                {errors.socialLink && <p className="text-red-500 text-xs">{errors.socialLink.message}</p>}
              </div>
            </div>

            {/* Location */}
            <LocationInput
              value={watch('location') || ''}
              onChange={(value) => setValue('location', value)}
              error={errors.location?.message}
            />

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  {...register('phoneNumber')}
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mediaKit">Media Kit URL</Label>
                <Input
                  id="mediaKit"
                  type="url"
                  {...register('mediaKit')}
                  className={errors.mediaKit ? 'border-red-500' : ''}
                />
                {errors.mediaKit && <p className="text-red-500 text-xs">{errors.mediaKit.message}</p>}
              </div>
            </div>

            <Separator />

            {/* Details Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Creator Details</h3>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  {...register('bio')}
                  rows={4}
                  className={errors.bio ? 'border-red-500' : ''}
                />
                {errors.bio && <p className="text-red-500 text-xs">{errors.bio.message}</p>}
              </div>

              {/* Analytics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="followers">Followers *</Label>
                  <Input
                    id="followers"
                    type="number"
                    {...register('followers', { valueAsNumber: true })}
                    className={errors.followers ? 'border-red-500' : ''}
                  />
                  {errors.followers && <p className="text-red-500 text-xs">{errors.followers.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalViews">Total Views *</Label>
                  <Input
                    id="totalViews"
                    type="number"
                    {...register('totalViews', { valueAsNumber: true })}
                    className={errors.totalViews ? 'border-red-500' : ''}
                  />
                  {errors.totalViews && <p className="text-red-500 text-xs">{errors.totalViews.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="averageViews">Average Views</Label>
                  <Input
                    id="averageViews"
                    type="number"
                    {...register('averageViews', { valueAsNumber: true })}
                    className={errors.averageViews ? 'border-red-500' : ''}
                  />
                  {errors.averageViews && <p className="text-red-500 text-xs">{errors.averageViews.message}</p>}
                </div>
              </div>

              {/* Reels */}
              <div className="space-y-2">
                <Label htmlFor="reels">Reels (comma-separated URLs)</Label>
                <Textarea
                  id="reels"
                  {...register('reels')}
                  rows={3}
                  placeholder="https://example.com/reel1, https://example.com/reel2"
                  className={errors.reels ? 'border-red-500' : ''}
                />
                {errors.reels && <p className="text-red-500 text-xs">{errors.reels.message}</p>}
              </div>
            </div>

            {/* Media Management */}
            {creator && (
              <>
                <Separator />
                <MediaManager
                  creatorId={creator._id}
                  media={media}
                  onMediaAdd={handleMediaAdd}
                  onMediaDelete={handleMediaDelete}
                />
              </>
            )}

            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : creator ? 'Update Creator' : 'Create Creator'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
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
