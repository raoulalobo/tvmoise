'use client';

import { YouTubeVideo } from '@/types';
import { Play, Info } from 'lucide-react';
import Image from 'next/image';

/**
 * Composant HeroBanner
 *
 * Rôle : Grande bannière de mise en avant style Netflix/Prime/Disney+
 * - Grande image/vidéo en arrière-plan
 * - Titre et description en overlay
 * - Boutons "Lecture" et "Plus d'infos"
 * - Gradient en bas pour transition vers le contenu
 *
 * Design : Style Netflix avec fond noir et accents rouges
 */

interface HeroBannerProps {
  video: YouTubeVideo;
  onPlay: (video: YouTubeVideo) => void;
  onInfo: (video: YouTubeVideo) => void;
  className?: string;
}

export default function HeroBanner({ video, onPlay, onInfo, className = '' }: HeroBannerProps) {
  return (
    <div className={`relative w-full h-[80vh] overflow-hidden ${className}`}>
      {/* Image d'arrière-plan */}
      <div className="absolute inset-0">
        <Image
          src={video.thumbnail.high}
          alt={video.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Gradient overlay (noir en bas, transparent en haut) */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-transparent" />

        {/* Gradient sur les côtés */}
        <div className="absolute inset-0 bg-gradient-to-r from-netflix-black via-transparent to-netflix-black/50" />
      </div>

      {/* Contenu */}
      <div className="relative h-full flex items-end pb-32">
        <div className="container mx-auto px-6 max-w-3xl">
          {/* Titre */}
          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold mb-4 drop-shadow-2xl">
            {video.title}
          </h1>

          {/* Description (3 lignes max) */}
          {video.description && (
            <p className="text-white text-base md:text-lg mb-6 line-clamp-3 drop-shadow-lg max-w-2xl">
              {video.description}
            </p>
          )}

          {/* Métadonnées */}
          <div className="flex items-center gap-4 mb-8 text-white/90 text-sm">
            {video.duration && (
              <span className="font-semibold">{video.duration}</span>
            )}
            {video.viewCount && (
              <span>{video.viewCount.toLocaleString('fr-FR')} vues</span>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Bouton Lecture */}
            <button
              onClick={() => onPlay(video)}
              className="flex items-center gap-3 px-8 py-3 bg-white text-black rounded
                hover:bg-white/90 transition-all duration-200 font-bold text-lg
                shadow-xl hover:scale-105"
            >
              <Play className="w-6 h-6 fill-black" />
              <span>Lecture</span>
            </button>

            {/* Bouton Plus d'infos */}
            <button
              onClick={() => onInfo(video)}
              className="flex items-center gap-3 px-8 py-3 bg-white/20 text-white rounded
                hover:bg-white/30 transition-all duration-200 font-bold text-lg
                backdrop-blur-sm shadow-xl hover:scale-105"
            >
              <Info className="w-6 h-6" />
              <span>Plus d'infos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gradient de transition vers le bas (fade out) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-netflix-black to-transparent pointer-events-none" />
    </div>
  );
}
