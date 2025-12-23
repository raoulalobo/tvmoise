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
          streamUrl="/api/stream"
          title="🔴 EN DIRECT"
          className="w-full"
        />

        {/* Informations sous le lecteur (cachées en plein écran) */}
        {!isFullscreen && (
          <div className="p-6 bg-arte-gray-darker">
            <h2 className="text-arte-orange text-xl font-bold mb-2">
              Diffusion en direct
            </h2>
            <p className="text-arte-gray-light text-sm">
              Regardez le flux en direct de notre chaîne. Le streaming peut prendre quelques secondes pour démarrer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
