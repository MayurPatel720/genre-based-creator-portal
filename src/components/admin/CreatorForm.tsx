import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Creator } from '../../types/Creator';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from "../../hooks/use-toast"
import { updateCreatorAPI, createCreatorAPI } from '../../services/creators';
import ImageUpload from '../ImageUpload';

interface CreatorFormProps {
  creator?: Creator;
  onSuccess: () => void;
  onCancel: () => void;
}

const creatorSchema = z.object({
  name: z.string().min(2, {
    message: "Creator name must be at least 2 characters.",
  }),
  platform: z.string().min(2, {
    message: "Platform must be at least 2 characters.",
  }),
  genre: z.string().min(2, {
    message: "Genre must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  phoneNumber: z.string().optional(),
  socialLink: z.string().optional(),
  avatar: z.string().optional(),
  avatarPublicId: z.string().optional(),
  mediaKit: z.string().optional(),
  bio: z.string().optional(),
  followers: z.number().optional(),
  totalViews: z.number().optional(),
  averageViews: z.number().optional(),
});

type CreatorSchemaType = z.infer<typeof creatorSchema>;

const CreatorForm: React.FC<CreatorFormProps> = ({ creator, onSuccess, onCancel }) => {
  const { toast } = useToast()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreatorSchemaType>({
    resolver: zodResolver(creatorSchema),
    defaultValues: {
      name: creator?.name || '',
      platform: creator?.platform || '',
      genre: creator?.genre || '',
      location: creator?.location || '',
      phoneNumber: creator?.phoneNumber || '',
      socialLink: creator?.socialLink || '',
      avatar: creator?.avatar || '',
      avatarPublicId: creator?.avatarPublicId || '',
      mediaKit: creator?.mediaKit || '',
      bio: creator?.details?.bio || '',
      followers: creator?.details?.analytics?.followers || 0,
      totalViews: creator?.details?.analytics?.totalViews || 0,
      averageViews: creator?.details?.analytics?.averageViews || 0,
    },
  });

  const updateCreator = async (id: string, data: Partial<CreatorSchemaType>) => {
    try {
      await updateCreatorAPI(id, data);
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  };

  const onSubmit = async (data: CreatorSchemaType) => {
    try {
      if (creator) {
        // Update existing creator
        await updateCreatorAPI(creator._id, {
          name: data.name,
          platform: data.platform,
          genre: data.genre,
          location: data.location,
          phoneNumber: data.phoneNumber,
          socialLink: data.socialLink,
          avatar: data.avatar,
          avatarPublicId: data.avatarPublicId,
          mediaKit: data.mediaKit,
          details: {
            bio: data.bio,
            analytics: {
              followers: data.followers,
              totalViews: data.totalViews,
              averageViews: data.averageViews,
            },
          },
        });
        toast({
          title: "Success!",
          description: "Creator updated successfully.",
        });
      } else {
        // Create new creator
        await createCreatorAPI({
          name: data.name,
          platform: data.platform,
          genre: data.genre,
          location: data.location,
          phoneNumber: data.phoneNumber,
          socialLink: data.socialLink,
          avatar: data.avatar,
          avatarPublicId: data.avatarPublicId,
          mediaKit: data.mediaKit,
          details: {
            bio: data.bio,
            analytics: {
              followers: data.followers,
              totalViews: data.totalViews,
              averageViews: data.averageViews,
            },
          },
        });
        toast({
          title: "Success!",
          description: "Creator created successfully.",
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = async (imageUrl: string) => {
    console.log('Avatar uploaded:', imageUrl);
    
    // Extract public_id from Cloudinary URL for future deletion
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    const publicId = filename.split('.')[0];
    
    setValue('avatar', imageUrl);
    setValue('avatarPublicId', `creator-avatars/${publicId}`);
    
    // If editing existing creator, update immediately
    if (creator) {
      try {
        await updateCreator(creator._id, { 
          avatar: imageUrl,
          avatarPublicId: `creator-avatars/${publicId}`
        });
        toast({
          title: "Success!",
          description: "Avatar updated successfully.",
        });
      } catch (error) {
        console.error('Error updating avatar:', error);
        toast({
          title: "Error",
          description: "Failed to update avatar. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAvatarDelete = async () => {
    setValue('avatar', '');
    setValue('avatarPublicId', '');
    
    // If editing existing creator, update immediately
    if (creator) {
      try {
        await updateCreator(creator._id, { 
          avatar: '',
          avatarPublicId: ''
        });
        toast({
          title: "Success!",
          description: "Avatar removed successfully.",
        });
      } catch (error) {
        console.error('Error removing avatar:', error);
        toast({
          title: "Error",
          description: "Failed to remove avatar. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {creator ? 'Edit Creator' : 'Add New Creator'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar Upload */}
          <div className="md:col-span-2 flex justify-center">
            <ImageUpload
              currentImage={watch('avatar')}
              onImageUpload={handleAvatarUpload}
              onImageDelete={handleAvatarDelete}
            />
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
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

          {/* Platform */}
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Input
              type="text"
              id="platform"
              placeholder="Enter platform"
              {...register('platform')}
            />
            {errors.platform && (
              <p className="text-red-500 text-sm mt-1">{errors.platform.message}</p>
            )}
          </div>

          {/* Genre */}
          <div>
            <Label htmlFor="genre">Genre</Label>
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

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              type="text"
              id="location"
              placeholder="Enter location"
              {...register('location')}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
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

          {/* Social Link */}
          <div>
            <Label htmlFor="socialLink">Social Link</Label>
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

          {/* Media Kit */}
          <div>
            <Label htmlFor="mediaKit">Media Kit</Label>
            <Input
              type="text"
              id="mediaKit"
              placeholder="Enter media kit link"
              {...register('mediaKit')}
            />
            {errors.mediaKit && (
              <p className="text-red-500 text-sm mt-1">{errors.mediaKit.message}</p>
            )}
          </div>

          {/* Bio */}
          <div className="md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Enter bio"
              {...register('bio')}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>

          {/* Followers */}
          <div>
            <Label htmlFor="followers">Followers</Label>
            <Input
              type="number"
              id="followers"
              placeholder="Enter followers count"
              {...register('followers', { valueAsNumber: true })}
            />
            {errors.followers && (
              <p className="text-red-500 text-sm mt-1">{errors.followers.message}</p>
            )}
          </div>

          {/* Total Views */}
          <div>
            <Label htmlFor="totalViews">Total Views</Label>
            <Input
              type="number"
              id="totalViews"
              placeholder="Enter total views count"
              {...register('totalViews', { valueAsNumber: true })}
            />
            {errors.totalViews && (
              <p className="text-red-500 text-sm mt-1">{errors.totalViews.message}</p>
            )}
          </div>

          {/* Average Views */}
          <div>
            <Label htmlFor="averageViews">Average Views</Label>
            <Input
              type="number"
              id="averageViews"
              placeholder="Enter average views count"
              {...register('averageViews', { valueAsNumber: true })}
            />
            {errors.averageViews && (
              <p className="text-red-500 text-sm mt-1">{errors.averageViews.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {creator ? 'Update Creator' : 'Create Creator'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatorForm;
