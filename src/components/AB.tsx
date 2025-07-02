import React from "react";

const VideoPlayer: React.FC = () => {
	const videoUrl =
		"https://res.cloudinary.com/ds7bybp6g/video/upload/v1751475955/creator-media/htquznpluj3ggocue3gl.mp4";

	return (
		<div className="max-w-full mx-auto p-4">
			<h2 className="text-xl font-semibold mb-4">Video Player</h2>
			<video
				controls
				autoPlay
				playsInline // Added for mobile compatibility
				className="w-40 h-40 rounded-lg "
				poster="https://via.placeholder.com/640x360"
			>
				<source src={videoUrl} type="video/mp4" />
				Your browser does not support the video tag.
			</video>
		</div>
	);
};

export default VideoPlayer;
