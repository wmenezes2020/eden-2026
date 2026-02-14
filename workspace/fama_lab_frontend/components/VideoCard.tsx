'use client';

import Image from 'next/image';
import { Play, Eye } from 'lucide-react';
import { Video } from '@/types';

interface VideoCardProps {
  video: Video;
  onPlay?: () => void;
}

export default function VideoCard({ video, onPlay }: VideoCardProps) {
  return (
    <div className="card group cursor-pointer overflow-hidden p-0" onClick={onPlay}>
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={video.thumbnail || '/default-video.png'}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Duration */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-dark-900/80 rounded 
                      text-xs text-dark-200">
          {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
        </div>

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-dark-900/30 
                      opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-gold-500/90 flex items-center justify-center
                        transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 text-dark-950 ml-1" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-semibold text-dark-50 mb-2 line-clamp-2 group-hover:text-gold-400 
                      transition-colors">
          {video.title}
        </h4>
        <p className="text-dark-400 text-sm mb-3">{video.artist.name}</p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-dark-400">
            <Eye className="w-4 h-4 mr-1" />
            <span>{video.views.toLocaleString()} views</span>
          </div>
          <span className="text-dark-500">
            {new Date(video.releaseDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
