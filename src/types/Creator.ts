
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Creator {
	_id?: string;
	name: string;
	genre: string;
	avatar: string;
	cloudinary_public_id?: string;
	platform: string;
	socialLink: string;
	location?: string;
	phoneNumber?: string;
	mediaKit?: string;
	details: {
		pricing: any;
		location: string;
		bio: string;
		analytics: {
			followers: number;
			totalViews: number;
			averageViews?: number;
		};
		reels: string[];
		media?: MediaFile[];
	};
	createdAt?: string;
	updatedAt?: string;
}

export interface MediaFile {
	id: string;
	type: "image" | "video";
	url: string;
	thumbnail?: string;
	caption?: string;
	createdAt: string;
}
