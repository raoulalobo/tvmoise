'use client';

import { useRef, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import VideoControls from './VideoControls';

/**
 * Composant TVPlayer
 *
 * Rôle : Composant principal qui combine le lecteur vidéo et les contrôles
 * Interactions :
 * - Combine VideoPlayer et VideoControls
 * - Gère l'état global de la lecture (play/pause)
 * - Coordonne les interactions entre le lecteur et les contrôles
 *
 * Exemple d'utilisation :
 * ```tsx
 * <TVPlayer
 *   streamUrl="http://example.com/stream.ts"
 *   title="Ma Chaîne TV"
 * />
 * ```
 */

interface TVPlayerProps {
  streamUrl: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
}

export default function TVPlayer({
  streamUrl,
  title = 'WebTV',
  autoPlay = false,
  className = '',
}: TVPlayerProps) {
  // Référence au conteneur principal (pour le plein écran)
  const containerRef = useRef<HTMLDivElement>(null);

  // Référence à l'élément vidéo
  const videoRef = useRef<HTMLVideoElement>(null);

  // Référence au lecteur mpegts.js
  const [player, setPlayer] = useState<any>(null);

  // État de lecture
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // État de visibilité des contrôles
  const [showControls, setShowControls] = useState(true);

  // Référence au timeout pour masquer les contrôles
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  /**
   * Basculer entre lecture et pause
   */
  const handlePlayPause = () => {
    console.log('🎯 Clic sur le bouton Play/Pause');
    console.log('📹 videoRef.current:', videoRef.current);
    console.log('🎬 containerRef.current:', containerRef.current);

    if (!videoRef.current) {
      console.warn('⚠️ videoRef.current est null, recherche de l\'élément vidéo...');

      // Chercher l'élément vidéo dans le container
      if (containerRef.current) {
        const video = containerRef.current.querySelector('video');
        console.log('🔍 Élément vidéo trouvé:', video);

        if (video) {
          (videoRef as React.MutableRefObject<HTMLVideoElement>).current = video as HTMLVideoElement;
        } else {
          console.error('❌ Aucun élément vidéo trouvé dans le container');
          return;
        }
      } else {
        console.error('❌ containerRef.current est null');
        return;
      }
    }

    console.log('▶️ État actuel - isPlaying:', isPlaying);

    if (isPlaying) {
      console.log('⏸️ Mise en pause...');
      videoRef.current.pause();
      // Ne pas mettre à jour isPlaying ici, laisser l'événement 'pause' le faire
    } else {
      console.log('▶️ Démarrage de la lecture...');
      videoRef.current.play()
        .then(() => {
          console.log('✅ Lecture démarrée avec succès');
          // Ne pas mettre à jour isPlaying ici, laisser l'événement 'play' le faire
        })
        .catch((error) => {
          console.error('❌ Erreur lors de la lecture:', error);
        });
    }
  };

  /**
   * Afficher les contrôles et les masquer après 3 secondes d'inactivité
   */
  const handleMouseMove = () => {
    setShowControls(true);

    // Réinitialiser le timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Masquer les contrôles après 3 secondes si la vidéo est en lecture
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  /**
   * Callback lorsque le lecteur est prêt
   */
  const handlePlayerReady = (mpegtsPlayer: any) => {
    console.log('🎬 handlePlayerReady appelé, player:', mpegtsPlayer);
    setPlayer(mpegtsPlayer);

    // Obtenir la référence vidéo du lecteur
    if (mpegtsPlayer && containerRef.current) {
      console.log('🔍 Recherche de l\'élément vidéo dans le container...');
      const video = containerRef.current.querySelector('video');
      console.log('📺 Élément vidéo trouvé:', video);

      if (video) {
        (videoRef as React.MutableRefObject<HTMLVideoElement>).current = video;
        console.log('✅ videoRef.current défini avec succès');
      } else {
        console.warn('⚠️ Aucun élément vidéo trouvé');
      }
    } else {
      console.warn('⚠️ Conditions non remplies - mpegtsPlayer:', !!mpegtsPlayer, 'containerRef:', !!containerRef.current);
    }
  };

  /**
   * Callback lors du démarrage de la lecture
   */
  const handlePlaying = () => {
    console.log('🎵 Événement PLAYING détecté');
    setIsPlaying(true);
  };

  /**
   * Callback lors de la mise en pause
   */
  const handlePaused = () => {
    console.log('⏸️ Événement PAUSED détecté');
    setIsPlaying(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative bg-black overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Titre de la chaîne (affiché en haut) */}
      <div
        className={`absolute top-0 left-0 right-0 z-20 px-6 py-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h1 className="text-white text-2xl font-bold">{title}</h1>
      </div>

      {/* Lecteur vidéo */}
      <VideoPlayer
        streamUrl={streamUrl}
        autoPlay={autoPlay}
        onPlayerReady={handlePlayerReady}
        onPlaying={handlePlaying}
        onPaused={handlePaused}
        onError={(error) => console.error('Erreur du lecteur:', error)}
        className="aspect-video"
      />

      {/* Contrôles vidéo */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <VideoControls
          videoRef={videoRef}
          containerRef={containerRef}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
        />
      </div>

      {/* Indicateur de lecture (bouton play/pause central au clic) */}
      <div
        className="absolute inset-0 z-30 flex items-center justify-center cursor-pointer"
        onClick={handlePlayPause}
      >
        {!isPlaying && (
          <div className="bg-blue-600 rounded-full p-8 hover:bg-blue-700 transition-all duration-200 shadow-2xl hover:scale-110 animate-pulse">
            <svg
              className="w-20 h-20 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
