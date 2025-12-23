import { Channel } from '@/types';

/**
 * Configuration des chaînes TV
 *
 * Rôle : Définit la liste des chaînes disponibles dans l'application
 * Vous pouvez ajouter, modifier ou supprimer des chaînes ici
 *
 * Format de chaque chaîne :
 * - id : Identifiant unique
 * - name : Nom de la chaîne
 * - url : URL du flux MPEG-TS
 * - logo : URL du logo (optionnel)
 * - category : Catégorie de la chaîne (optionnel)
 * - isFavorite : Marqué comme favori (optionnel)
 *
 * Exemple d'ajout d'une nouvelle chaîne :
 * ```ts
 * {
 *   id: '2',
 *   name: 'Ma Chaîne 2',
 *   url: 'http://example.com/stream2.ts',
 *   logo: '/logos/channel2.png',
 *   category: 'Sport',
 *   isFavorite: false,
 * }
 * ```
 */

export const channels: Channel[] = [
  {
    id: '1',
    name: 'Glory Christ TV',
    url: '/api/stream', // Utilise le proxy Next.js pour éviter les problèmes CORS
    category: 'Religieux',
    isFavorite: true,
  },
  // Vous pouvez ajouter d'autres chaînes ici
  // Pour ajouter une nouvelle chaîne, créez d'abord une nouvelle route API proxy
  // dans app/api/stream-[nom]/route.ts si elle a une URL différente
  // {
  //   id: '2',
  //   name: 'Exemple Chaîne 2',
  //   url: '/api/stream-2',
  //   category: 'Information',
  //   isFavorite: false,
  // },
];

/**
 * Obtenir une chaîne par son ID
 * @param id - Identifiant de la chaîne
 * @returns La chaîne correspondante ou undefined si non trouvée
 */
export function getChannelById(id: string): Channel | undefined {
  return channels.find((channel) => channel.id === id);
}

/**
 * Obtenir les chaînes favorites
 * @returns Liste des chaînes marquées comme favorites
 */
export function getFavoriteChannels(): Channel[] {
  return channels.filter((channel) => channel.isFavorite);
}

/**
 * Obtenir les chaînes par catégorie
 * @param category - Nom de la catégorie
 * @returns Liste des chaînes de la catégorie spécifiée
 */
export function getChannelsByCategory(category: string): Channel[] {
  return channels.filter((channel) => channel.category === category);
}

/**
 * Obtenir toutes les catégories disponibles
 * @returns Liste unique des catégories
 */
export function getCategories(): string[] {
  const categories = channels
    .map((channel) => channel.category || 'Autres')
    .filter((category, index, self) => self.indexOf(category) === index);
  return categories;
}
