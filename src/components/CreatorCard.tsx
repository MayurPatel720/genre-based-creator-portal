import React from "react";
import { Creator } from "../types/Creator";
import { Eye, Heart, Star } from "lucide-react";

interface CreatorCardProps {
	creator: Creator;
	onClick: () => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onClick }) => {
	return (
		<div
			onClick={onClick}
			className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100 hover:border-purple-200"
		>
			<div className="relative">
				<div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden rounded-t-2xl">
					<img
						src={creator.avatar}
						alt={creator.name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				</div>
				<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
					<Star size={14} className="text-purple-500 fill-current" />
				</div>
			</div>

			<div className="p-4">
				<div className="flex items-center space-x-2 mb-2">
					<div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
						<img
							src={creator.avatar}
							alt={creator.name}
							className="w-full h-full object-cover"
						/>
					</div>
					<h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors flex-1 truncate">
						{creator.name}
					</h3>
				</div>

				<div className="flex flex-wrap gap-1 mb-3">
					{creator.details.tags.slice(0, 2).map((tag, index) => (
						<span
							key={index}
							className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
						>
							{tag}
						</span>
					))}
				</div>

				<div className="flex items-center justify-between text-sm text-gray-500">
					<div className="flex items-center space-x-1">
						<Eye size={14} />
						<span>{creator.details.analytics.totalViews.toLocaleString()}</span>
					</div>
					<div className="flex items-center space-x-1">
						<Heart size={14} className="text-red-400" />
						<span>
							{(creator.details.analytics.followers / 1000).toFixed(1)}k
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreatorCard;
