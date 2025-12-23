'use client';

import { YouTubeVideo } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import StreamingCard from './StreamingCard';

/**
 * Composant VideoCarousel
 *
 * Rôle : Carrousel horizontal de vidéos style Netflix/Prime/Disney+
 * - Rangée scrollable horizontalement
 * - Boutons de navigation gauche/droite
 * - Cards avec zoom au hover
 * - Titre de section
 *
 * Design : Style streaming avec scroll fluide
 */

interface VideoCarouselProps {
  title: string;
  videos: YouTubeVideo[];
  onVideoClick: (video: YouTubeVideo) => void;
  className?: string;
}

export default function VideoCarousel({
  title,
  videos,
  onVideoClick,
  className = '',
}: VideoCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  /**
   * Scroll vers la gauche
   */
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.offsetWidth * 0.8,
        behavior: 'smooth',
      });
    }
  };

  /**
   * Scroll vers la droite
   */
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.offsetWidth * 0.8,
        behavior: 'smooth',
      });
    }
  };

  /**
   * Mettre à jour la visibilité des flèches selon la position du scroll
   */
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Titre de la section */}
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4 px-6">
        {title}
      </h2>

      {/* Conteneur avec flèches */}
      <div className="relative">
        {/* Flèche gauche */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-r from-netflix-black to-transparent
              flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Défiler vers la gauche"
          >
            <div className="bg-black/80 rounded-full p-2 hover:bg-black transition-colors">
              <ChevronLeft className="w-8 h-8 text-white" />
            </div>
          </button>
        )}

        {/* Flèche droite */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-l from-netflix-black to-transparent
              flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Défiler vers la droite"
          >
            <div className="bg-black/80 rounded-full p-2 hover:bg-black transition-colors">
              <ChevronRight className="w-8 h-8 text-white" />
            </div>
          </button>
        )}

        {/* Conteneur scrollable */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-2 overflow-x-scroll scrollbar-hide scroll-smooth px-6 py-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {videos.map((video) => (
            <StreamingCard
              key={video.id}
              video={video}
              onClick={onVideoClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
