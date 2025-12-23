/**
 * Route API proxy pour le flux MPEG-TS
 *
 * Rôle : Contourner les problèmes CORS en créant un proxy côté serveur
 * Le navigateur fait une requête à notre serveur Next.js qui lui fait une requête
 * au serveur de streaming et retourne le flux avec les bons headers CORS
 */

import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // URL du flux original
    const streamUrl = 'http://41.223.30.236/GLORYCHRIST/mpegts';

    console.log('🔄 Proxy: Récupération du flux depuis', streamUrl);

    // Faire la requête au serveur de streaming
    const response = await fetch(streamUrl, {
      headers: {
        // Copier les headers de la requête originale si nécessaire
        'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      console.error('❌ Erreur lors de la récupération du flux:', response.status);
      return new Response('Erreur lors de la récupération du flux', {
        status: response.status,
      });
    }

    console.log('✅ Flux récupéré, streaming vers le client...');

    // Créer une nouvelle réponse avec les headers CORS appropriés
    const headers = new Headers();

    // Headers CORS
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Range');
    headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Content-Type');

    // Copier les headers importants de la réponse originale
    const contentType = response.headers.get('content-type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    } else {
      headers.set('Content-Type', 'video/mp2t');
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    // Headers pour le streaming
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    // Retourner le flux avec les bons headers
    return new Response(response.body, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('❌ Erreur dans le proxy:', error);
    return new Response('Erreur serveur', { status: 500 });
  }
}

// Gérer les requêtes OPTIONS pour CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
    },
  });
}
