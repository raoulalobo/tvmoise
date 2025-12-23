'use client';

import { useEffect, useRef, useState } from 'react';
import type mpegts from 'mpegts.js';

/**
 * Composant VideoPlayer
 *
 * Rôle : Lecteur vidéo principal pour les flux MPEG-TS
 * Interactions :
 * - Reçoit l'URL du flux via props
 * - Initialise et gère le lecteur mpegts.js
 * - Expose des méthodes de contrôle (play, pause, volume, etc.)
 * - Émet des événements d'état (playing, paused, error)
 *
 * Exemple d'utilisation :
 * ```tsx
 * <VideoPlayer
 *   streamUrl="http://example.com/stream.ts"
 *   onPlayerReady={(player) => console.log('Lecteur prêt', player)}
 *   onError={(error) => console.error('Erreur', error)}
 * />
 * ```
 */

interface VideoPlayerProps {
  streamUrl: string;
  autoPlay?: boolean;
  muted?: boolean;
  onPlayerReady?: (player: any) => void;
  onError?: (error: string) => void;
  onPlaying?: () => void;
  onPaused?: () => void;
  className?: string;
}

export default function VideoPlayer({
  streamUrl,
  autoPlay = false,
  muted = false,
  onPlayerReady,
  onError,
  onPlaying,
  onPaused,
  className = '',
}: VideoPlayerProps) {
  // Référence à l'élément vidéo HTML
  const videoRef = useRef<HTMLVideoElement>(null);

  // Référence au lecteur mpegts.js
  const playerRef = useRef<any>(null);

  // État de chargement
  const [isLoading, setIsLoading] = useState(true);

  // État d'erreur
  const [error, setError] = useState<string | null>(null);

  /**
   * Initialisation du lecteur mpegts.js
   * Se déclenche au montage du composant et lors du changement d'URL
   */
  useEffect(() => {
    // Import dynamique de mpegts.js uniquement côté client
    let isMounted = true;

    const initPlayer = async () => {
      try {
        console.log('🎬 Initialisation du lecteur mpegts.js...');

        // Importer mpegts.js dynamiquement
        const mpegtsModule = await import('mpegts.js');
        const mpegts = mpegtsModule.default;

        if (!isMounted) return;

        console.log('✅ Module mpegts.js chargé');

        // Vérifier si mpegts.js est supporté par le navigateur
        const features = mpegts.getFeatureList();
        console.log('🔍 Fonctionnalités du navigateur:', features);

        if (!features.mseLivePlayback) {
          const errorMsg = 'Votre navigateur ne supporte pas la lecture de flux MPEG-TS';
          console.error('❌', errorMsg);
          setError(errorMsg);
          onError?.(errorMsg);
          return;
        }

        const videoElement = videoRef.current;
        if (!videoElement) {
          console.error('❌ Élément vidéo non trouvé');
          return;
        }

        console.log('📺 Élément vidéo trouvé');

        // Détruire le lecteur existant si présent
        if (playerRef.current) {
          console.log('🔄 Destruction du lecteur existant');
          playerRef.current.destroy();
        }

        console.log('🔧 Configuration du lecteur pour:', streamUrl);

        // Configuration du lecteur mpegts.js
        const player = mpegts.createPlayer(
          {
            type: 'mpegts', // Type de flux : MPEG-TS
            isLive: true, // Flux en direct
            url: streamUrl,
            hasAudio: true,
            hasVideo: true,
          },
          {
            enableWorker: false, // Web Worker désactivé pour plus de stabilité
            enableStashBuffer: true, // Activer le buffer pour une lecture plus fluide
            stashInitialSize: 128, // Taille initiale du buffer (KB)
            liveBufferLatencyChasing: true, // Réduire la latence en direct
            liveBufferLatencyMaxLatency: 3, // Latence maximale acceptable (secondes)
            liveBufferLatencyMinRemain: 0.5, // Buffer minimum à maintenir
            lazyLoad: false,
            deferLoadAfterSourceOpen: false,
            autoCleanupSourceBuffer: true,
            autoCleanupMaxBackwardDuration: 30,
            autoCleanupMinBackwardDuration: 15,
          }
        );

        console.log('📎 Attachement du lecteur à l\'élément vidéo');
        // Attacher le lecteur à l'élément vidéo
        player.attachMediaElement(videoElement);

        console.log('⏳ Chargement du flux...');
        // Charger le flux
        player.load();

        // Gestionnaire d'événements pour le chargement réussi
        player.on(mpegts.Events.METADATA_ARRIVED, () => {
          console.log('✅ Métadonnées reçues - Flux prêt');
          if (isMounted) {
            setIsLoading(false);
          }
        });

        // Gestionnaire d'événements pour les erreurs
        player.on(mpegts.Events.ERROR, (errorType, errorDetail) => {
          const errorMsg = `Erreur de lecture : ${errorType} - ${errorDetail}`;
          console.error('❌', errorMsg);
          if (isMounted) {
            setError(errorMsg);
            onError?.(errorMsg);
          }
        });

        // Stocker la référence du lecteur
        playerRef.current = player;
        console.log('💾 Lecteur stocké dans playerRef');

        // Notifier que le lecteur est prêt
        onPlayerReady?.(player);
        console.log('✅ Lecteur prêt - En attente d\'interaction utilisateur');

        // Lecture automatique si activée
        if (autoPlay) {
          console.log('▶️ Tentative de lecture automatique...');
          videoElement.play().catch((err) => {
            console.warn('⚠️ Autoplay bloqué par le navigateur:', err);
            console.log('👆 Cliquez sur le bouton play pour démarrer');
          });
        } else {
          console.log('⏸️ Autoplay désactivé - Cliquez sur le bouton play pour démarrer');
        }

      } catch (err) {
        const errorMsg = `Erreur d'initialisation : ${err}`;
        console.error(errorMsg);
        if (isMounted) {
          setError(errorMsg);
          onError?.(errorMsg);
        }
      }
    };

    initPlayer();

    // Nettoyage lors du démontage du composant
    return () => {
      isMounted = false;
      if (playerRef.current) {
        try {
          playerRef.current.unload();
          playerRef.current.detachMediaElement();
          playerRef.current.destroy();
          playerRef.current = null;
        } catch (error) {
          console.log('Erreur lors du nettoyage du lecteur:', error);
        }
      }
    };
  }, [streamUrl, autoPlay, onPlayerReady, onError]);

  /**
   * Gestionnaires d'événements vidéo natifs
   */
  const handlePlay = () => {
    console.log('🎵 Événement play de la vidéo');
    setIsLoading(false);
    onPlaying?.();
  };

  const handlePause = () => {
    console.log('⏸️ Événement pause de la vidéo');
    onPaused?.();
  };

  const handleLoadStart = () => {
    console.log('⏳ Événement loadstart de la vidéo');
    setIsLoading(true);
  };

  const handleCanPlay = () => {
    console.log('✅ Événement canplay de la vidéo');
    setIsLoading(false);
  };

  return (
    <div className={`relative w-full bg-black ${className}`}>
      {/* Élément vidéo HTML5 */}
      <video
        ref={videoRef}
        className="w-full h-full"
        muted={muted}
        playsInline
        controls={false}
        onPlay={handlePlay}
        onPause={handlePause}
        onLoadStart={handleLoadStart}
        onCanPlay={handleCanPlay}
      />

      {/* Indicateur de chargement */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-lg">Chargement du flux...</p>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90">
          <div className="text-center px-6">
            <div className="text-red-500 text-6xl mb-4">⚠</div>
            <h3 className="text-white text-xl font-bold mb-2">Erreur de lecture</h3>
            <p className="text-gray-300">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
