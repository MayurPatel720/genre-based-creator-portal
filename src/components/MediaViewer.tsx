
import React from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { MediaFile } from '../types/Creator';

interface MediaViewerProps {
  media: MediaFile;
  isOpen: boolean;
  onClose: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ media, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = media.url;
    link.download = `media-${media.id}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Media',
          text: media.caption || 'Check out this media',
          url: media.url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(media.url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={handleDownload}
          className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <Download size={20} />
        </button>
        <button
          onClick={handleShare}
          className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <Share2 size={20} />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Media Content */}
      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {media.type === 'video' ? (
          <video
            src={media.url}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg"
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={media.url}
            alt={media.caption || 'Media'}
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        )}
      </div>

      {/* Caption */}
      {media.caption && (
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-white bg-black/50 rounded-lg px-4 py-2 max-w-2xl mx-auto">
            {media.caption}
          </p>
        </div>
      )}

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};

export default MediaViewer;
