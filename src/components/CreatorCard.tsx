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
			</div>

			<div className="p-4">
				<div className="flex items-center space-x-2">
					<h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors flex-1 truncate">
						{creator.name}
					</h3>
				</div>
			</div>
		</div>
	);
};

export default CreatorCard;
