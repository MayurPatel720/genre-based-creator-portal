import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { useCreators } from '../../hooks/useCreators';
import { Creator, MediaFile } from '../../types/Creator';
import ImageUpload from '../ImageUpload';
import LocationInput from './LocationInput';
import MediaManager from './MediaManager';
import { mediaAPI } from '../../services/mediaAPI';
import { imageUploadAPI } from '../../services/imageUpload';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Creator name must be at least 2 characters.',
  }),
  genre: z.string().min(2, {
    message: 'Genre must be at least 2 characters.',
  }),
  avatar: z.string().url({
    message: 'Please enter a valid URL.',
  }),
  platform: z.enum(['Instagram', 'YouTube', 'TikTok', 'Twitter', 'Other']),
  socialLink: z.string().url({
    message: 'Please enter a valid URL.',
  }),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  mediaKit: z.string().url({
    message: 'Please enter a valid URL.',
  }).optional(),
  details: z.object({
    bio: z.string().min(10, {
      message: 'Bio must be at least 10 characters.',
    }),
    location: z.string().optional(),
    analytics: z.object({
      followers: z.number().min(0, {
        message: 'Followers must be a positive number.',
      }),
      totalViews: z.number().min(0, {
        message: 'Total views must be a positive number.',
      }),
      averageViews: z.number().optional(),
    }),
    reels: z.array(z.string()).optional(),
  }),
});

