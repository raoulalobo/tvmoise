/**
 * Parser RSS YouTube
 *
 * Rôle : Convertir le flux RSS YouTube en format YouTubeVideo
 * Extraction : titre, thumbnail, videoId, date, description
 */

import Parser from 'rss-parser';
import { YouTubeVideo } from '@/types';

/**
 * Interface pour les items du RSS feed YouTube
 * YouTube utilise des extensions média dans le RSS
 */
interface YouTubeRSSItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  'media:group'?: {
    'media:title'?: { $?: { text?: string } };
    'media:content'?: { $?: { url?: string } }[];
    'media:thumbnail'?: { $?: { url?: string } }[];
    'media:description'?: { $?: { text?: string } };
  };
  'yt:videoId'?: string;
}

/**
 * Parse le RSS feed YouTube et convertit en tableau de YouTubeVideo
 *
 * @param rssUrl - URL du RSS feed YouTube
 * @returns Promise<YouTubeVideo[]> - Tableau de vidéos formatées
 *
 * Exemple d'utilisation :
 * ```typescript
 * const videos = await parseYouTubeRSS('https://www.youtube.com/feeds/videos.xml?channel_id=UCxxx');
 * ```
 */
export async function parseYouTubeRSS(rssUrl: string): Promise<YouTubeVideo[]> {
  const parser = new Parser({
    customFields: {
      item: [
        ['yt:videoId', 'videoId'],
        ['media:group', 'media'],
      ],
    },
  });

  try {
    console.log('📡 Récupération du RSS feed:', rssUrl);
    const feed = await parser.parseURL(rssUrl);

    console.log(`✅ RSS feed récupéré: ${feed.items.length} vidéos`);

    const videos: YouTubeVideo[] = feed.items.map((item: any) => {
      const videoId = extractVideoId(item);
      const thumbnails = extractThumbnails(videoId, item);

      return {
        id: videoId,
        videoId: videoId,
        title: item.title || 'Sans titre',
        description: extractDescription(item),
        thumbnail: thumbnails,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        url: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });

    return videos;
  } catch (error) {
    console.error('❌ Erreur lors du parsing du RSS:', error);
    throw new Error(`Échec du parsing RSS: ${error}`);
  }
}

/**
 * Extrait le videoId depuis l'item RSS
 * Essaie plusieurs sources possibles
 */
function extractVideoId(item: any): string {
  // Méthode 1 : yt:videoId (le plus fiable)
  if (item.videoId) {
    return item.videoId;
  }

  // Méthode 2 : Depuis le lien
  if (item.link) {
    const match = item.link.match(/watch\?v=([^&]+)/);
    if (match) {
      return match[1];
    }
  }

  // Méthode 3 : Depuis le GUID
  if (item.guid) {
    const match = item.guid.match(/video:([^:]+)/);
    if (match) {
      return match[1];
    }
  }

  // Fallback : génération d'un ID temporaire
  console.warn('⚠️ videoId non trouvé pour:', item.title);
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extrait les URLs des thumbnails
 * YouTube fournit plusieurs résolutions
 */
function extractThumbnails(videoId: string, item: any): {
  default: string;
  medium: string;
  high: string;
} {
  // Méthode 1 : Depuis media:group (si disponible)
  if (item.media && item.media['media:thumbnail']) {
    const thumbnails = item.media['media:thumbnail'];
    if (Array.isArray(thumbnails) && thumbnails.length > 0) {
      const thumbUrl = thumbnails[0].$ ? thumbnails[0].$.url : thumbnails[0];
      if (typeof thumbUrl === 'string') {
        return generateThumbnailUrls(videoId, thumbUrl);
      }
    }
  }

  // Méthode 2 : URLs directes YouTube (fallback)
  return {
    default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,      // 120x90
    medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,     // 320x180
    high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,       // 480x360
  };
}

/**
 * Génère les URLs de thumbnails à différentes résolutions
 */
function generateThumbnailUrls(videoId: string, baseUrl?: string): {
  default: string;
  medium: string;
  high: string;
} {
  // Si une URL de base est fournie, l'utiliser comme référence
  if (baseUrl) {
    return {
      default: baseUrl.replace(/\/[^\/]+\.jpg$/, '/default.jpg'),
      medium: baseUrl.replace(/\/[^\/]+\.jpg$/, '/mqdefault.jpg'),
      high: baseUrl.replace(/\/[^\/]+\.jpg$/, '/hqdefault.jpg'),
    };
  }

  // Fallback sur les URLs standards YouTube
  return {
    default: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
    medium: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
    high: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
}

/**
 * Extrait la description de la vidéo
 */
function extractDescription(item: any): string {
  // Méthode 1 : media:description
  if (item.media && item.media['media:description']) {
    const desc = item.media['media:description'];
    if (desc.$ && desc.$.text) {
      return desc.$.text;
    }
    if (typeof desc === 'string') {
      return desc;
    }
  }

  // Méthode 2 : contentSnippet
  if (item.contentSnippet) {
    return item.contentSnippet;
  }

  // Méthode 3 : content
  if (item.content) {
    // Nettoyer le HTML si présent
    return item.content.replace(/<[^>]*>/g, '').trim();
  }

  return '';
}

/**
 * Récupère le Channel ID depuis un handle YouTube
 * Utilise la route API dédiée
 */
export async function getChannelId(handle: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/youtube/channel-id?handle=${encodeURIComponent(handle)}`);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.channelId || null;
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du Channel ID:', error);
    return null;
  }
}
