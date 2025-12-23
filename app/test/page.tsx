'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Page de test simple pour le lecteur MPEG-TS
 * Sans toute la complexité des composants multiples
 */
export default function TestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState('Initialisation...');

  useEffect(() => {
    const initPlayer = async () => {
      try {
        console.log('🎬 Chargement de mpegts.js...');
        const mpegtsModule = await import('mpegts.js');
        const mpegts = mpegtsModule.default;

        if (!videoRef.current) {
          console.error('❌ Élément vidéo non trouvé');
          return;
        }

        console.log('✅ Module chargé, création du player...');
        setStatus('Création du lecteur...');

        const player = mpegts.createPlayer(
          {
            type: 'mpegts',
            isLive: true,
            url: 'http://localhost:3000/api/stream',
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
            lazyLoadMaxDuration: 3 * 60,
            lazyLoadRecoverDuration: 30,
            deferLoadAfterSourceOpen: false,
            autoCleanupSourceBuffer: true,
            autoCleanupMaxBackwardDuration: 30,
            autoCleanupMinBackwardDuration: 15,
          }
        );

        player.attachMediaElement(videoRef.current);
        player.load();

        player.on('metadata_arrived', () => {
          console.log('✅ Métadonnées reçues');
          setStatus('Prêt - Cliquez sur Play');
        });

        player.on('error', (type: any, detail: any) => {
          console.error('❌ Erreur:', type, detail);
          setStatus(`Erreur: ${type} - ${detail}`);
        });

        playerRef.current = player;
        setStatus('Chargement du flux...');

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
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    console.log('🎯 Clic Play/Pause - isPlaying:', isPlaying);

    if (isPlaying) {
      video.pause();
    } else {
      video.play()
        .then(() => console.log('✅ play() réussi'))
        .catch(err => console.error('❌ play() échoué:', err));
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-white text-3xl font-bold mb-4">Test Lecteur MPEG-TS</h1>

        <div className="bg-gray-900 p-4 rounded mb-4">
          <p className="text-white">Status: {status}</p>
        </div>

        <div className="relative bg-black aspect-video mb-4">
          <video
            ref={videoRef}
            className="w-full h-full"
            playsInline
            onPlay={() => {
              console.log('🎵 Événement play');
              setIsPlaying(true);
            }}
            onPause={() => {
              console.log('⏸️ Événement pause');
              setIsPlaying(false);
            }}
          />
        </div>

        <button
          onClick={handlePlayPause}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-8 rounded mb-2"
        >
          {isPlaying ? '⏸️ PAUSE' : '▶️ PLAY'}
        </button>

        <div className="bg-gray-800 p-4 rounded mb-4">
          <h2 className="text-white font-bold mb-2">Test avec proxy Next.js :</h2>
          <video
            src="/api/stream"
            controls
            className="w-full"
            playsInline
          />
          <p className="text-gray-400 text-sm mt-2">
            Le flux passe maintenant par un proxy Next.js pour éviter les problèmes CORS
          </p>
        </div>

        <a href="/" className="block mt-4 text-blue-400 hover:text-blue-300">
          ← Retour à l'application principale
        </a>
      </div>
    </div>
  );
}
