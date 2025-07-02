
import React, { useState } from 'react';
import { Upload, Trash2, Play, Image as ImageIcon, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { MediaFile } from '../../types/Creator';

interface MediaManagerProps {
  creatorId?: string;
  media: MediaFile[];
  onMediaAdd: (file: File, caption: string) => Promise<void>;
  onMediaDelete: (mediaId: string) => Promise<void>;
}

const MediaManager: React.FC<MediaManagerProps> = ({
  creatorId,
  media,
  onMediaAdd,
  onMediaDelete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !creatorId) return;

    setUploading(true);
    try {
      await onMediaAdd(selectedFile, caption);
      setSelectedFile(null);
      setCaption('');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const isVideo = (file: File) => file.type.startsWith('video/');

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload size={20} className="text-blue-500" />
          Media Management
        </h4>
        
        {/* Enhanced Upload Section */}
        <div className="border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-xl p-8 mb-6 transition-all hover:border-blue-400 hover:bg-blue-50">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-blue-500" />
            </div>
            <Label htmlFor="media-upload" className="cursor-pointer">
              <span className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Click to upload media files
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Supports images (JPG, PNG, GIF) and videos (MP4, MOV, AVI)
              </p>
              <Input
                id="media-upload"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </Label>
            
            {selectedFile && (
              <div className="mt-6 p-4 bg-white rounded-lg border space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    {isVideo(selectedFile) ? (
                      <Play size={16} className="text-blue-500" />
                    ) : (
                      <ImageIcon size={16} className="text-green-500" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption for this media (optional)"
                  rows={3}
                  className="resize-none"
                />
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="mr-2" />
                        Upload Media
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setCaption('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Media Grid */}
        {media.length > 0 ? (
          <div>
            <h5 className="font-medium text-gray-900 mb-4">
              Uploaded Media ({media.length})
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {media.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="aspect-square bg-gray-100">
                    {item.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                        <Play size={24} className="text-blue-500" />
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.caption || 'Media'}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onMediaDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity transform scale-90 group-hover:scale-100"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  
                  {item.type === 'video' && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Play size={12} />
                        Video
                      </div>
                    </div>
                  )}
                  
                  {item.caption && (
                    <div className="p-3 bg-white border-t">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No media files yet</p>
            <p className="text-gray-400 text-sm">Upload your first image or video to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaManager;
