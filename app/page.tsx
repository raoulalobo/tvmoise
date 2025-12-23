'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import VideoModal from '@/components/video/VideoModal';
import DirectModal from '@/components/video/DirectModal';
import { YouTubeVideo } from '@/types';
import { Calendar, Radio, Film } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import Image from 'next/image';

/**
 * Page principale - Style Arte TV
 *
 * Rôle : Interface éditoriale moderne
 * - Header blanc fixe avec accents orange
 * - Grille classique de vidéos (4 colonnes desktop → 1 colonne mobile)
 * - Cards épurées avec bordures et ombres subtiles
 * - Modal pour lecture vidéo
 *
 * Design : Fond blanc épuré style Arte avec accents orange
 */
export default function Home() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);

  /**
   * Charger les vidéos depuis l'API
   */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/youtube/feed');
        const data = await response.json();

        if (data.success) {
          setVideos(data.videos);
        }
      } catch (error) {
        console.error('Erreur chargement vidéos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  /**
   * Ouvrir le modal avec la vidéo
   */
  const handleVideoClick = (video: YouTubeVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  /**
   * Fermer le modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  /**
   * Ouvrir le modal Direct
   */
  const handleDirectClick = () => {
    setIsDirectModalOpen(true);
  };

  /**
   * Fermer le modal Direct
   */
  const handleCloseDirectModal = () => {
    setIsDirectModalOpen(false);
  };

  /**
   * Scroller vers la section vidéos
   */
  const handleScrollToVideos = () => {
    const videosSection = document.getElementById('videos');
    if (videosSection) {
      videosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  /**
   * Formater la date de publication
   */
  const getRelativeDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: fr,
      });
    } catch {
      return 'Date inconnue';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-arte-black flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Chargement...</div>
      </div>
    );
  }

  // Vidéo hero (la plus récente)
  const heroVideo = videos[0];

  return (
    <div className="min-h-screen bg-arte-black">
      {/* Header noir fixe */}
      <Header onDirectClick={handleDirectClick} onVideosClick={handleScrollToVideos} />

      {/* Hero Banner - Image spirituelle */}
      <div className="relative w-full h-[85vh] overflow-hidden bg-arte-black">
        {/* Image de fond spirituelle - Unsplash */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1920&q=80"
            alt="MoiseTV - Diffusion spirituelle"
            fill
            priority
            className="object-cover"
            quality={100}
          />
          {/* Gradients renforcés pour meilleure visibilité */}
          <div className="absolute inset-0 bg-gradient-to-t from-arte-black via-arte-black/80 to-arte-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-arte-black/95 via-arte-black/60 to-transparent" />
          {/* Overlay sombre général */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Contenu du hero */}
        <div className="relative h-full flex items-end pb-20 px-6 lg:px-12">
          <div className="max-w-3xl space-y-6">
            {/* Fond semi-transparent derrière le contenu pour meilleure lisibilité */}
            <div className="bg-arte-black/60 backdrop-blur-sm p-6 -mx-6">
              {/* Badge */}
              <div className="inline-block px-3 py-1 bg-arte-orange border border-arte-orange
                text-white text-xs font-bold uppercase mb-4">
                En direct et à la demande
              </div>

              {/* Titre en orange doré */}
              <h1 className="text-4xl md:text-6xl font-bold text-arte-orange leading-tight mb-4
                drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                Bienvenue sur MoiseTV
              </h1>

              {/* Sous-titre */}
              <p className="text-white text-lg md:text-xl leading-relaxed mb-6
                drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Votre chaîne de diffusion spirituelle. Regardez nos cultes en direct et accédez à notre bibliothèque de vidéos d'enseignements.
              </p>

              {/* Boutons d'action */}
              <div className="flex flex-wrap gap-4 pt-6">
                <button
                  onClick={handleDirectClick}
                  className="px-8 py-4 bg-white hover:!bg-[#FF7900] text-black hover:!text-white
                    font-bold transition-all flex items-center justify-center gap-2 shadow-lg
                    hover:shadow-xl hover:scale-105"
                >
                  <Radio className="w-5 h-5" />
                  <span>Direct</span>
                </button>
                <button
                  onClick={handleScrollToVideos}
                  className="px-8 py-4 bg-black/80 border-2 border-white text-white
                    hover:bg-white hover:!text-black font-bold transition-all flex items-center justify-center gap-2 shadow-lg
                    hover:shadow-xl hover:scale-105"
                >
                  <Film className="w-5 h-5" />
                  <span>Vidéos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grille de vidéos */}
      <div id="videos" className="px-6 lg:px-12 py-12 space-y-8 scroll-mt-20">
        {/* Titre de section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Toutes les vidéos
          </h2>
          <p className="text-arte-gray-light">
            {videos.length} vidéo{videos.length > 1 ? 's' : ''} disponible{videos.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Grille responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.slice(1).map((video) => (
            <div
              key={video.id}
              onClick={() => handleVideoClick(video)}
              className="group cursor-pointer bg-arte-gray-darker overflow-hidden
                transition-all duration-300 hover:-translate-y-1
                shadow-[0_0_15px_rgba(255,121,0,0.4)]
                hover:shadow-[0_0_25px_rgba(59,130,246,0.7)]"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-arte-gray-dark">
                <Image
                  src={video.thumbnail.high}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />

                {/* Overlay orange au hover */}
                <div className="absolute inset-0 bg-arte-orange/0 group-hover:bg-arte-orange/20
                  transition-colors duration-300" />
              </div>

              {/* Informations */}
              <div className="p-4 space-y-2">
                {/* Titre */}
                <h3 className="text-white font-bold text-base line-clamp-2
                  group-hover:text-arte-orange transition-colors duration-300">
                  {video.title}
                </h3>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-arte-gray-light">
                  <Calendar className="w-4 h-4" />
                  <span>{getRelativeDate(video.publishedAt)}</span>
                </div>

                {/* Catégorie */}
                {video.category && (
                  <span className="inline-block px-2 py-1 bg-arte-gray-dark text-arte-gray-light
                    text-xs uppercase font-medium">
                    {video.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucune vidéo */}
        {videos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-arte-gray-light text-lg">
              Aucune vidéo disponible pour le moment
            </p>
          </div>
        )}
      </div>

      {/* Modal de lecture vidéo YouTube */}
      <VideoModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Modal Direct MPEG-TS */}
      <DirectModal
        isOpen={isDirectModalOpen}
        onClose={handleCloseDirectModal}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
