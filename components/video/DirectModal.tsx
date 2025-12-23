'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Maximize, Minimize } from 'lucide-react';
import SimpleVideoPlayer from './SimpleVideoPlayer';

/**
 * Composant DirectModal
 *
 * Rôle : Modal pour le flux Direct MPEG-TS
 * - Lecteur vidéo SimpleVideoPlayer
 * - Taille réduite par défaut
 * - Option plein écran
 * - Fermeture avec bouton X ou touche Escape
 * - Overlay sombre avec backdrop-blur
 *
 * Interactions :
 * - onClick overlay : ferme le modal
 * - onClick bouton X : ferme le modal
 * - onClick bouton fullscreen : bascule plein écran
 * - Touche Escape : ferme le modal
 * - Scroll bloqué quand le modal est ouvert
 *
 * Design : Style Arte avec fond noir
 */

interface DirectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DirectModal({ isOpen, onClose }: DirectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
   * Écouter tous les événements de changement de plein écran pour compatibilité multi-navigateurs
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    // Écouter tous les événements de plein écran pour compatibilité
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  /**
   * Basculer le mode plein écran
   * Sur mobile, utiliser l'élément vidéo directement pour une meilleure compatibilité
   */
  const toggleFullscreen = async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    try {
      // Détecter si on est sur mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (!document.fullscreenElement) {
        // Essayer différentes méthodes de plein écran selon le navigateur
        if (isMobile && 'webkitEnterFullscreen' in videoElement) {
          // iOS Safari - utilise l'API spécifique
          (videoElement as any).webkitEnterFullscreen();
        } else if (videoElement.requestFullscreen) {
          // Navigateurs modernes
          await videoElement.requestFullscreen();
        } else if ((videoElement as any).webkitRequestFullscreen) {
          // Safari et anciens navigateurs webkit
          await (videoElement as any).webkitRequestFullscreen();
        } else if ((videoElement as any).mozRequestFullScreen) {
          // Firefox
          await (videoElement as any).mozRequestFullScreen();
        } else if ((videoElement as any).msRequestFullscreen) {
          // IE/Edge
          await (videoElement as any).msRequestFullscreen();
        }
      } else {
        // Quitter le plein écran
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Erreur plein écran:', error);
    }
  };

  // Ne rien afficher si le modal est fermé
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-lg
        animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Conteneur du modal - taille réduite */}
      <div
        ref={modalRef}
        className={`relative w-full bg-arte-black shadow-2xl overflow-hidden
          animate-in zoom-in-95 duration-300 ${
          isFullscreen ? '' : 'max-w-4xl max-h-[85vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Boutons en haut à droite */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
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

        {/* Lecteur vidéo Direct */}
        <SimpleVideoPlayer
          ref={videoRef}
          streamUrl="/api/stream"
          title="🔴 EN DIRECT"
          className="w-full"
        />
      </div>
    </div>
  );
}
