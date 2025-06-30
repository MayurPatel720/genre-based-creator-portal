
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
				return <Instagram size={20} className="text-safety-orange" />;
			case "youtube":
				return <Youtube size={20} className="text-red-500" />;
			case "linkedin":
				return <Linkedin size={20} className="text-purpleureus" />;
			case "twitter":
				return <Twitter size={20} className="text-sky-400" />;
			default:
				return <Instagram size={20} className="text-safety-orange" />;
		}
	};

	return (
		<button
			onClick={onClick}
			className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 w-full text-left border-2 border-transparent hover:border-aureolin focus:outline-none focus:ring-4 focus:ring-aureolin/30 relative overflow-hidden group transform hover:scale-105"
			aria-label={`View profile of ${creator.name}, ${
				creator.details?.analytics.followers || 0
			}K followers on ${creator.platform || "unknown platform"}`}
		>
			{/* Gradient Border Effect */}
			<div className="absolute inset-0 gradient-aureolin-orange opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl p-0.5">
				<div className="bg-white rounded-2xl h-full w-full" />
			</div>

			<div className="relative">
				<div className="aspect-square overflow-hidden rounded-t-2xl bg-gradient-to-br from-aureolin/20 to-safety-orange/20">
					<img
						src={creator.avatar || "/fallback-avatar.png"}
						alt={`${creator.name}'s avatar`}
						className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
						loading="lazy"
						onError={(e) => {
							(e.target as HTMLImageElement).src = "/fallback-avatar.png";
						}}
					/>
					{/* Overlay for premium feel */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-aureolin/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				</div>

				<div className="p-4 relative z-10 bg-white rounded-b-2xl">
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
						<div className="flex-1">
							<h3
								className="text-lg font-quinn font-bold text-gray-900 hover:text-purpleureus transition-colors truncate"
								title={creator.name}
							>
								{creator.name}
							</h3>
							{creator.location && (
								<p className="text-sm text-gray-600 font-medium">{creator.location}</p>
							)}
						</div>
						<a
							href={creator.socialLink || "https://www.instagram.com/saarvendra/"}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 gradient-aureolin-orange hover:gradient-orange-purple text-black hover:text-white px-4 py-2 rounded-full text-sm font-quinn font-semibold transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-transparent hover:border-white"
							aria-label={`Visit ${creator.name}'s ${
								creator.platform || "Instagram"
							} profile`}
							onClick={(e) => e.stopPropagation()}
						>
							{renderPlatformIcon()} 
							<span>Visit</span>
						</a>
					</div>
				</div>
			</div>
		</button>
	);
};

export default CreatorCard;
