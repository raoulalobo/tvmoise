/**
 * Utilitaires pour gérer le localStorage
 *
 * Rôle : Fournit des fonctions pour sauvegarder et récupérer des données
 * du localStorage de manière sécurisée et typée
 *
 * Fonctionnalités :
 * - Sauvegarde des favoris
 * - Sauvegarde des préférences utilisateur (volume, qualité, etc.)
 * - Gestion des erreurs localStorage
 */

/**
 * Clés utilisées dans le localStorage
 */
const STORAGE_KEYS = {
  FAVORITES: 'webtv_favorites',
  VOLUME: 'webtv_volume',
  QUALITY: 'webtv_quality',
  LAST_CHANNEL: 'webtv_last_channel',
} as const;

/**
 * Vérifier si localStorage est disponible
 * @returns true si localStorage est disponible, false sinon
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Obtenir une valeur du localStorage
 * @param key - Clé de la valeur à récupérer
 * @param defaultValue - Valeur par défaut si la clé n'existe pas
 * @returns La valeur récupérée ou la valeur par défaut
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Erreur lors de la lecture du localStorage:', error);
    return defaultValue;
  }
}

/**
 * Sauvegarder une valeur dans le localStorage
 * @param key - Clé de la valeur à sauvegarder
 * @param value - Valeur à sauvegarder
 */
export function saveToStorage<T>(key: string, value: T): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans le localStorage:', error);
  }
}

/**
 * Supprimer une valeur du localStorage
 * @param key - Clé de la valeur à supprimer
 */
export function removeFromStorage(key: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Erreur lors de la suppression du localStorage:', error);
  }
}

// Fonctions spécifiques pour les favoris

/**
 * Obtenir les IDs des chaînes favorites
 * @returns Tableau des IDs des chaînes favorites
 */
export function getFavoriteChannelIds(): string[] {
  return getFromStorage<string[]>(STORAGE_KEYS.FAVORITES, []);
}

/**
 * Sauvegarder les IDs des chaînes favorites
 * @param channelIds - Tableau des IDs des chaînes favorites
 */
export function saveFavoriteChannelIds(channelIds: string[]): void {
  saveToStorage(STORAGE_KEYS.FAVORITES, channelIds);
}

/**
 * Ajouter une chaîne aux favoris
 * @param channelId - ID de la chaîne à ajouter
 */
export function addToFavorites(channelId: string): void {
  const favorites = getFavoriteChannelIds();
  if (!favorites.includes(channelId)) {
    saveFavoriteChannelIds([...favorites, channelId]);
  }
}

/**
 * Retirer une chaîne des favoris
 * @param channelId - ID de la chaîne à retirer
 */
export function removeFromFavorites(channelId: string): void {
  const favorites = getFavoriteChannelIds();
  saveFavoriteChannelIds(favorites.filter((id) => id !== channelId));
}

/**
 * Vérifier si une chaîne est dans les favoris
 * @param channelId - ID de la chaîne à vérifier
 * @returns true si la chaîne est dans les favoris, false sinon
 */
export function isFavorite(channelId: string): boolean {
  return getFavoriteChannelIds().includes(channelId);
}

// Fonctions spécifiques pour les préférences

/**
 * Obtenir le volume sauvegardé
 * @returns Volume (0-1) ou 1 par défaut
 */
export function getSavedVolume(): number {
  return getFromStorage<number>(STORAGE_KEYS.VOLUME, 1);
}

/**
 * Sauvegarder le volume
 * @param volume - Volume (0-1)
 */
export function saveVolume(volume: number): void {
  saveToStorage(STORAGE_KEYS.VOLUME, volume);
}

/**
 * Obtenir la qualité sauvegardée
 * @returns Qualité ('auto', 'high', 'medium', 'low')
 */
export function getSavedQuality(): 'auto' | 'high' | 'medium' | 'low' {
  return getFromStorage<'auto' | 'high' | 'medium' | 'low'>(
    STORAGE_KEYS.QUALITY,
    'auto'
  );
}

/**
 * Sauvegarder la qualité
 * @param quality - Qualité ('auto', 'high', 'medium', 'low')
 */
export function saveQuality(quality: 'auto' | 'high' | 'medium' | 'low'): void {
  saveToStorage(STORAGE_KEYS.QUALITY, quality);
}

/**
 * Obtenir l'ID de la dernière chaîne regardée
 * @returns ID de la dernière chaîne ou null
 */
export function getLastChannelId(): string | null {
  return getFromStorage<string | null>(STORAGE_KEYS.LAST_CHANNEL, null);
}

/**
 * Sauvegarder l'ID de la dernière chaîne regardée
 * @param channelId - ID de la chaîne
 */
export function saveLastChannelId(channelId: string): void {
  saveToStorage(STORAGE_KEYS.LAST_CHANNEL, channelId);
}
