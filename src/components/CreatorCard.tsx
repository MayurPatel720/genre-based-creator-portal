
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
				return <Instagram size={16} className="text-pink-500" />;
			case "youtube":
				return <Youtube size={16} className="text-red-500" />;
			case "linkedin":
				return <Linkedin size={16} className="text-blue-500" />;
			case "twitter":
				return <Twitter size={16} className="text-sky-400" />;
			default:
				return <Instagram size={16} className="text-gray-500" />;
		}
	};

	return (
		<button
			onClick={onClick}
			className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full text-left border border-gray-100 hover:border-aureolin focus:outline-none focus:ring-2 focus:ring-safety-orange relative overflow-hidden group"
			aria-label={`View profile of ${creator.name}, ${
				creator.details?.analytics.followers || 0
			}K followers on ${creator.platform || "unknown platform"}`}
		>
			{/* Gradient Border Effect */}
			<div className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none group-hover:from-aureolin group-hover:to-safety-orange transition-all duration-300" />

			<div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100">
				<img
					src={creator.avatar || "/fallback-avatar.png"}
					alt={`${creator.name}'s avatar`}
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
					loading="lazy"
					onError={(e) => {
						(e.target as HTMLImageElement).src = "/fallback-avatar.png";
					}}
				/>
				{/* Overlay for premium feel */}
				<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
			</div>

			<div className="p-3">
				<div className="flex flex-col gap-2">
					<div>
						<h3
							className="text-sm font-medium text-gray-900 hover:text-safety-orange transition-colors truncate"
							title={creator.name}
						>
							{creator.name}
						</h3>
						{creator.location && (
							<p className="text-xs text-gray-500">{creator.location}</p>
						)}
					</div>
					<a
						href={creator.socialLink || "https://www.instagram.com/saarvendra/"}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1 bg-gray-100 hover:bg-safety-orange/10 text-gray-700 hover:text-safety-orange px-2 py-1 rounded-full text-xs transition-colors self-start"
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
