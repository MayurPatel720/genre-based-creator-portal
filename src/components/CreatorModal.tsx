/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
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
	FileText,
} from "lucide-react";
import MediaViewer from "./MediaViewer";
import {
	trackCreatorView,
	trackCreatorContact,
	trackMediaView,
} from "../utils/analytics";

interface CreatorModalProps {
	creator: Creator;
	onClose: () => void;
}

const CreatorModal: React.FC<CreatorModalProps> = ({ creator, onClose }) => {
	const [selectedMedia, setSelectedMedia] = useState<any>(null);

	// Track creator view when modal opens
	useEffect(() => {
		trackCreatorView(creator.name, creator.genre);
	}, [creator.name, creator.genre]);

	const formatNumber = (num: number | undefined | null) => {
		if (!num || isNaN(num)) return "0";
		if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
		if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
		return num.toString();
	};

	const handleContactCreator = () => {
		// Track contact event
		trackCreatorContact(creator.name, "whatsapp");

		if (creator.phoneNumber) {
			// Remove any non-digit characters and format for WhatsApp
			const cleanPhone = creator.phoneNumber.replace(/\D/g, "");
			const message = `Hi ${creator.name}, I'm interested in collaborating with you!`;
			const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
				message
			)}`;
			window.open(whatsappUrl, "_blank");
		} else {
			alert("Phone number not available for this creator");
		}
	};

	const handleVisitSocial = () => {
		// Track social visit
		trackCreatorContact(creator.name, creator.platform.toLowerCase());
	};

	const handleVisitMediaKit = () => {
		// Track media kit visit
		trackCreatorContact(creator.name, "media_kit");

		if (creator.mediaKit) {
			window.open(creator.mediaKit, "_blank");
		}
	};

	const handleMediaClick = (media: any) => {
		// Track media view
		trackMediaView(creator.name, media.type);
		setSelectedMedia(media);
	};

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<>
			<div
				className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-poppins"
				onClick={handleBackdropClick}
			>
				<div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
					{/* Header with Banner Image */}
					<div className="relative">
						<div className="h-48 bg-gradient-to-br from-brand-aureolin/20 via-brand-orange/20 to-brand-purple/20 rounded-t-2xl overflow-hidden">
							<img
								src="/lovable-uploads/27249619-0749-4ac7-be51-296f36f7b496.png"
								alt="Banner"
								className="w-full h-full object-cover "
							/>
						</div>
						<button
							onClick={onClose}
							className="absolute top-4 right-4 p-2 bg-brand-black/20 hover:bg-brand-black/40 text-white rounded-full transition-colors"
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
					<div className="pt-20 px-6 pb-6 relative">
						<div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0 mb-6">
							<div className="flex-1">
								<h2 className="text-3xl font-bold text-brand-black mb-2 font-anton">
									{creator.name}
								</h2>
								<div className="flex items-center gap-4 text-gray-600 mb-4">
									<span className="bg-brand-aureolin text-brand-black px-3 py-1 rounded-full text-sm font-semibold">
										{creator.genre}
									</span>
									<div className="flex items-center gap-1">
										<MapPin size={16} className="text-brand-orange" />
										<span>{creator.location}</span>
									</div>
								</div>
							</div>

							{/* Action Buttons - Mobile: stacked under name, Desktop: side by side smaller */}
							<div className="flex flex-col md:flex-row gap-2 md:gap-2 md:ml-4">
								{creator.phoneNumber && (
									<button
										onClick={handleContactCreator}
										className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange/80 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium"
									>
										<MessageCircle size={14} />
										<span className="md:hidden lg:inline">Contact Creator</span>
										<span className="hidden md:inline lg:hidden">Contact</span>
									</button>
								)}

								<a
									href={creator.socialLink}
									target="_blank"
									rel="noopener noreferrer"
									onClick={handleVisitSocial}
									className="flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purple/80 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm font-medium"
								>
									<ExternalLink size={14} />
									<span className="md:hidden lg:inline">
										Visit {creator.platform}
									</span>
									<span className="hidden md:inline lg:hidden">Visit</span>
								</a>
							</div>
						</div>

						{/* Quick Stats */}
						<div className="grid grid-cols-3 gap-2 mb-6">
							<div className="bg-gradient-to-br from-brand-aureolin/10 to-brand-aureolin/20 pt-4 pb-4 rounded-xl text-center">
								<div className="flex items-center justify-center mb-2">
									<Users className="text-brand-purple" size={20} />
								</div>
								<div className="text-xl md:text-2xl font-bold text-brand-black">
									{formatNumber(creator.details?.analytics?.followers || 0)}
								</div>
								<div className="text-sm text-brand-purple">Followers</div>
							</div>

							<div className="bg-gradient-to-br from-brand-orange/10 to-brand-orange/20 pt-4 pb-4 rounded-xl text-center">
								<div className="flex items-center justify-center mb-2">
									<Eye className="text-brand-orange" size={20} />
								</div>
								<div className="text-xl md:text-2xl font-bold text-brand-black">
									{formatNumber(creator.details?.analytics?.totalViews || 0)}
								</div>
								<div className="text-sm text-brand-orange">Total Views</div>
							</div>

							<div className="bg-gradient-to-br from-brand-purple/10 to-brand-purple/20 pt-4 pb-4 rounded-xl text-center">
								<div className="flex items-center justify-center mb-2">
									<TrendingUp className="text-brand-purple" size={20} />
								</div>
								<div className="text-xl md:text-2xl font-bold text-brand-black">
									{formatNumber(creator?.details?.analytics?.averageViews) || 0}
								</div>
								<div className="text-sm text-brand-purple">Avg Views</div>
							</div>
						</div>

						{/* Media Gallery */}
						{creator.details?.media && creator.details.media.length > 0 && (
							<div className="mb-6">
								<h3 className="text-lg font-semibold text-brand-black mb-4 font-anton">
									Photos & Videos ({creator.details.media.length})
								</h3>
								<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
									{creator.details.media.map((media, index) => (
										<div
											key={media.id || index}
											className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300"
											onClick={() => handleMediaClick(media)}
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
														<div className="bg-brand-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
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
						<div className="mb-6">
							<h3 className="text-lg font-semibold text-brand-black mb-3 font-anton">
								About Creator
							</h3>
							<p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
								{creator.details?.bio || "No bio available"}
							</p>
						</div>
						{/* Media Kit Button - Positioned to avoid conflict with WhatsApp button */}
						{creator.mediaKit && (
							<div className="fixed bottom-10 md:bottom-6 right-6 z-50">
								<button
									onClick={handleVisitMediaKit}
									className="group bg-brand-purple hover:bg-brand-purple/80 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
									title="Visit Media Kit"
								>
									<FileText size={18} />
									<span className="hidden lg:inline group-hover:inline-block transition-all duration-300 whitespace-nowrap">
										Visit Media Kit
									</span>
								</button>
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
