'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Volume1,
} from 'lucide-react';

/**
 * Composant VideoControls
 *
 * Rôle : Barre de contrôle personnalisée pour le lecteur vidéo
 * Interactions :
 * - Contrôle la lecture/pause de la vidéo
 * - Gère le volume et le mute
 * - Active/désactive le mode plein écran
 * - Permet de changer la qualité du flux
 *
 * Exemple d'utilisation :
 * ```tsx
 * <VideoControls
 *   videoRef={videoRef}
 *   isPlaying={isPlaying}
 *   onPlayPause={() => togglePlay()}
 * />
 * ```
 */

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isPlaying: boolean;
  onPlayPause: () => void;
  className?: string;
}

export default function VideoControls({
  videoRef,
  containerRef,
  isPlaying,
  onPlayPause,
  className = '',
}: VideoControlsProps) {
  // États locaux pour les contrôles
  const [volume, setVolume] = useState(1); // Volume (0-1)
  const [isMuted, setIsMuted] = useState(false); // État muet
  const [isFullscreen, setIsFullscreen] = useState(false); // Mode plein écran
  const [showVolumeSlider, setShowVolumeSlider] = useState(false); // Affichage du slider de volume
  const [showSettings, setShowSettings] = useState(false); // Affichage des paramètres
  const [quality, setQuality] = useState<'auto' | 'high' | 'medium' | 'low'>('auto');

  // Référence pour le timeout de fermeture du slider de volume
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Gestion du volume
   * Synchronise le volume de l'élément vidéo avec l'état local
   */
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, videoRef]);

  /**
   * Détection du changement de mode plein écran
   * Écoute les événements fullscreenchange pour mettre à jour l'état
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
   * Basculer entre lecture et pause
   */
  const handlePlayPause = () => {
    onPlayPause();
  };

  /**
   * Changer le volume
   * @param newVolume - Nouveau niveau de volume (0-1)
   */
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  /**
   * Basculer entre muet et son activé
   */
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  /**
   * Afficher/masquer le slider de volume
   * Utilise un timeout pour masquer automatiquement après 2 secondes
   */
  const handleVolumeHover = (show: boolean) => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current);
    }

    if (show) {
      setShowVolumeSlider(true);
    } else {
      volumeTimeoutRef.current = setTimeout(() => {
        setShowVolumeSlider(false);
      }, 2000);
    }
  };

  /**
   * Basculer le mode plein écran
   * Utilise l'API Fullscreen du navigateur
   */
  const handleFullscreenToggle = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        // Entrer en plein écran
        await containerRef.current.requestFullscreen();
      } else {
        // Sortir du plein écran
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Erreur lors du basculement plein écran:', error);
    }
  };

  /**
   * Changer la qualité du flux
   * Note : Cette fonctionnalité nécessite plusieurs flux de différentes qualités
   * @param newQuality - Nouvelle qualité sélectionnée
   */
  const handleQualityChange = (newQuality: 'auto' | 'high' | 'medium' | 'low') => {
    setQuality(newQuality);
    setShowSettings(false);
    // TODO: Implémenter le changement de flux selon la qualité
    console.log('Qualité changée:', newQuality);
  };

  /**
   * Obtenir l'icône de volume appropriée selon le niveau
   */
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-t from-black/90 to-transparent ${className}`}>
      {/* Contrôles de gauche : Play/Pause et Volume */}
      <div className="flex items-center gap-4">
        {/* Bouton Play/Pause */}
        <button
          onClick={handlePlayPause}
          className="text-white hover:text-blue-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
          aria-label={isPlaying ? 'Pause' : 'Lecture'}
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>

        {/* Contrôle du volume */}
        <div
          className="relative flex items-center gap-2"
          onMouseEnter={() => handleVolumeHover(true)}
          onMouseLeave={() => handleVolumeHover(false)}
        >
          {/* Bouton Mute/Unmute */}
          <button
            onClick={handleMuteToggle}
            className="text-white hover:text-blue-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
            aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            <VolumeIcon size={24} />
          </button>

          {/* Slider de volume (apparaît au survol) */}
          <div
            className={`absolute left-12 top-1/2 -translate-y-1/2 transition-all duration-300 ${
              showVolumeSlider ? 'opacity-100 w-24' : 'opacity-0 w-0'
            }`}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Contrôles de droite : Paramètres et Plein écran */}
      <div className="flex items-center gap-2">
        {/* Bouton Paramètres/Qualité */}
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-white hover:text-blue-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
            aria-label="Paramètres"
          >
            <Settings size={24} />
          </button>

          {/* Menu des paramètres */}
          {showSettings && (
            <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-lg overflow-hidden min-w-[180px]">
              <div className="px-4 py-2 text-white text-sm font-semibold border-b border-gray-700">
                Qualité
              </div>
              {(['auto', 'high', 'medium', 'low'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => handleQualityChange(q)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    quality === q
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  {q === 'auto' ? 'Auto' : q === 'high' ? 'Haute' : q === 'medium' ? 'Moyenne' : 'Basse'}
                  {quality === q && ' ✓'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bouton Plein écran */}
        <button
          onClick={handleFullscreenToggle}
          className="text-white hover:text-blue-400 transition-colors duration-200 p-2 rounded-full hover:bg-white/10"
          aria-label={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
        >
          {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
        </button>
      </div>
    </div>
  );
}
