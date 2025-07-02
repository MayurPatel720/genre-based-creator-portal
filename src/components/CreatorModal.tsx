import React, { useState } from "react";
import { Creator } from "../types/Creator";
import {
	X,
	Users,
	Eye,
	Star,
	Play,
	Instagram,
	ZoomIn,
	ZoomOut,
	Pause,
	Volume2,
	VolumeX,
	Maximize,
	SkipBack,
	SkipForward,
} from "lucide-react";
import { useInstagramData } from "../hooks/useInstagramData";

interface CreatorModalProps {
	creator: Creator;
	onClose: () => void;
}

const CreatorModal: React.FC<CreatorModalProps> = ({ creator, onClose }) => {
	const { media: instagramMedia, loading: instagramLoading } = useInstagramData(
		creator.platform === "Instagram" ? creator.socialLink : ""
	);

	const [selectedMedia, setSelectedMedia] = useState<any>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [zoomLevel, setZoomLevel] = useState(1);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	const formatNumber = (num: number) => {
		if (num >= 1000000) {
			return `${(num / 1000000).toFixed(1)}M`;
		} else if (num >= 1000) {
			return `${(num / 1000).toFixed(1)}K`;
		}
		return num.toString();
	};

	const handleMediaClick = (media: any) => {
		setSelectedMedia(media);
		setZoomLevel(1);
		setIsPlaying(false);
	};

	const handleVideoPlay = () => {
		const video = document.getElementById('modal-video') as HTMLVideoElement;
		if (video) {
			if (isPlaying) {
				video.pause();
			} else {
				video.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const handleMute = () => {
		const video = document.getElementById('modal-video') as HTMLVideoElement;
		if (video) {
			video.muted = !isMuted;
			setIsMuted(!isMuted);
		}
	};

	const handleTimeUpdate = () => {
		const video = document.getElementById('modal-video') as HTMLVideoElement;
		if (video) {
			setCurrentTime(video.currentTime);
			setDuration(video.duration);
		}
	};

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const video = document.getElementById('modal-video') as HTMLVideoElement;
		if (video) {
			video.currentTime = parseFloat(e.target.value);
			setCurrentTime(video.currentTime);
		}
	};

	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	};

	const handleZoomIn = () => {
		setZoomLevel(prev => Math.min(prev + 0.5, 3));
	};

	const handleZoomOut = () => {
		setZoomLevel(prev => Math.max(prev - 0.5, 0.5));
	};

	const handleFullscreen = () => {
		const element = document.getElementById('media-viewer');
		if (element) {
			element.requestFullscreen();
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="sticky top-0 bg-background border-b border-border p-4 md:p-6 flex items-center justify-between">
					<h2 className="text-xl md:text-2xl font-bold text-foreground">
						Creator Profile
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-accent rounded-full transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				<div className="p-4 md:p-6">
					<div className="grid lg:grid-cols-3 gap-6 md:gap-8">
						{/* Left Section - Creator Info */}
						<div className="lg:col-span-1">
							<div className="text-center mb-6">
								<div className="w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
									<img
										src={creator.avatar}
										alt={creator.name}
										className="w-full h-full object-cover"
									/>
								</div>
								<h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
									{creator.name}
								</h3>
								
								{/* Genre Display */}
								<div className="mb-4">
									<span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm font-medium rounded-full">
										<Star size={16} />
										{creator.genre}
									</span>
								</div>

								<div className="flex flex-wrap gap-2 justify-center mb-4">
									{creator.details.tags.map((tag, index) => (
										<span
											key={index}
											className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm rounded-full"
										>
											{tag}
										</span>
									))}
								</div>
							</div>

							<div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-6">
								<h4 className="font-semibold text-foreground mb-3">
									Quick Stats
								</h4>
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Users size={16} className="text-purple-500" />
											<span className="text-sm text-muted-foreground">
												Followers
											</span>
										</div>
										<span className="font-semibold text-foreground">
											{formatNumber(creator.details.analytics.followers)}
										</span>
									</div>
									{creator.details.analytics.averageViews && (
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2">
												<Eye size={16} className="text-green-500" />
												<span className="text-sm text-muted-foreground">
													Average Views
												</span>
											</div>
											<span className="font-semibold text-foreground">
												{formatNumber(creator.details.analytics.averageViews)}
											</span>
										</div>
									)}
									<div className="flex items-center justify-between">
										<div className="flex items-center space-x-2">
											<Eye size={16} className="text-blue-500" />
											<span className="text-sm text-muted-foreground">
												Total Views
											</span>
										</div>
										<span className="font-semibold text-foreground">
											{formatNumber(creator.details.analytics.totalViews)}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Right Section - Details */}
						<div className="lg:col-span-2 space-y-6">
							<div>
								<h4 className="text-lg font-semibold text-foreground mb-3">
									About
								</h4>
								<p className="text-muted-foreground leading-relaxed">
									{creator.details.bio}
								</p>
							</div>

							{/* Creator's Media Gallery */}
							{creator.details.media && creator.details.media.length > 0 && (
								<div>
									<h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
										<Star size={20} className="text-yellow-500" />
										Media Gallery
									</h4>
									<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
										{creator.details.media.map((item) => (
											<div
												key={item.id}
												className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
												onClick={() => handleMediaClick(item)}
											>
												{item.type === 'video' ? (
													<div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
														<Play
															size={32}
															className="text-blue-500 group-hover:text-blue-600 transition-colors drop-shadow-md"
														/>
													</div>
												) : (
													<div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
														<ZoomIn
															size={32}
															className="text-purple-500 group-hover:text-purple-600 transition-colors drop-shadow-md"
														/>
													</div>
												)}

												<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

												{item.caption && (
													<div className="absolute bottom-2 left-2 right-2 text-xs text-white bg-black/70 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
														{item.caption.length > 30
															? `${item.caption.substring(0, 30)}...`
															: item.caption}
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							)}

							{/* Instagram Media Section */}
							{creator.platform === "Instagram" && (
								<div>
									<h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
										<Instagram size={20} className="text-pink-500" />
										Instagram Content
									</h4>

									{instagramLoading ? (
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{[...Array(6)].map((_, i) => (
												<div
													key={i}
													className="bg-accent rounded-lg aspect-square animate-pulse"
												/>
											))}
										</div>
									) : (
										<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
											{instagramMedia.map((item) => (
												<div
													key={item.id}
													className="bg-accent rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200 group relative overflow-hidden"
													onClick={() => handleMediaClick(item)}
												>
													{item.media_type === "IMAGE" ? (
														<div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
															<ZoomIn
																size={24}
																className="text-muted-foreground group-hover:text-purple-500 transition-colors"
															/>
														</div>
													) : (
														<div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
															<Play
																size={24}
																className="text-muted-foreground group-hover:text-purple-500 transition-colors"
															/>
														</div>
													)}

													<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

													{item.caption && (
														<div className="absolute bottom-2 left-2 right-2 text-xs text-white bg-black/50 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
															{item.caption.length > 50
																? `${item.caption.substring(0, 50)}...`
																: item.caption}
														</div>
													)}
												</div>
											))}
										</div>
									)}

									<p className="text-sm text-muted-foreground mt-2">
										* Instagram content is displayed for demonstration. Full
										integration requires Instagram API setup.
									</p>
								</div>
							)}

							{/* Original Reels Section */}
							<div>
								<h4 className="text-lg font-semibold text-foreground mb-3">
									Portfolio Content
								</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{creator.details.reels.map((reel, index) => (
										<div
											key={index}
											className="bg-accent rounded-lg aspect-video flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200 group"
										>
											<div className="text-center">
												<Play
													size={32}
													className="text-muted-foreground mx-auto mb-2 group-hover:text-purple-500 transition-colors"
												/>
												<p className="text-sm text-muted-foreground">{reel}</p>
											</div>
										</div>
									))}
								</div>
							</div>

							<div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
								<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
									<button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
										Contact Creator
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Enhanced Media Viewer Modal */}
			{selectedMedia && (
				<div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-60">
					<div id="media-viewer" className="relative max-w-5xl max-h-full w-full">
						<div className="absolute top-4 right-4 flex gap-2 z-10">
							<button
								onClick={() => setSelectedMedia(null)}
								className="p-3 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors backdrop-blur-sm"
							>
								<X size={24} />
							</button>
						</div>

						{selectedMedia.type === 'video' ? (
							<div className="relative rounded-lg overflow-hidden bg-black">
								<video
									id="modal-video"
									className="w-full max-h-[70vh] object-contain"
									src={selectedMedia.url}
									onTimeUpdate={handleTimeUpdate}
									onLoadedMetadata={handleTimeUpdate}
									poster={selectedMedia.thumbnail}
								/>
								
								{/* Modern Video Controls */}
								<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
									{/* Progress Bar */}
									<div className="mb-4">
										<input
											type="range"
											min="0"
											max={duration || 0}
											value={currentTime}
											onChange={handleSeek}
											className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
										/>
										<div className="flex justify-between text-xs text-white/70 mt-1">
											<span>{formatTime(currentTime)}</span>
											<span>{formatTime(duration)}</span>
										</div>
									</div>
									
									{/* Control Buttons */}
									<div className="flex items-center justify-center gap-4">
										<button
											onClick={() => {
												const video = document.getElementById('modal-video') as HTMLVideoElement;
												if (video) video.currentTime = Math.max(0, video.currentTime - 10);
											}}
											className="p-2 text-white hover:text-blue-400 transition-colors"
										>
											<SkipBack size={24} />
										</button>
										<button
											onClick={handleVideoPlay}
											className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors backdrop-blur-sm"
										>
											{isPlaying ? <Pause size={24} /> : <Play size={24} />}
										</button>
										<button
											onClick={() => {
												const video = document.getElementById('modal-video') as HTMLVideoElement;
												if (video) video.currentTime = Math.min(duration, video.currentTime + 10);
											}}
											className="p-2 text-white hover:text-blue-400 transition-colors"
										>
											<SkipForward size={24} />
										</button>
										<button
											onClick={handleMute}
											className="p-2 text-white hover:text-blue-400 transition-colors"
										>
											{isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
										</button>
									</div>
								</div>
							</div>
						) : (
							<div className="relative flex items-center justify-center">
								<img
									src={selectedMedia.url}
									alt="Media content"
									className="max-w-full max-h-[80vh] rounded-lg transition-transform duration-200 object-contain"
									style={{ transform: `scale(${zoomLevel})` }}
								/>
								<div className="absolute bottom-4 left-4 flex gap-2">
									<button
										onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 3))}
										className="p-3 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors backdrop-blur-sm"
									>
										<ZoomIn size={20} />
									</button>
									<button
										onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 0.5))}
										className="p-3 bg-black/70 text-white rounded-full hover:bg-black/90 transition-colors backdrop-blur-sm"
									>
										<ZoomOut size={20} />
									</button>
								</div>
							</div>
						)}

						{selectedMedia.caption && (
							<div className="mt-4 p-4 bg-black/70 text-white rounded-lg backdrop-blur-sm">
								<p className="text-center">{selectedMedia.caption}</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default CreatorModal;