interface CreatorFormProps {
  creator?: Creator | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const CreatorForm: React.FC<CreatorFormProps> = ({ creator, onSuccess, onCancel }) => {
  const [uploading, setUploading] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaFile[]>([]);
  const [currentPublicId, setCurrentPublicId] = useState<string | null>(null);
  const { createCreator, updateCreator } = useCreators();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      genre: '',
      avatar: '',
      platform: 'Instagram',
      socialLink: '',
      location: '',
      phoneNumber: '',
      mediaKit: '',
      details: {
        bio: '',
        location: '',
        analytics: {
          followers: 0,
          totalViews: 0,
          averageViews: 0,
        },
        reels: [],
      },
    },
  });

  useEffect(() => {
    if (creator) {
      reset({
        name: creator.name,
        genre: creator.genre,
        avatar: creator.avatar,
        platform: creator.platform,
        socialLink: creator.socialLink,
        location: creator.location || '',
        phoneNumber: creator.phoneNumber || '',
        mediaKit: creator.mediaKit || '',
        details: {
          bio: creator.details.bio,
          location: creator.details.location || '',
          analytics: {
            followers: creator.details.analytics.followers,
            totalViews: creator.details.analytics.totalViews,
            averageViews: creator.details.analytics.averageViews,
          },
          reels: creator.details.reels,
        },
      });
      setCurrentPublicId(creator.cloudinary_public_id || null);
      
      // Load creator's media
      if (creator.details?.media) {
        setCurrentMedia(creator.details.media);
      }
    }
  }, [creator, reset, setValue]);

  const handleAvatarUpload = async (imageUrl: string, publicId?: string) => {
    // If editing a creator and they have an existing avatar, delete it first
    if (creator && creator.avatar && currentPublicId) {
      try {
        console.log('Deleting old avatar:', currentPublicId);
        await imageUploadAPI.deleteImage(currentPublicId);
        console.log('Old avatar deleted successfully');
      } catch (error) {
        console.error('Failed to delete old avatar:', error);
        // Continue with upload even if deletion fails
      }
    }

    setValue('avatar', imageUrl);
    setCurrentPublicId(publicId || null);
    toast({
      title: 'Success!',
      description: 'Avatar uploaded successfully.',
    });
  };

  const handleAvatarDelete = async () => {
    // If editing a creator and they have an existing avatar, delete it from Cloudinary
    if (creator && creator.avatar && currentPublicId) {
      try {
        console.log('Deleting avatar:', currentPublicId);
        await imageUploadAPI.deleteImage(currentPublicId);
        console.log('Avatar deleted successfully');
        
        setValue('avatar', '');
        setCurrentPublicId(null);
        toast({
          title: 'Success!',
          description: 'Avatar deleted successfully.',
        });
      } catch (error) {
        console.error('Failed to delete avatar:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete avatar from cloud storage.',
          variant: 'destructive',
        });
      }
    } else {
      // If no cloudinary_public_id, just clear the form field
      setValue('avatar', '');
      setCurrentPublicId(null);
      toast({
        title: 'Success!',
        description: 'Avatar removed.',
      });
    }
  };

  const handleMediaAdd = async (file: File) => {
    setUploading(true);
    try {
      if (!creator?._id) {
        throw new Error('Creator ID is missing.');
      }
      const newMedia = await mediaAPI.addMedia(creator._id, file);
      setCurrentMedia((prevMedia) => [...prevMedia, ...newMedia]);
      toast({
        title: 'Success!',
        description: 'Media added successfully.',
      });
    } catch (error: any) {
      console.error('Error adding media:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add media.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleMediaDelete = async (mediaId: string) => {
    setUploading(true);
    try {
      if (!creator?._id) {
        throw new Error('Creator ID is missing.');
      }
      await mediaAPI.deleteMedia(creator._id, mediaId);
      setCurrentMedia((prevMedia) => prevMedia.filter((media) => media.id !== mediaId));
      toast({
        title: 'Success!',
        description: 'Media deleted successfully.',
      });
    } catch (error: any) {
      console.error('Error deleting media:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete media.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setUploading(true);
    try {
      if (creator) {
        // Update existing creator
        await updateCreator(creator._id!, data);
        toast({
          title: 'Success!',
          description: 'Creator updated successfully.',
        });
      } else {
        // Create new creator
        await createCreator(data);
        toast({
          title: 'Success!',
          description: 'Creator created successfully.',
        });
      }
      onSuccess();
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save creator.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 font-anton">
        {creator ? 'Edit Creator' : 'Add New Creator'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Upload */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Avatar</Label>
          <ImageUpload
            currentImage={watch('avatar')}
            onImageUpload={handleAvatarUpload}
            onImageDelete={handleAvatarDelete}
            className="mb-4"
          />
          {errors.avatar && (
            <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>
          )}
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-sm font-medium mb-2 block">
            Name
          </Label>
          <Input
            type="text"
            id="name"
            placeholder="Enter creator name"
            {...register('name')}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Genre */}
        <div>
          <Label htmlFor="genre" className="text-sm font-medium mb-2 block">
            Genre
          </Label>
          <Input
            type="text"
            id="genre"
            placeholder="Enter genre"
            {...register('genre')}
          />
          {errors.genre && (
            <p className="text-red-500 text-sm mt-1">{errors.genre.message}</p>
          )}
        </div>

        {/* Platform */}
        <div>
          <Label htmlFor="platform" className="text-sm font-medium mb-2 block">
            Platform
          </Label>
          <Select onValueChange={(value) => setValue('platform', value)}>
            <SelectTrigger className="w-full">
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
            <p className="text-red-500 text-sm mt-1">{errors.platform.message}</p>
          )}
        </div>

        {/* Social Link */}
        <div>
          <Label htmlFor="socialLink" className="text-sm font-medium mb-2 block">
            Social Link
          </Label>
          <Input
            type="text"
            id="socialLink"
            placeholder="Enter social link"
            {...register('socialLink')}
          />
          {errors.socialLink && (
            <p className="text-red-500 text-sm mt-1">{errors.socialLink.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location" className="text-sm font-medium mb-2 block">
            Location
          </Label>
          <LocationInput
            id="location"
            placeholder="Enter location"
            onChange={(value) => setValue('location', value)}
            defaultValue={watch('location')}
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phoneNumber" className="text-sm font-medium mb-2 block">
            Phone Number
          </Label>
          <Input
            type="text"
            id="phoneNumber"
            placeholder="Enter phone number"
            {...register('phoneNumber')}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Media Kit */}
        <div>
          <Label htmlFor="mediaKit" className="text-sm font-medium mb-2 block">
            Media Kit
          </Label>
          <Input
            type="text"
            id="mediaKit"
            placeholder="Enter media kit URL"
            {...register('mediaKit')}
          />
          {errors.mediaKit && (
            <p className="text-red-500 text-sm mt-1">{errors.mediaKit.message}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio" className="text-sm font-medium mb-2 block">
            Bio
          </Label>
          <Textarea
            id="bio"
            placeholder="Enter bio"
            {...register('details.bio')}
          />
          {errors.details?.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.details.bio.message}</p>
          )}
        </div>

        {/* Analytics - Followers */}
        <div>
          <Label htmlFor="followers" className="text-sm font-medium mb-2 block">
            Followers
          </Label>
          <Input
            type="number"
            id="followers"
            placeholder="Enter number of followers"
            {...register('details.analytics.followers', { valueAsNumber: true })}
          />
          {errors.details?.analytics?.followers && (
            <p className="text-red-500 text-sm mt-1">
              {errors.details.analytics.followers.message}
            </p>
          )}
        </div>

        {/* Analytics - Total Views */}
        <div>
          <Label htmlFor="totalViews" className="text-sm font-medium mb-2 block">
            Total Views
          </Label>
          <Input
            type="number"
            id="totalViews"
            placeholder="Enter total views"
            {...register('details.analytics.totalViews', { valueAsNumber: true })}
          />
          {errors.details?.analytics?.totalViews && (
            <p className="text-red-500 text-sm mt-1">
              {errors.details.analytics.totalViews.message}
            </p>
          )}
        </div>

        {/* Analytics - Average Views */}
        <div>
          <Label htmlFor="averageViews" className="text-sm font-medium mb-2 block">
            Average Views (Optional)
          </Label>
          <Input
            type="number"
            id="averageViews"
            placeholder="Enter average views"
            {...register('details.analytics.averageViews', { valueAsNumber: true })}
          />
          {errors.details?.analytics?.averageViews && (
            <p className="text-red-500 text-sm mt-1">
              {errors.details.analytics.averageViews.message}
            </p>
          )}
        </div>

        {/* Reels */}
        <div>
          <Label htmlFor="reels" className="text-sm font-medium mb-2 block">
            Reels (Optional)
          </Label>
          <Input
            type="text"
            id="reels"
            placeholder="Enter reels URLs, separated by commas"
            {...register('details.reels')}
          />
          {errors.details?.reels && (
            <p className="text-red-500 text-sm mt-1">{errors.details.reels.message}</p>
          )}
        </div>

        {/* Media Management */}
        {creator && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Media Gallery</Label>
            <MediaManager
              creatorId={creator._id!}
              media={currentMedia}
              onMediaAdd={handleMediaAdd}
              onMediaDelete={handleMediaDelete}
            />
          </div>
        )}

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={uploading} className="flex-1">
            {uploading ? 'Saving...' : creator ? 'Update Creator' : 'Create Creator'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatorForm;
