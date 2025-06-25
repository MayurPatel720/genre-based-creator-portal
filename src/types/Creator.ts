export interface Creator {
	_id?: string;
	name: string;
	genre: string;
	avatar: string;
	cloudinary_public_id?: string;
	platform: string;
	socialLink: string;
	location?: string;
	details: {
		location: string;
		bio: string;
		analytics: {
			followers: number;
			totalViews: number;
			engagement?: string;
		};
		reels: string[];
		pricing: string;
		tags: string[];
	};
	createdAt?: string;
	updatedAt?: string;
}
