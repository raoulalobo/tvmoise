/**
 * Route API pour récupérer les vidéos YouTube
 *
 * Rôle : Point d'entrée principal pour obtenir les vidéos YouTube
 * Méthodes :
 * 1. YouTube Data API v3 (priorité) : jusqu'à 50 vidéos + statistiques
 * 2. RSS Feed (fallback) : 15 vidéos si API non disponible
 *
 * Configuration : YOUTUBE_API_KEY dans .env.local
 * Cache serveur : 10 minutes (600 secondes)
 *
 * Exemple : GET /api/youtube/feed
 * Retourne : { videos: YouTubeVideo[], count: number, source: 'api' | 'rss' }
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchYouTubeVideos, formatDuration } from '@/lib/youtube/api';
import { parseYouTubeRSS } from '@/lib/youtube/rss-parser';

// Cache serveur : 10 minutes (600 secondes)
export const revalidate = 600;

// Configuration depuis variables d'environnement
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCgbMr5u3tqXaUsRgjFJ7Ctw';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const DEFAULT_YOUTUBE_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || '@ChapelledelagloiredechristNet';

export async function GET(request: NextRequest) {
  try {
    console.log('📺 Récupération des vidéos YouTube...');

    let videos;
    let source: 'api' | 'rss' = 'api';
    let channelId = YOUTUBE_CHANNEL_ID;

    // Méthode 1 : Essayer d'abord YouTube Data API v3
    try {
      if (YOUTUBE_API_KEY && YOUTUBE_API_KEY !== 'YOUR_API_KEY_HERE') {
        console.log('🚀 Utilisation de YouTube Data API v3...');

        videos = await fetchYouTubeVideos(channelId, 50, YOUTUBE_API_KEY);

        // Formater les durées pour affichage
        videos = videos.map(video => ({
          ...video,
          duration: video.duration ? formatDuration(video.duration) : undefined,
        }));

        console.log(`✅ ${videos.length} vidéos récupérées via API`);
      } else {
        throw new Error('Clé API non configurée');
      }
    } catch (apiError) {
      // Méthode 2 : Fallback sur RSS si API échoue
      console.warn('⚠️ API non disponible, fallback sur RSS:', apiError);
      source = 'rss';

      // Récupérer le Channel ID si nécessaire
      if (!channelId) {
        const channelIdResponse = await fetch(
          `${request.nextUrl.origin}/api/youtube/channel-id?handle=${encodeURIComponent(DEFAULT_YOUTUBE_HANDLE)}`,
          { next: { revalidate: 3600 } }
        );

        if (channelIdResponse.ok) {
          const data = await channelIdResponse.json();
          channelId = data.channelId;
        }
      }

      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      console.log('📡 Fallback RSS:', rssUrl);

      videos = await parseYouTubeRSS(rssUrl);
      console.log(`✅ ${videos.length} vidéos récupérées via RSS`);
    }

    // Retourner les vidéos avec métadonnées
    return NextResponse.json(
      {
        success: true,
        videos: videos,
        count: videos.length,
        source: source,
        channelId: channelId,
        handle: DEFAULT_YOUTUBE_HANDLE,
        cachedAt: new Date().toISOString(),
        cacheExpiry: '10 minutes',
        info: source === 'api'
          ? 'YouTube Data API v3 (50 vidéos max)'
          : 'RSS Feed fallback (15 vidéos max)',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300',
        },
      }
    );

  } catch (error) {
    console.error('❌ Erreur lors de la récupération des vidéos:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des vidéos YouTube',
        details: error instanceof Error ? error.message : String(error),
        videos: [],
        count: 0,
        source: 'error',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS handler pour CORS
 * Permet les requêtes cross-origin si nécessaire
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
