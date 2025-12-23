'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Composant YouTubePlayer
 *
 * Rôle : Lecteur vidéo YouTube intégré avec l'API iframe
 * - Charge l'API YouTube de manière asynchrone
 * - Gère l'état du lecteur (chargement, prêt, lecture)
 * - Responsive avec ratio 16:9
 * - Controls YouTube natifs
 *
 * Interactions :
 * - Lecture automatique au chargement
 * - Controls YouTube (play, pause, volume, plein écran)
 *
 * API YouTube Iframe : https://developers.google.com/youtube/iframe_api_reference
 */

interface YouTubePlayerProps {
  videoId: string;
  autoplay?: boolean;
  className?: string;
  onReady?: () => void;
  onStateChange?: (state: number) => void;
}

// Déclaration du type global YT (YouTube API)
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubePlayer({
  videoId,
  autoplay = true,
  className = '',
  onReady,
  onStateChange,
}: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    /**
     * Charger l'API YouTube de manière asynchrone
     * Script global : https://www.youtube.com/iframe_api
     */
    const loadYouTubeAPI = () => {
      // Si l'API est déjà chargée, créer directement le lecteur
      if (window.YT && window.YT.Player) {
        createPlayer();
        return;
      }

      // Si le script est déjà en cours de chargement, attendre
      if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        window.onYouTubeIframeAPIReady = createPlayer;
        return;
      }

      // Charger le script de l'API YouTube
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      // Callback appelé quand l'API est prête
      window.onYouTubeIframeAPIReady = createPlayer;
    };

    /**
     * Créer l'instance du lecteur YouTube
     */
    const createPlayer = () => {
      if (!containerRef.current) return;

      // Détruire l'ancien lecteur si existant
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      // Créer un div pour le lecteur
      const playerDiv = document.createElement('div');
      containerRef.current.appendChild(playerDiv);

      // Initialiser le lecteur YouTube
      playerRef.current = new window.YT.Player(playerDiv, {
        videoId: videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          fs: 1,
          playsinline: 1,
        },
        events: {
          onReady: handlePlayerReady,
          onStateChange: handleStateChange,
        },
      });
    };

    /**
     * Callback quand le lecteur est prêt
     */
    const handlePlayerReady = () => {
      setIsLoading(false);
      setIsReady(true);
      if (onReady) onReady();
    };

    /**
     * Callback quand l'état du lecteur change
     * -1: non démarré, 0: terminé, 1: lecture, 2: pause, 3: buffering, 5: en file
     */
    const handleStateChange = (event: any) => {
      if (onStateChange) onStateChange(event.data);
    };

    loadYouTubeAPI();

    // Cleanup : détruire le lecteur
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.log('Erreur nettoyage YouTube player:', e);
        }
      }
    };
  }, [videoId, autoplay, onReady, onStateChange]);

  return (
    <div className={`relative bg-black ${className}`}>
      {/* Conteneur avec ratio 16:9 */}
      <div className="relative aspect-video w-full">
        {/* Loader pendant le chargement */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
              <p className="text-gray-400 text-sm">Chargement de la vidéo...</p>
            </div>
          </div>
        )}

        {/* Conteneur du lecteur YouTube */}
        <div
          ref={containerRef}
          className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        />
      </div>
    </div>
  );
}
