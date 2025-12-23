'use client';

import { YouTubeVideo } from '@/types';
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

/**
 * Composant StreamingCard
 *
 * Rôle : Card vidéo style Netflix/Prime/Disney+
 * - Thumbnail 16:9 sans bordure
 * - Hover : zoom important (scale 1.4) + overlay avec infos
 * - Boutons d'action au hover (Play, Ajouter, Like, Plus d'infos)
 * - Transition fluide
 *
 * Design : Style streaming minimaliste et immersif
 */

interface StreamingCardProps {
  video: YouTubeVideo;
  onClick: (video: YouTubeVideo) => void;
  className?: string;
}

export default function StreamingCard({ video, onClick, className = '' }: StreamingCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative flex-shrink-0 w-80 transition-all duration-300 ease-out cursor-pointer
        ${isHovered ? 'z-30 scale-140' : 'z-10 scale-100'} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(video)}
      style={{
        transformOrigin: 'center',
      }}
    >
      {/* Card container */}
      <div className="relative bg-netflix-gray-dark rounded overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300">
        {/* Thumbnail */}
        <div className="relative aspect-video">
          <Image
            src={video.thumbnail.high}
            alt={video.title}
            fill
            sizes="320px"
            className="object-cover"
            loading="lazy"
          />

          {/* Gradient overlay au hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          )}

          {/* Badge durée */}
          {video.duration && !isHovered && (
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-bold rounded">
              {video.duration}
            </div>
          )}
        </div>

        {/* Infos au hover */}
        {isHovered && (
          <div className="p-4 space-y-3 animate-in fade-in duration-200">
            {/* Boutons d'action */}
            <div className="flex items-center gap-2">
              {/* Bouton Play principal */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(video);
                }}
                className="bg-white text-black rounded-full p-2 hover:bg-white/90 transition-colors"
                aria-label="Lecture"
              >
                <Play className="w-5 h-5 fill-black" />
              </button>

              {/* Bouton Ajouter */}
              <button
                onClick={(e) => e.stopPropagation()}
                className="border-2 border-white/60 text-white rounded-full p-2 hover:border-white transition-colors"
                aria-label="Ajouter à ma liste"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Bouton Like */}
              <button
                onClick={(e) => e.stopPropagation()}
                className="border-2 border-white/60 text-white rounded-full p-2 hover:border-white transition-colors"
                aria-label="J'aime"
              >
                <ThumbsUp className="w-5 h-5" />
              </button>

              {/* Bouton Plus d'infos (à droite) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(video);
                }}
                className="ml-auto border-2 border-white/60 text-white rounded-full p-2 hover:border-white transition-colors"
                aria-label="Plus d'infos"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Titre */}
            <h3 className="text-white font-bold text-sm line-clamp-1">
              {video.title}
            </h3>

            {/* Métadonnées */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {video.viewCount && (
                <span className="text-green-500 font-semibold">
                  {video.viewCount.toLocaleString('fr-FR')} vues
                </span>
              )}
              {video.duration && <span>{video.duration}</span>}
            </div>

            {/* Description courte */}
            {video.description && (
              <p className="text-gray-400 text-xs line-clamp-2">
                {video.description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
