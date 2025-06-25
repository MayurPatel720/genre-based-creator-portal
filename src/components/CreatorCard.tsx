import React from "react";
import { Creator } from "../types/Creator";
import { Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

interface CreatorCardProps {
	creator: Creator;
	onClick: () => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onClick }) => {
	const renderPlatformIcon = () => {
		switch (creator.platform?.toLowerCase()) {
			case "instagram":
				return <Instagram size={20} />;
			case "youtube":
				return <Youtube size={20} />;
			case "linkedin":
				return <Linkedin size={20} />;
			case "twitter":
				return <Twitter size={20} />;
			default:
				return <Instagram size={20} />; // Default icon if not matched
		}
	};
	return (
		<button
			onClick={onClick}
			className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 w-full text-left border border-gray-100 hover:border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
			aria-label={`View profile of ${creator.name}`}
		>
			<div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
				<img
					src={creator.avatar || "/fallback-avatar.png"} // Fallback image
					alt={`${creator.name}'s avatar`}
					className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
				/>
			</div>

			<div className="p-4">
				<div className="flex items-center justify-between gap-2">
					<h3
						className="text-lg font-medium text-gray-900 hover:text-purple-600 transition-colors truncate"
						title={creator.name} // Full name on hover
					>
						{creator.name}
					</h3>
					<a
						href={creator.socialLink || "https://www.instagram.com/saarvendra/"}
						target="_blank"
						rel="noopener noreferrer"
						className="text-gray-600 hover:text-purple-600 transition-colors"
						aria-label={`${creator.name}'s Instagram profile`}
						onClick={(e) => e.stopPropagation()}
					>
						{renderPlatformIcon()}
					</a>
				</div>
			</div>
		</button>
	);
};

export default CreatorCard;
