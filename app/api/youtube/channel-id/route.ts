/**
 * Route API pour extraire le Channel ID YouTube depuis un handle
 *
 * Rôle : Convertir @ChapelledelagloiredechristNet en Channel ID
 * Le RSS feed YouTube nécessite le Channel ID, pas le handle
 *
 * Exemple : GET /api/youtube/channel-id?handle=@ChapelledelagloiredechristNet
 * Retourne : { channelId: "UCxxxxxxxxxxxxxxxxx" }
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const handle = searchParams.get('handle') || '@ChapelledelagloiredechristNet';

  try {
    console.log('🔍 Extraction du Channel ID pour:', handle);

    // Requête vers la page YouTube du handle
    const url = `https://www.youtube.com/${handle}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const html = await response.text();

    // Extraction du Channel ID depuis le HTML
    // Plusieurs patterns possibles selon la version de YouTube
    const patterns = [
      /"channelId":"([^"]+)"/,
      /"externalId":"([^"]+)"/,
      /channel_id=([^&"]+)/,
      /"browseId":"(UC[^"]+)"/,
    ];

    let channelId: string | null = null;

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1] && match[1].startsWith('UC')) {
        channelId = match[1];
        break;
      }
    }

    if (!channelId) {
      console.error('❌ Channel ID non trouvé dans le HTML');
      return NextResponse.json(
        { error: 'Channel ID non trouvé' },
        { status: 404 }
      );
    }

    console.log('✅ Channel ID extrait:', channelId);

    return NextResponse.json({
      channelId,
      handle,
      url: `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction du Channel ID:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: String(error) },
      { status: 500 }
    );
  }
}
