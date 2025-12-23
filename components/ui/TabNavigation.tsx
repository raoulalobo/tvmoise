'use client';

import { ViewMode } from '@/types';
import { Radio, Video } from 'lucide-react';

/**
 * Composant TabNavigation
 *
 * Rôle : Navigation à onglets pour basculer entre Direct et Vidéos
 * - 2 onglets : "EN DIRECT" (flux MPEG-TS) et "VIDÉOS" (galerie YouTube)
 * - Indicateur animé sous l'onglet actif
 * - Icons lucide-react
 * - Responsive (texte réduit sur mobile)
 *
 * Interactions :
 * - onClick onglet : change le mode d'affichage
 * - Onglet actif : bordure bleue animée
 *
 * Design : Style TF1 avec accents bleus et animations fluides
 */

interface TabNavigationProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

export default function TabNavigation({
  currentMode,
  onModeChange,
  className = '',
}: TabNavigationProps) {
  /**
   * Configuration des onglets
   */
  const tabs: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    {
      mode: 'direct',
      label: 'EN DIRECT',
      icon: <Radio className="w-5 h-5" />,
    },
    {
      mode: 'videos',
      label: 'VIDÉOS',
      icon: <Video className="w-5 h-5" />,
    },
  ];

  return (
    <div className={`${className}`}>
      {/* Conteneur des onglets */}
      <div className="flex items-center gap-4">
        {tabs.map((tab) => {
          const isActive = currentMode === tab.mode;

          return (
            <button
              key={tab.mode}
              onClick={() => onModeChange(tab.mode)}
              className={`
                relative flex items-center gap-2 px-6 py-3
                font-bold text-sm uppercase tracking-wide transition-all duration-200
                ${
                  isActive
                    ? 'text-tf1-red'
                    : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {/* Icône */}
              <span className="transition-transform duration-200">
                {tab.icon}
              </span>

              {/* Label */}
              <span className="hidden sm:inline">{tab.label}</span>

              {/* Bordure rouge en bas pour l'onglet actif */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-tf1-red rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
