'use client';

import Image from 'next/image';
import { Play, Heart } from 'lucide-react';
import { Track } from '@/types';

interface MusicCardProps {
  track: Track;
  onPlay?: () => void;
}

export default function MusicCard({ track, onPlay }: MusicCardProps) {
  return (
    <div className="card group p-4 cursor-pointer" onClick={onPlay}>
      <div className="relative mb-4">
        <div className="aspect-square rounded-lg overflow-hidden bg-dark-800">
          <Image
            src={track.cover || '/default-cover.png'}
            alt={track.title}
            width={200}
            height={200}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 
                      group-hover:opacity-100 transition-all duration-300">
          <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center
                        transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 text-dark-950 ml-1" />
          </div>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-dark-900/80 rounded 
                      text-xs text-dark-200">
          {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
        </div>
      </div>

      <h4 className="font-semibold text-dark-50 truncate group-hover:text-gold-400 
                    transition-colors">
        {track.title}
      </h4>
      <p className="text-dark-400 text-sm truncate">{track.artist.name}</p>
      
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-dark-500">
          {track.plays.toLocaleString()} plays
        </span>
        <button className="p-1.5 rounded-full text-dark-400 hover:text-gold-400 
                        hover:bg-dark-700 transition-all">
          <Heart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
