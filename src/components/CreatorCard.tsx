
import React from "react";
import { Creator } from "../types/Creator";
import {
	Instagram,
	Linkedin,
	Twitter,
	Youtube,
	MapPin,
	Users,
	Eye,
} from "lucide-react";

interface CreatorCardProps {
	creator: Creator;
	onClick: () => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onClick }) => {
	const renderPlatformIcon = (size: number = 16) => {
		switch (creator.platform?.toLowerCase()) {
			case "instagram":
				return <Instagram size={size} className="text-pink-500" />;
			case "youtube":
				return <Youtube size={size} className="text-red-500" />;
			case "linkedin":
				return <Linkedin size={size} className="text-blue-500" />;
			case "twitter":
				return <Twitter size={size} className="text-sky-400" />;
			default:
				return <Instagram size={size} className="text-gray-500" />;
		}
	};

	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`;
		} else if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K`;
		}
		return num.toString();
	};

	return (
		<div className="group relative font-poppins">
			<button
				onClick={onClick}
				className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 w-full text-left border border-gray-100 hover:border-brand-orange/30 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 relative overflow-hidden group-hover:scale-[1.02]"
				aria-label={`View profile of ${creator.name}, ${
					creator.details?.analytics.followers || 0
				}K followers on ${creator.platform || "unknown platform"}`}
			>
				{/* Gradient Border Effect */}
				<div className="absolute inset-0 bg-gradient-to-r from-brand-orange/10 to-brand-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

				{/* Avatar Section */}
				<div className="relative h-48 overflow-hidden rounded-t-xl bg-gradient-to-br from-brand-aureolin/10 to-brand-orange/10">
					<img
						src={creator.avatar || "/fallback-avatar.png"}
						alt={`${creator.name}'s avatar`}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
						loading="lazy"
						onError={(e) => {
							(e.target as HTMLImageElement).src = "/fallback-avatar.png";
						}}
					/>

					{/* Overlay with stats - appears on hover */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
						<div className="text-white space-y-1.5">
							<div className="flex items-center gap-2 text-sm">
								<Users size={14} />
								<span>
									{formatNumber(creator.details?.analytics.followers || 0)}
								</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Eye size={14} />
								<span>
									{formatNumber(creator.details?.analytics.totalViews || 0)}
								</span>
							</div>
						</div>
					</div>

					{/* Platform Badge */}
					<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
						{renderPlatformIcon(16)}
					</div>
				</div>

				{/* Content Section - Improved mobile layout */}
				<div className="p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
						<div className="flex-1 min-w-0">
							<h3 className="text-base sm:text-lg font-semibold text-brand-black group-hover:text-brand-orange transition-colors duration-300 truncate">
								{creator.name}
							</h3>
							<div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
								<MapPin size={10} className="sm:w-3 sm:h-3 flex-shrink-0" />
								<span className="truncate">{creator.location}</span>
							</div>
						</div>
						<a
							href={
								creator.socialLink || "https://www.instagram.com/saarvendra/"
							}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-1 sm:gap-1.5 bg-gray-100 hover:bg-brand-aureolin/20 text-gray-700 hover:text-brand-purple px-2.5 py-1.5 sm:px-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-sm self-end sm:self-auto"
							aria-label={`Visit ${creator.name}'s ${
								creator.platform || "Instagram"
							} profile`}
							onClick={(e) => e.stopPropagation()}
						>
							{renderPlatformIcon(10)}
							<span className="sm:inline">Visit</span>
						</a>
					</div>
				</div>

				{/* Shimmer effect on hover */}
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-aureolin/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
			</button>
		</div>
	);
};

export default CreatorCard;
