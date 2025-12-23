'use client';

import { useEffect, useRef, useState, forwardRef } from 'react';

/**
 * Composant SimpleVideoPlayer
 * Version simplifiée et fonctionnelle du lecteur vidéo
 * Basé sur le code de test qui fonctionne
 *
 * Expose la référence vidéo au parent via forwardRef
 * pour permettre le plein écran sur mobile
 */

interface SimpleVideoPlayerProps {
  streamUrl: string;
  title?: string;
  className?: string;
}

const SimpleVideoPlayer = forwardRef<HTMLVideoElement, SimpleVideoPlayerProps>(({
  streamUrl,
  title = 'WebTV',
  className = '',
}, ref) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('Initialisation...');

  useEffect(() => {
    const initPlayer = async () => {
      try {
        const mpegtsModule = await import('mpegts.js');
        const mpegts = mpegtsModule.default;

        // Utiliser la ref interne pour accéder à l'élément vidéo
        if (!internalVideoRef.current) {
          console.error('❌ Élément vidéo non trouvé');
          return;
        }

        const player = mpegts.createPlayer(
          {
            type: 'mpegts',
            isLive: true,
            url: streamUrl,
            hasAudio: true,
            hasVideo: true,
          },
          {
            enableWorker: false,
            enableStashBuffer: true,
            stashInitialSize: 128,
            liveBufferLatencyChasing: true,
            liveBufferLatencyMaxLatency: 3,
            liveBufferLatencyMinRemain: 0.5,
            lazyLoad: false,
            deferLoadAfterSourceOpen: false,
            autoCleanupSourceBuffer: true,
            autoCleanupMaxBackwardDuration: 30,
            autoCleanupMinBackwardDuration: 15,
          }
        );

        player.attachMediaElement(internalVideoRef.current);
        player.load();

        player.on('metadata_arrived', () => {
          setStatus('Prêt');
        });

        player.on('error', (type: any, detail: any) => {
          console.error('❌ Erreur:', type, detail);
          setStatus(`Erreur: ${type}`);
        });

        playerRef.current = player;
        setStatus('Chargement...');

      } catch (error) {
        console.error('❌ Erreur d\'initialisation:', error);
        setStatus(`Erreur: ${error}`);
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.log('Erreur nettoyage:', e);
        }
      }
    };
  }, [streamUrl]);

  const handlePlayPause = () => {
    const video = internalVideoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play()
        .then(() => console.log('✅ Lecture démarrée'))
        .catch(err => console.error('❌ Erreur play:', err));
    }
  };

  return (
    <div className={`relative bg-black ${className}`}>
      {/* Titre */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <h1 className="text-white text-2xl font-bold">{title}</h1>
      </div>

      {/* Lecteur vidéo */}
      <div className="aspect-video">
        <video
          ref={(element) => {
            // Assigner à la fois à la ref interne et à la ref externe
            (internalVideoRef as React.MutableRefObject<HTMLVideoElement | null>).current = element;
            if (typeof ref === 'function') {
              ref(element);
            } else if (ref) {
              (ref as React.MutableRefObject<HTMLVideoElement | null>).current = element;
            }
          }}
          className="w-full h-full"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>

      {/* Bouton Play/Pause central */}
      {!isPlaying && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center cursor-pointer"
          onClick={handlePlayPause}
        >
          <div className="bg-blue-600 rounded-full p-8 hover:bg-blue-700 transition-all duration-200 shadow-2xl hover:scale-110 animate-pulse">
            <svg
              className="w-20 h-20 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Contrôles basiques en bas */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePlayPause}
            className="text-white hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-white/10"
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

SimpleVideoPlayer.displayName = 'SimpleVideoPlayer';

export default SimpleVideoPlayer;
