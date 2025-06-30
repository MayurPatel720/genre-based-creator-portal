
import React from "react";
import { X, Instagram, Youtube, Twitter, Linkedin, Eye, Users, TrendingUp } from "lucide-react";
import { Creator } from "../types/Creator";
import { formatFollowers, formatViews } from "../utils/formatNumbers";

interface CreatorModalProps {
	creator: Creator;
	onClose: () => void;
}

const CreatorModal: React.FC<CreatorModalProps> = ({ creator, onClose }) => {
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
				return <Instagram size={20} className="text-gray-500" />;
		}
	};

	const avgViews = Math.round(creator.details.analytics.totalViews / 10); // Assuming avg based on total

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="relative">
					<img
						src={creator.avatar}
						alt={creator.name}
						className="w-full h-48 object-cover rounded-t-xl"
					/>
					<button
						onClick={onClose}
						className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				{/* Content */}
				<div className="p-6">
					{/* Profile Info */}
					<div className="flex items-start justify-between mb-6">
						<div>
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								{creator.name}
							</h2>
							<p className="text-gray-600 mb-4">{creator.details.bio}</p>
							<div className="flex items-center gap-2 text-sm text-gray-500">
								{renderPlatformIcon()}
								<span>{creator.platform}</span>
								{creator.location && (
									<>
										<span>•</span>
										<span>{creator.location}</span>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Quick Stats */}
					<div className="grid grid-cols-3 gap-4 mb-6">
						<div className="bg-gradient-to-r from-aureolin/10 to-safety-orange/10 p-4 rounded-lg text-center">
							<div className="flex items-center justify-center mb-2">
								<Users className="text-aureolin" size={20} />
							</div>
							<div className="text-2xl font-bold text-gray-900">
								{formatFollowers(creator.details.analytics.followers)}
							</div>
							<div className="text-sm text-gray-600">Followers</div>
						</div>
						<div className="bg-gradient-to-r from-safety-orange/10 to-purpleureus/10 p-4 rounded-lg text-center">
							<div className="flex items-center justify-center mb-2">
								<Eye className="text-safety-orange" size={20} />
							</div>
							<div className="text-2xl font-bold text-gray-900">
								{formatViews(avgViews)}
							</div>
							<div className="text-sm text-gray-600">Avg Views</div>
						</div>
						<div className="bg-gradient-to-r from-purpleureus/10 to-aureolin/10 p-4 rounded-lg text-center">
							<div className="flex items-center justify-center mb-2">
								<TrendingUp className="text-purpleureus" size={20} />
							</div>
							<div className="text-2xl font-bold text-gray-900">
								{formatViews(creator.details.analytics.totalViews)}
							</div>
							<div className="text-sm text-gray-600">Total Views</div>
						</div>
					</div>

					{/* Tags */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-3">
							Specialties
						</h3>
						<div className="flex flex-wrap gap-2">
							{creator.details.tags.map((tag, index) => (
								<span
									key={index}
									className="bg-gradient-to-r from-aureolin/20 to-safety-orange/20 text-gray-800 px-3 py-1 rounded-full text-sm"
								>
									{tag}
								</span>
							))}
						</div>
					</div>

					{/* Recent Content */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-3">
							Recent Content
						</h3>
						<div className="grid grid-cols-2 gap-2">
							{creator.details.reels.slice(0, 4).map((reel, index) => (
								<div
									key={index}
									className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700"
								>
									{reel}
								</div>
							))}
						</div>
					</div>

					{/* Pricing */}
					<div className="mb-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-3">
							Collaboration Pricing
						</h3>
						<p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
							{creator.details.pricing}
						</p>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-3">
						<a
							href={creator.socialLink}
							target="_blank"
							rel="noopener noreferrer"
							className="flex-1 bg-gradient-to-r from-aureolin to-safety-orange text-black font-semibold py-3 px-6 rounded-lg hover:from-aureolin/90 hover:to-safety-orange/90 transition-all duration-200 text-center flex items-center justify-center gap-2"
						>
							{renderPlatformIcon()}
							Visit Profile
						</a>
						<button className="flex-1 bg-gradient-to-r from-purpleureus to-aureolin text-white font-semibold py-3 px-6 rounded-lg hover:from-purpleureus/90 hover:to-aureolin/90 transition-all duration-200">
							Contact Creator
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreatorModal;
