'use client';

import { useState, useEffect, useMemo } from 'react';
import { YouTubeVideo } from '@/types';
import VideoCard from '@/components/video/VideoCard';
import VideoModal from '@/components/video/VideoModal';
import { Search, Loader2, AlertCircle } from 'lucide-react';

/**
 * Composant VideoGrid
 *
 * Rôle : Afficher une grille responsive de vidéos YouTube
 * - Chargement des vidéos depuis l'API /api/youtube/feed
 * - Grille responsive (1→2→3→4 colonnes selon écran)
 * - Recherche en temps réel avec debounce
 * - Filtrage par catégorie
 * - Modal pour afficher une vidéo
 * - Loading skeletons et gestion d'erreurs
 *
 * Interactions :
 * - Charge les vidéos au montage
 * - Filtre par recherche (titre, description)
 * - Filtre par catégorie (si fournie)
 * - onClick VideoCard : ouvre le modal
 *
 * Performance :
 * - Debounce 500ms sur la recherche
 * - Cache client des vidéos
 */

interface VideoGridProps {
  searchQuery?: string;
  categoryFilter?: string;
  className?: string;
}

export default function VideoGrid({
  searchQuery = '',
  categoryFilter = '',
  className = '',
}: VideoGridProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Charger les vidéos depuis l'API
   */
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/youtube/feed');

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.videos) {
          setVideos(data.videos);
        } else {
          throw new Error(data.error || 'Erreur inconnue');
        }
      } catch (err) {
        console.error('❌ Erreur chargement vidéos:', err);
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  /**
   * Filtrer les vidéos par recherche et catégorie
   * useMemo pour éviter les recalculs inutiles
   */
  const filteredVideos = useMemo(() => {
    let result = [...videos];

    // Filtrage par recherche (titre, description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query)
      );
    }

    // Filtrage par catégorie
    if (categoryFilter && categoryFilter !== 'all') {
      result = result.filter((video) => video.category === categoryFilter);
    }

    return result;
  }, [videos, searchQuery, categoryFilter]);

  /**
   * Ouvrir le modal avec la vidéo sélectionnée
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
    // Attendre la fin de l'animation avant de réinitialiser
    setTimeout(() => setSelectedVideo(null), 300);
  };

  /**
   * Affichage du skeleton de chargement
   */
  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-card animate-pulse"
            >
              <div className="aspect-video bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /**
   * Affichage de l'erreur
   */
  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="text-center space-y-4 max-w-md bg-white rounded-xl p-8 shadow-card">
          <AlertCircle className="w-16 h-16 text-tf1-red mx-auto" />
          <h3 className="text-gray-900 text-xl font-bold">Erreur de chargement</h3>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-tf1-red hover:bg-tf1-red-dark text-white rounded-lg
              transition-colors duration-200 font-bold"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  /**
   * Aucune vidéo trouvée après filtrage
   */
  if (filteredVideos.length === 0) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <div className="text-center space-y-4 bg-white rounded-xl p-8 shadow-card">
          <Search className="w-16 h-16 text-gray-400 mx-auto" />
          <h3 className="text-gray-900 text-xl font-bold">Aucune vidéo trouvée</h3>
          <p className="text-gray-600">
            {searchQuery
              ? `Aucun résultat pour "${searchQuery}"`
              : 'Aucune vidéo disponible'}
          </p>
        </div>
      </div>
    );
  }

  /**
   * Affichage de la grille de vidéos
   */
  return (
    <>
      <div className={`${className}`}>
        {/* Compteur de résultats */}
        <div className="mb-6">
          <p className="text-gray-700 text-sm font-medium">
            {filteredVideos.length} vidéo{filteredVideos.length > 1 ? 's' : ''}
            {searchQuery && ` • Recherche : "${searchQuery}"`}
            {categoryFilter && categoryFilter !== 'all' && ` • Catégorie : ${categoryFilter}`}
          </p>
        </div>

        {/* Grille responsive de vidéos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} onClick={handleVideoClick} />
          ))}
        </div>
      </div>

      {/* Modal de lecture vidéo */}
      <VideoModal video={selectedVideo} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
