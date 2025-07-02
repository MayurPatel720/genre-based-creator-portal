/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Creator } from "../types/Creator";
import {
	X,
	ExternalLink,
	MapPin,
	Users,
	Eye,
	TrendingUp,
	Play,
	Image as ImageIcon,
	MessageCircle,
} from "lucide-react";
import MediaViewer from "./MediaViewer";

interface CreatorModalProps {
	creator: Creator;
	onClose: () => void;
}

const CreatorModal: React.FC<CreatorModalProps> = ({ creator, onClose }) => {
	const [selectedMedia, setSelectedMedia] = useState<any>(null);
	const formatNumber = (num: number | undefined | null) => {
		if (!num || isNaN(num)) return "0";
		if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
		if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
		return num.toString();
	};

	const handleContactCreator = () => {
		// Open WhatsApp or email based on availability
		const message = `Hi ${creator.name}, I'm interested in collaborating with you!`;
		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, "_blank");
	};

	return (
		<>
			<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
				<div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
					{/* Header */}
					<div className="relative">
						<div className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-t-2xl"></div>
						<button
							onClick={onClose}
							className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
						>
							<X size={20} />
						</button>

						{/* Avatar */}
						<div className="absolute -bottom-16 left-6">
							<img
								src={creator.avatar}
								alt={creator.name}
								className="w-32 h-32 rounded-full border-4 border-white object-cover"
							/>
						</div>
					</div>

					{/* Content */}
					<div className="pt-20 px-6 pb-6">
						{/* Basic Info */}
						<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
							<div>
								<h2 className="text-3xl font-bold text-gray-900 mb-2">
									{creator.name}
								</h2>
								<div className="flex items-center gap-4 text-gray-600 mb-4">
									<span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
										{creator.genre}
									</span>
									<div className="flex items-center gap-1">
										<MapPin size={16} />
										<span>{creator.location}</span>
									</div>
								</div>
							</div>

							<div className="flex gap-3">
								<button
									onClick={handleContactCreator}
									className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
								>
									<MessageCircle size={16} />
									<span>Contact Creator</span>
								</button>

								<a
									href={creator.socialLink}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
								>
									<ExternalLink size={16} />
									<span>Visit {creator.platform}</span>
								</a>
							</div>
						</div>

						{/* Quick Stats */}
						<div className="grid grid-cols-3 gap-4 mb-6">
							<div className="bg-gradient-to-br from-blue-50 to-blue-100 pt-4 pb-4 rounded-xl text-center">
								<div className="flex items-center justify-center mb-2">
									<Users className="text-blue-500" size={20} />
								</div>
								<div className="text-2xl font-bold text-blue-600">
									{formatNumber(creator.details?.analytics?.followers || 0)}
								</div>
								<div className="text-sm text-blue-500">Followers</div>
							</div>

							<div className="bg-gradient-to-br from-green-50 to-green-100 pt-4 pb-4 rounded-xl text-center">
								<div className="flex items-center justify-center mb-2">
									<Eye className="text-green-500" size={20} />
								</div>
								<div className="text-2xl font-bold text-green-600">
									{formatNumber(creator.details?.analytics?.totalViews || 0)}
								</div>
								<div className="text-sm text-green-500">Total Views</div>
							</div>

							<div className="bg-gradient-to-br from-purple-50 to-purple-100 pt-4 pb-4 rounded-xl text-center">
								<div className="flex items-center justify-center mb-2">
									<TrendingUp className="text-purple-500" size={20} />
								</div>
								<div className="text-2xl font-bold text-purple-600">
									{formatNumber(creator?.details?.analytics?.averageViews) || 0}
								</div>
								<div className="text-sm text-purple-500">Avg Views</div>
							</div>
						</div>

						{/* Bio */}
						<div className="mb-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-3">
								About
							</h3>
							<p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
								{creator.details?.bio || "No bio available"}
							</p>
						</div>

						{/* Media Gallery */}
						{creator.details?.media && creator.details.media.length > 0 && (
							<div className="mb-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Photos & Videos ({creator.details.media.length})
								</h3>
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
									{creator.details.media.map((media, index) => (
										<div
											key={media.id || index}
											className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300"
											onClick={() => setSelectedMedia(media)}
										>
											{media.type === "video" ? (
												<>
													<video
														src={media.url}
														className="w-full h-full object-cover"
														muted
													/>
													<div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
														<Play className="text-white" size={24} />
													</div>
													<div className="absolute top-2 left-2">
														<div className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
															<Play size={10} />
															Video
														</div>
													</div>
												</>
											) : (
												<>
													<img
														src={media.url}
														alt={media.caption || "Media"}
														className="w-full h-full object-cover"
													/>
													<div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
														<ImageIcon className="text-white" size={24} />
													</div>
												</>
											)}
										</div>
									))}
								</div>
							</div>
						)}

						{/* Tags */}
						{creator.details?.tags && creator.details.tags.length > 0 && (
							<div>
								<h3 className="text-lg font-semibold text-gray-900 mb-3">
									Tags
								</h3>
								<div className="flex flex-wrap gap-2">
									{creator.details.tags.map((tag, index) => (
										<span
											key={index}
											className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
										>
											#{tag}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Media Viewer */}
			{selectedMedia && (
				<MediaViewer
					media={selectedMedia}
					isOpen={!!selectedMedia}
					onClose={() => setSelectedMedia(null)}
				/>
			)}
		</>
	);
};

export default CreatorModal;
