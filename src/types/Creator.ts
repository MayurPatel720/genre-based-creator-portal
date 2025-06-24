export interface Creator {
	_id?: string;
	name: string;
	genre: string;
	avatar: string;
	platform: string;
	socialLink: string;
	details: {
		bio: string;
		analytics: {
			followers: number;
			totalViews: number;
		};
		reels: string[];
		pricing: string;
		tags: string[];
	};
	createdAt?: string;
	updatedAt?: string;
}
