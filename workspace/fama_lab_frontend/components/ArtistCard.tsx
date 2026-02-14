'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Users } from 'lucide-react';
import { Artist } from '@/types';

interface ArtistCardProps {
  artist: Artist;
  delay?: number;
}

export default function ArtistCard({ artist, delay = 0 }: ArtistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="card group cursor-pointer overflow-hidden p-0"
    >
      <Link href={`/artist/${artist.slug}`}>
        {/* Banner */}
        <div className="relative h-40 overflow-hidden">
          {artist.banner ? (
            <Image
              src={artist.banner}
              alt={artist.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gold-500/20 to-purple-500/20" />
          )}
          {artist.isPromoted && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-gold-500 text-dark-950 
                          text-xs font-semibold rounded-full">
              Promoted
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 relative">
          {/* Avatar */}
          <div className="absolute -top-10 left-4">
            <div className="w-16 h-16 rounded-full border-4 border-dark-900 overflow-hidden">
              <Image
                src={artist.avatar || '/default-avatar.png'}
                alt={artist.name}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-dark-50 group-hover:text-gold-400 
                          transition-colors truncate">
              {artist.name}
            </h3>
            <p className="text-dark-400 text-sm mb-2">{artist.genre}</p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-dark-400">
                <Users className="w-4 h-4 mr-1" />
                <span>{artist.followers.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-dark-400">
                <Play className="w-4 h-4 mr-1" />
                <span>{artist.tracks} tracks</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
