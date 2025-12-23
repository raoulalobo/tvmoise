/**
 * YouTube Data API v3 Client
 *
 * Rôle : Récupérer les vidéos d'une chaîne YouTube via l'API officielle
 * Avantages vs RSS :
 * - Jusqu'à 50 vidéos au lieu de 15
 * - Plus de métadonnées (durée, statistiques, tags)
 * - Données plus fiables et à jour
 *
 * Documentation : https://developers.google.com/youtube/v3/docs
 * Quota : 10 000 unités/jour (largement suffisant)
 */

import { YouTubeVideo } from '@/types';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Interface pour la réponse de l'API YouTube
 */
interface YouTubeAPIResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        default: { url: string };
        medium: { url: string };
        high: { url: string };
      };
      channelId: string;
      channelTitle: string;
    };
    contentDetails: {
      videoId: string;
      duration?: string;
    };
    statistics?: {
      viewCount: string;
      likeCount: string;
      commentCount: string;
    };
  }[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

/**
 * Récupérer les vidéos d'une chaîne YouTube via l'API v3
 *
 * @param channelId - ID de la chaîne YouTube
 * @param maxResults - Nombre max de vidéos (défaut: 50, max: 50)
 * @param apiKey - Clé API YouTube Data v3
 * @returns Promise<YouTubeVideo[]> - Tableau de vidéos formatées
 *
 * Coût quota : 1 unité pour playlistItems.list
 */
export async function fetchYouTubeVideos(
  channelId: string,
  maxResults: number = 50,
  apiKey?: string
): Promise<YouTubeVideo[]> {
  // Vérifier la clé API
  const key = apiKey || process.env.YOUTUBE_API_KEY;

  if (!key || key === 'YOUR_API_KEY_HERE') {
    console.warn('⚠️ Clé API YouTube non configurée, utilisation du RSS (15 vidéos max)');
    throw new Error('Clé API YouTube manquante. Configurez YOUTUBE_API_KEY dans .env.local');
  }

  try {
    console.log('📡 Récupération des vidéos via YouTube Data API v3...');

    // Étape 1 : Récupérer le Uploads Playlist ID
    // Format : "UU" + reste du channel ID (remplacer "UC" par "UU")
    const uploadsPlaylistId = channelId.replace('UC', 'UU');

    console.log('📋 Uploads Playlist ID:', uploadsPlaylistId);

    // Étape 2 : Récupérer les vidéos de la playlist "uploads"
    const url = new URL(`${YOUTUBE_API_BASE}/playlistItems`);
    url.searchParams.set('part', 'snippet,contentDetails');
    url.searchParams.set('playlistId', uploadsPlaylistId);
    url.searchParams.set('maxResults', String(Math.min(maxResults, 50)));
    url.searchParams.set('key', key);

    const response = await fetch(url.toString());

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        `Erreur API YouTube (${response.status}): ${
          error.error?.message || response.statusText
        }`
      );
    }

    const data: YouTubeAPIResponse = await response.json();

    console.log(`✅ ${data.items.length} vidéos récupérées via API`);

    // Étape 3 : Transformer les données en format YouTubeVideo
    const videos: YouTubeVideo[] = data.items.map((item) => {
      const videoId = item.contentDetails.videoId || item.id;

      return {
        id: videoId,
        videoId: videoId,
        title: item.snippet.title,
        description: item.snippet.description || '',
        thumbnail: {
          default: item.snippet.thumbnails.default?.url || '',
          medium: item.snippet.thumbnails.medium?.url || '',
          high: item.snippet.thumbnails.high?.url || '',
        },
        publishedAt: new Date(item.snippet.publishedAt),
        url: `https://www.youtube.com/watch?v=${videoId}`,
        duration: item.contentDetails.duration,
        viewCount: item.statistics
          ? parseInt(item.statistics.viewCount, 10)
          : undefined,
      };
    });

    return videos;
  } catch (error) {
    console.error('❌ Erreur YouTube Data API:', error);
    throw error;
  }
}

/**
 * Récupérer les statistiques détaillées de vidéos
 * Utile pour obtenir : durée exacte, vues, likes, commentaires
 *
 * @param videoIds - Liste des IDs de vidéos (max 50)
 * @param apiKey - Clé API YouTube Data v3
 * @returns Promise avec statistiques détaillées
 *
 * Coût quota : 1 unité pour videos.list
 */
export async function fetchVideoStatistics(
  videoIds: string[],
  apiKey?: string
): Promise<{
  [videoId: string]: {
    duration: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
}> {
  const key = apiKey || process.env.YOUTUBE_API_KEY;

  if (!key || key === 'YOUR_API_KEY_HERE') {
    throw new Error('Clé API YouTube manquante');
  }

  try {
    // Limiter à 50 vidéos par requête (limite API)
    const ids = videoIds.slice(0, 50).join(',');

    const url = new URL(`${YOUTUBE_API_BASE}/videos`);
    url.searchParams.set('part', 'contentDetails,statistics');
    url.searchParams.set('id', ids);
    url.searchParams.set('key', key);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Erreur API YouTube: ${response.status}`);
    }

    const data = await response.json();

    // Transformer en objet indexé par videoId
    const stats: any = {};
    data.items.forEach((item: any) => {
      stats[item.id] = {
        duration: item.contentDetails.duration,
        viewCount: parseInt(item.statistics.viewCount, 10),
        likeCount: parseInt(item.statistics.likeCount, 10),
        commentCount: parseInt(item.statistics.commentCount, 10),
      };
    });

    return stats;
  } catch (error) {
    console.error('❌ Erreur récupération statistiques:', error);
    throw error;
  }
}

/**
 * Formater la durée ISO 8601 en format lisible
 * Exemple : "PT15M33S" → "15:33"
 *
 * @param duration - Durée au format ISO 8601 (PT#H#M#S)
 * @returns Durée formatée "HH:MM:SS" ou "MM:SS"
 */
export function formatDuration(duration: string): string {
  if (!duration) return '';

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return '';

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
