
import { Creator } from '../types/Creator';

export const mockCreators: Creator[] = [
  {
    _id: "1",
    name: "Alex Chen",
    genre: "AI Creators",
    avatar: "https://res.cloudinary.com/ds7bybp6g/image/upload/v1750434659761/alex-chen_avatar.jpg",
    platform: "YouTube",
    socialLink: "https://youtube.com/@alexchen",
    location: "San Francisco",
    details: {
      pricing: { rate: 500, currency: "USD", type: "per_video" },
      location: "San Francisco",
      bio: "AI researcher and content creator sharing insights about machine learning and artificial intelligence.",
      analytics: {
        followers: 250000,
        totalViews: 5200000,
        averageViews: 45000
      },
      reels: [
        "https://youtube.com/watch?v=ai-tutorial-1",
        "https://youtube.com/watch?v=ai-tutorial-2"
      ],
      media: []
    }
  },
  {
    _id: "2", 
    name: "Sarah Rodriguez",
    genre: "Video Editing",
    avatar: "https://res.cloudinary.com/ds7bybp6g/image/upload/v1750434659761/sarah-rodriguez_avatar.jpg",
    platform: "Instagram",
    socialLink: "https://instagram.com/sarahvideo",
    location: "Los Angeles",
    details: {
      pricing: { rate: 750, currency: "USD", type: "per_project" },
      location: "Los Angeles",
      bio: "Professional video editor and filmmaker creating stunning visual content.",
      analytics: {
        followers: 180000,
        totalViews: 3800000,
        averageViews: 32000
      },
      reels: [
        "https://instagram.com/reel/video-edit-1",
        "https://instagram.com/reel/video-edit-2"
      ],
      media: []
    }
  },
  {
    _id: "3",
    name: "Mike Johnson",
    genre: "Tech Product",
    avatar: "https://res.cloudinary.com/ds7bybp6g/image/upload/v1750434659761/mike-johnson_avatar.jpg",
    platform: "TikTok",
    socialLink: "https://tiktok.com/@mikejohnson",
    location: "Austin",
    details: {
      pricing: { rate: 1000, currency: "USD", type: "per_campaign" },
      location: "Austin",
      bio: "Tech product reviewer and gadget enthusiast showcasing the latest innovations.",
      analytics: {
        followers: 420000,
        totalViews: 8900000,
        averageViews: 67000
      },
      reels: [
        "https://tiktok.com/@mikejohnson/video1",
        "https://tiktok.com/@mikejohnson/video2"
      ],
      media: []
    }
  },
  {
    _id: "4",
    name: "Emma Davis",
    genre: "Business",
    avatar: "https://res.cloudinary.com/ds7bybp6g/image/upload/v1750434659761/emma-davis_avatar.jpg",
    platform: "LinkedIn",
    socialLink: "https://linkedin.com/in/emmadavis",
    location: "New York",
    details: {
      pricing: { rate: 800, currency: "USD", type: "per_post" },
      location: "New York",
      bio: "Business strategist and entrepreneur sharing insights on growth and leadership.",
      analytics: {
        followers: 95000,
        totalViews: 1200000,
        averageViews: 18000
      },
      reels: [
        "https://linkedin.com/posts/emmadavis-video1",
        "https://linkedin.com/posts/emmadavis-video2"
      ],
      media: []
    }
  },
  {
    _id: "5",
    name: "James Wilson",
    genre: "Lifestyle",
    avatar: "https://res.cloudinary.com/ds7bybp6g/image/upload/v1750434659761/james-wilson_avatar.jpg",
    platform: "Instagram",
    socialLink: "https://instagram.com/jameswilson",
    location: "Miami",
    details: {
      pricing: { rate: 600, currency: "USD", type: "per_collaboration" },
      location: "Miami",
      bio: "Lifestyle influencer focused on fitness, travel, and wellness content.",
      analytics: {
        followers: 320000,
        totalViews: 6700000,
        averageViews: 52000
      },
      reels: [
        "https://instagram.com/reel/lifestyle1",
        "https://instagram.com/reel/lifestyle2"
      ],
      media: []
    }
  }
];
