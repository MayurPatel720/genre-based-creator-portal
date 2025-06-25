

export interface Creator {
	_id?: string;
	name: string;
	genre: string;
	avatar: string;
	platform: string;
	socialLink: string;
	location?: string;
	details: {
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

