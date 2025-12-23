'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Composant SearchBar
 *
 * Rôle : Barre de recherche avec debounce pour filtrer les vidéos
 * - Input de recherche avec icône
 * - Debounce de 500ms pour limiter les re-renders
 * - Bouton clear pour vider la recherche
 * - Placeholder dynamique
 *
 * Interactions :
 * - onChange : mise à jour avec debounce
 * - onClick clear : vide la recherche
 * - Focus : bordure bleue animée
 *
 * Design : Style TF1 avec fond sombre et accents bleus
 */

interface SearchBarProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Rechercher une vidéo...',
  debounceMs = 500,
  className = '',
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  /**
   * Debounce : appeler onChange après un délai
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs]);

  /**
   * Synchroniser avec la prop value externe
   */
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  /**
   * Vider la recherche
   */
  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Icône de recherche */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-5 h-5 text-gray-500" />
      </div>

      {/* Input de recherche */}
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3 bg-white text-gray-900 rounded-lg
          border-2 border-gray-200 focus:border-tf1-red shadow-card
          transition-all duration-200 outline-none
          placeholder:text-gray-400"
      />

      {/* Bouton clear (visible uniquement si du texte est présent) */}
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2
            p-1 rounded-full hover:bg-gray-100 transition-colors duration-200
            group"
          aria-label="Effacer la recherche"
        >
          <X className="w-5 h-5 text-gray-400 group-hover:text-gray-700 transition-colors duration-200" />
        </button>
      )}
    </div>
  );
}
