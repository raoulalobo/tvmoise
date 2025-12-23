'use client';

import { YouTubeVideo } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Play } from 'lucide-react';
import Image from 'next/image';

/**
 * Composant VideoCard
 *
 * Rôle : Afficher une vignette de vidéo YouTube dans une grille
 * - Thumbnail 16:9 avec overlay au hover
 * - Titre de la vidéo (2 lignes max)
 * - Date de publication relative
 * - Badge catégorie (si disponible)
 * - Animation hover : scale + shadow
 *
 * Interactions :
 * - onClick : ouvre la vidéo dans un modal
 * - Hover : affiche un overlay avec icône Play
 *
 * Design : Style TF1 moderne avec fond noir et accents bleus
 */

interface VideoCardProps {
  video: YouTubeVideo;
  onClick: (video: YouTubeVideo) => void;
  className?: string;
}

export default function VideoCard({ video, onClick, className = '' }: VideoCardProps) {
  /**
   * Formater la date de publication en texte relatif
   * Exemple : "il y a 2 jours"
   */
  const getRelativeDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: fr,
      });
    } catch {
      return 'Date inconnue';
    }
  };

  return (
    <div
      onClick={() => onClick(video)}
      className={`group relative bg-white rounded-lg overflow-hidden cursor-pointer
        shadow-card hover:shadow-card-hover
        transition-all duration-300 ease-out
        ${className}`}
    >
      {/* Thumbnail avec ratio 16:9 */}
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        <Image
          src={video.thumbnail.high}
          alt={video.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay semi-transparent au hover avec icône Play */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100
          transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-tf1-red rounded-full p-3 transform scale-90 group-hover:scale-100
            transition-transform duration-300 shadow-lg">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>

        {/* Badge durée (si disponible) */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/90 px-2 py-1 rounded text-xs text-white font-bold">
            {video.duration}
          </div>
        )}

        {/* Badge catégorie (si disponible) */}
        {video.category && (
          <div className="absolute top-2 left-2 bg-tf1-red px-3 py-1 rounded text-xs text-white font-bold uppercase tracking-wide">
            {video.category}
          </div>
        )}
      </div>

      {/* Informations de la vidéo */}
      <div className="p-4 space-y-2">
        {/* Titre (2 lignes max avec ellipsis) */}
        <h3 className="text-gray-900 font-bold text-base leading-tight line-clamp-2
          group-hover:text-tf1-red transition-colors duration-200">
          {video.title}
        </h3>

        {/* Date de publication */}
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{getRelativeDate(video.publishedAt)}</span>
        </div>

        {/* Description (1 ligne max, optionnel) */}
        {video.description && (
          <p className="text-gray-600 text-sm line-clamp-1">
            {video.description}
          </p>
        )}

        {/* Nombre de vues (si disponible) */}
        {video.viewCount && (
          <div className="text-gray-500 text-xs font-medium">
            {video.viewCount.toLocaleString('fr-FR')} vues
          </div>
        )}
      </div>
    </div>
  );
}
