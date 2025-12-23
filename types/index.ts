/**
 * Types pour l'application WebTV
 * Définit les interfaces et types utilisés dans toute l'application
 */

/**
 * État du lecteur vidéo
 * @property isPlaying - Indique si la vidéo est en cours de lecture
 * @property isMuted - Indique si le son est coupé
 * @property volume - Niveau du volume (0-1)
 * @property isFullscreen - Indique si le mode plein écran est activé
 * @property quality - Qualité de la vidéo (auto, high, medium, low)
 */
export interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  quality: 'auto' | 'high' | 'medium' | 'low';
}

/**
 * Configuration du flux vidéo
 * @property url - URL du flux MPEG-TS
 * @property title - Titre de la chaîne/émission
 * @property description - Description de la chaîne/émission
 */
export interface StreamConfig {
  url: string;
  title: string;
  description?: string;
}

/**
 * Chaîne TV
 * @property id - Identifiant unique de la chaîne
 * @property name - Nom de la chaîne
 * @property url - URL du flux MPEG-TS
 * @property logo - URL du logo de la chaîne
 * @property category - Catégorie de la chaîne
 * @property isFavorite - Indique si la chaîne est en favoris
 */
export interface Channel {
  id: string;
  name: string;
  url: string;
  logo?: string;
  category?: string;
  isFavorite?: boolean;
}

/**
 * Programme TV
 * @property id - Identifiant unique du programme
 * @property title - Titre du programme
 * @property description - Description du programme
 * @property startTime - Heure de début
 * @property endTime - Heure de fin
 * @property channelId - Identifiant de la chaîne associée
 */
export interface Program {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  channelId: string;
}

/**
 * Vidéo YouTube
 * @property id - Identifiant unique de la vidéo
 * @property videoId - ID YouTube pour le lecteur iframe
 * @property title - Titre de la vidéo
 * @property description - Description de la vidéo
 * @property thumbnail - URLs des thumbnails (différentes résolutions)
 * @property publishedAt - Date de publication
 * @property url - URL complète de la vidéo YouTube
 * @property duration - Durée de la vidéo (format ISO 8601)
 * @property category - Catégorie manuelle assignée
 * @property tags - Tags manuels pour filtrage
 * @property viewCount - Nombre de vues (si disponible)
 */
export interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnail: {
    default: string;   // 120x90
    medium: string;    // 320x180
    high: string;      // 480x360
  };
  publishedAt: Date;
  url: string;
  duration?: string;
  category?: string;
  tags?: string[];
  viewCount?: number;
}

/**
 * Catégorie de vidéos
 * @property id - Identifiant unique de la catégorie
 * @property name - Nom affiché de la catégorie
 * @property icon - Nom de l'icône (lucide-react)
 * @property color - Couleur Tailwind (ex: 'blue', 'red')
 * @property videoIds - Liste des IDs des vidéos dans cette catégorie
 */
export interface VideoCategory {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  videoIds: string[];
}

/**
 * Mode d'affichage de l'application
 * - direct: Flux TV en direct
 * - videos: Galerie de vidéos YouTube
 */
export type ViewMode = 'direct' | 'videos';

/**
 * Layout d'affichage des vidéos
 * - grid: Grille de vignettes
 * - list: Liste détaillée
 */
export type VideoLayout = 'grid' | 'list';
