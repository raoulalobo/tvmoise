'use client';

import { Channel } from '@/types';
import { Heart, Radio, X } from 'lucide-react';

/**
 * Composant Sidebar
 *
 * Rôle : Barre latérale avec la liste des chaînes TV
 * Interactions :
 * - Affiche la liste des chaînes disponibles
 * - Permet de filtrer par catégorie
 * - Affiche les chaînes favorites
 * - Permet de sélectionner une chaîne pour la regarder
 *
 * Exemple d'utilisation :
 * ```tsx
 * <Sidebar
 *   channels={channels}
 *   currentChannel={currentChannel}
 *   onChannelSelect={(channel) => setCurrentChannel(channel)}
 *   isOpen={isSidebarOpen}
 *   onClose={() => setSidebarOpen(false)}
 * />
 * ```
 */

interface SidebarProps {
  channels: Channel[];
  currentChannel?: Channel;
  onChannelSelect: (channel: Channel) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  channels,
  currentChannel,
  onChannelSelect,
  isOpen = true,
  onClose,
}: SidebarProps) {
  /**
   * Filtrer les chaînes favorites
   */
  const favoriteChannels = channels.filter((ch) => ch.isFavorite);

  /**
   * Grouper les chaînes par catégorie
   */
  const channelsByCategory = channels.reduce((acc, channel) => {
    const category = channel.category || 'Autres';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(channel);
    return acc;
  }, {} as Record<string, Channel[]>);

  return (
    <>
      {/* Overlay pour mobile (clic pour fermer) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* En-tête de la sidebar */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <h2 className="text-white text-lg font-semibold flex items-center gap-2">
            <Radio size={20} className="text-blue-500" />
            Chaînes TV
          </h2>
          {/* Bouton fermer (mobile uniquement) */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenu scrollable */}
        <div className="overflow-y-auto h-[calc(100vh-73px)]">
          {/* Section Favoris */}
          {favoriteChannels.length > 0 && (
            <div className="px-4 py-3">
              <h3 className="text-gray-400 text-sm font-semibold mb-3 flex items-center gap-2">
                <Heart size={16} className="text-red-500" />
                Favoris
              </h3>
              <div className="space-y-1">
                {favoriteChannels.map((channel) => (
                  <ChannelItem
                    key={channel.id}
                    channel={channel}
                    isActive={currentChannel?.id === channel.id}
                    onClick={() => onChannelSelect(channel)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Séparateur */}
          {favoriteChannels.length > 0 && (
            <div className="border-t border-gray-800 my-2" />
          )}

          {/* Liste des chaînes par catégorie */}
          {Object.entries(channelsByCategory).map(([category, categoryChannels]) => (
            <div key={category} className="px-4 py-3">
              <h3 className="text-gray-400 text-sm font-semibold mb-3">
                {category}
              </h3>
              <div className="space-y-1">
                {categoryChannels.map((channel) => (
                  <ChannelItem
                    key={channel.id}
                    channel={channel}
                    isActive={currentChannel?.id === channel.id}
                    onClick={() => onChannelSelect(channel)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}

/**
 * Composant ChannelItem
 *
 * Rôle : Élément de la liste des chaînes
 * Affiche le logo, le nom et l'indicateur de lecture en cours
 */
interface ChannelItemProps {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}

function ChannelItem({ channel, isActive, onClick }: ChannelItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
      }`}
    >
      {/* Logo de la chaîne */}
      {channel.logo ? (
        <img
          src={channel.logo}
          alt={channel.name}
          className="w-10 h-10 rounded object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center">
          <Radio size={20} className="text-gray-400" />
        </div>
      )}

      {/* Nom de la chaîne */}
      <span className="font-medium truncate flex-1 text-left">
        {channel.name}
      </span>

      {/* Indicateur de chaîne favorite */}
      {channel.isFavorite && (
        <Heart size={16} className="text-red-500 fill-red-500 flex-shrink-0" />
      )}

      {/* Indicateur de lecture en cours */}
      {isActive && (
        <div className="w-2 h-2 bg-white rounded-full animate-pulse flex-shrink-0" />
      )}
    </button>
  );
}
