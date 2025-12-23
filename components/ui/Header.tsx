'use client';

import { Tv, Menu, Search, User } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Composant Header
 *
 * Rôle : En-tête style Arte TV
 * - Fond blanc fixe avec bordure subtile
 * - Logo orange Arte
 * - Navigation horizontale épurée
 * - Design minimaliste et élégant
 *
 * Interactions :
 * - Scroll : Ajoute une ombre portée
 * - Hover sur liens : Soulignement orange
 *
 * Design : Style Arte épuré avec accents orange
 */

interface HeaderProps {
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
  onDirectClick?: () => void;
  onVideosClick?: () => void;
}

export default function Header({ onMenuClick, onSearch, onDirectClick, onVideosClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  /**
   * Détecter le scroll pour ajouter une ombre au header
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-arte-orange/10 backdrop-blur-md shadow-[0_2px_15px_rgba(255,121,0,0.3)]'
          : 'bg-arte-black'
      }`}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Section gauche : Logo + Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo MoiseTV */}
          <div className="flex items-center gap-3">
            <div className="bg-arte-orange px-3 py-1">
              <span className="text-white text-2xl font-bold tracking-wider">MoiseTV</span>
            </div>
          </div>

          {/* Navigation (cachée sur mobile) */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <button
              onClick={onDirectClick}
              className="text-white hover:text-arte-orange transition-colors font-medium"
            >
              Direct
            </button>
            <button
              onClick={onVideosClick}
              className="text-white hover:text-arte-orange transition-colors font-medium"
            >
              Vidéos
            </button>
          </nav>
        </div>

        {/* Section droite : Recherche + Profil */}
        <div className="flex items-center gap-4">
          {/* Icône recherche */}
          <button
            className="text-white hover:text-arte-orange transition-colors p-2"
            aria-label="Rechercher"
          >
            <Search size={22} />
          </button>

          {/* Avatar utilisateur */}
          <button
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-white
              hover:border-arte-orange transition-all"
            aria-label="Profil"
          >
            <div className="w-full h-full bg-arte-orange flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
          </button>

          {/* Bouton menu mobile */}
          <button
            onClick={onMenuClick}
            className="md:hidden text-white hover:text-arte-orange transition-colors p-2"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
