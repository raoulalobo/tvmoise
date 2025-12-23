'use client';

import { YouTubeVideo } from '@/types';
import { X, Calendar, ExternalLink, Maximize, Minimize } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import YouTubePlayer from './YouTubePlayer';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Composant VideoModal
 *
 * Rôle : Modal plein écran pour afficher une vidéo YouTube
 * - Lecteur YouTube intégré (YouTubePlayer)
 * - Informations détaillées de la vidéo
 * - Fermeture avec bouton X ou touche Escape
 * - Overlay sombre avec backdrop-blur
 *
 * Interactions :
 * - onClick overlay : ferme le modal
 * - onClick bouton X : ferme le modal
 * - Touche Escape : ferme le modal
 * - Scroll bloqué quand le modal est ouvert
 *
 * Design : Style TF1 avec fond noir et animations fluides
 */

interface VideoModalProps {
  video: YouTubeVideo | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  /**
   * Gérer la touche Escape pour fermer le modal
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isFullscreen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Bloquer le scroll du body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restaurer le scroll
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isFullscreen]);

  /**
   * Détecter les changements de plein écran
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  /**
   * Basculer le mode plein écran
   */
  const toggleFullscreen = async () => {
    if (!modalRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await modalRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Erreur plein écran:', error);
    }
  };

  /**
   * Formater la date de publication
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

  // Ne rien afficher si le modal est fermé ou si aucune vidéo
  if (!isOpen || !video) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-lg
        animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Conteneur du modal - taille réduite */}
      <div
        ref={modalRef}
        className={`relative w-full bg-arte-gray-darker shadow-2xl overflow-hidden
          animate-in zoom-in-95 duration-300 ${
          isFullscreen ? '' : 'max-w-4xl max-h-[90vh] overflow-y-auto'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Boutons en haut à droite */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          {/* Bouton plein écran */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-arte-black/80 hover:bg-arte-orange
              transition-all duration-200 group shadow-md rounded-full"
            aria-label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
          >
            {isFullscreen ? (
              <Minimize className="w-6 h-6 text-white transition-all duration-300" />
            ) : (
              <Maximize className="w-6 h-6 text-white transition-all duration-300" />
            )}
          </button>

          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="p-2 bg-arte-black/80 hover:bg-arte-orange
              transition-all duration-200 group shadow-md rounded-full"
            aria-label="Fermer"
          >
            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-all duration-300" />
          </button>
        </div>

        {/* Lecteur vidéo */}
        <div className="relative bg-black">
          <YouTubePlayer videoId={video.videoId} autoplay={true} />
        </div>

        {/* Informations de la vidéo */}
        <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto bg-arte-gray-darker">
          {/* Titre */}
          <div className="space-y-2">
            <h2 className="text-arte-orange text-2xl font-bold leading-tight">
              {video.title}
            </h2>

            {/* Date et catégorie */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-arte-gray-light">
                <Calendar className="w-4 h-4" />
                <span>{getRelativeDate(video.publishedAt)}</span>
              </div>

              {video.category && (
                <span className="px-3 py-1 bg-arte-orange/20 border border-arte-orange
                  text-arte-orange text-xs font-bold uppercase">
                  {video.category}
                </span>
              )}

              {video.viewCount && (
                <span className="text-arte-gray-light text-xs font-medium">
                  {video.viewCount.toLocaleString('fr-FR')} vues
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {video.description && (
            <div className="space-y-2">
              <h3 className="text-white font-bold">Description</h3>
              <p className="text-arte-gray-light text-sm leading-relaxed whitespace-pre-wrap">
                {video.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {video.tags && video.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-white font-bold">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-arte-gray-dark text-arte-gray-light text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Lien vers YouTube */}
          <div className="pt-4 border-t border-arte-gray-dark">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-arte-orange hover:bg-arte-orange-dark
                text-white transition-colors duration-200 group font-bold shadow-md"
            >
              <span>Voir sur YouTube</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5
                transition-transform duration-200" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
