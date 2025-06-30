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
				return <Instagram size={20} className="text-pink-500" />;
			case "youtube":
				return <Youtube size={20} className="text-red-500" />;
			case "linkedin":
				return <Linkedin size={20} className="text-blue-500" />;
			case "twitter":
				return <Twitter size={20} className="text-sky-400" />;
			default:
				return <Instagram size={20} className="text-gray-500" />; // Default with neutral color
		}
	};

	return (
		<button
			onClick={onClick}
			className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-full text-left border border-gray-100 hover:border-gradient focus:outline-none focus:ring-2 focus:ring-purple-300 relative overflow-hidden group"
			aria-label={`View profile of ${creator.name}, ${
				creator.details?.analytics.followers || 0
			}K followers on ${creator.platform || "unknown platform"}`}
		>
			{/* Gradient Border Effect */}
			<div className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none  group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300" />

			<div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
				<img
					src={creator.avatar || "/fallback-avatar.png"} // Fallback image
					alt={`${creator.name}'s avatar`}
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
					loading="lazy" // Lazy load for performance
					onError={(e) => {
						(e.target as HTMLImageElement).src = "/fallback-avatar.png"; // Fallback on error
					}}
				/>
				{/* Overlay for premium feel */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>

			<div className="p-4">
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<div>
						<h3
							className="text-lg font-medium text-gray-900 hover:text-purple-600 transition-colors truncate max-w-[80%] sm:max-w-full"
							title={creator.name} // Full name on hover
						>
							{creator.name}
						</h3>
						{creator.details?.analytics.followers && (
							<p className="text-sm text-gray-500">{creator.location}</p>
						)}
					</div>
					<a
						href={creator.socialLink || "https://www.instagram.com/saarvendra/"}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 px-3 py-1 rounded-full text-sm transition-colors whitespace-nowrap"
						aria-label={`Visit ${creator.name}'s ${
							creator.platform || "Instagram"
						} profile`}
						onClick={(e) => e.stopPropagation()}
					>
						{renderPlatformIcon()} Visit
					</a>
				</div>
			</div>
		</button>
	);
};

export default CreatorCard;
