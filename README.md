# WebTV - Application de Streaming TV en Direct

Application Next.js moderne pour regarder des chaînes TV en streaming avec support MPEG-TS.

## 🎯 Fonctionnalités

- ✅ **Lecture de flux MPEG-TS** - Streaming vidéo en direct
- ✅ **Contrôles personnalisés** - Play, pause, volume, plein écran
- ✅ **Interface responsive** - Fonctionne sur desktop, tablette et mobile
- ✅ **Système de favoris** - Marquez vos chaînes préférées
- ✅ **Organisation par catégories** - Chaînes organisées par type
- ✅ **Mode plein écran** - Expérience immersive
- ✅ **Sauvegarde des préférences** - Volume et dernière chaîne regardée sauvegardés

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+ installé sur votre machine
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📝 Configuration des Chaînes

Pour ajouter vos propres chaînes TV, modifiez le fichier `lib/channels.ts` :

```typescript
export const channels: Channel[] = [
  {
    id: '1',
    name: 'Nom de la chaîne',
    url: 'http://url-du-flux.ts',
    category: 'Catégorie', // Optionnel
    logo: '/path/to/logo.png', // Optionnel
    isFavorite: false, // Optionnel
  },
  // Ajoutez d'autres chaînes ici...
];
```

### Format du flux

L'application supporte les flux au format **MPEG-TS** (`.ts`). Assurez-vous que vos URLs pointent vers des flux compatibles.

## 🏗️ Structure du Projet

```
tvmoise/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page principale
│   └── layout.tsx         # Layout global
├── components/            # Composants React
│   ├── video/            # Composants vidéo
│   │   ├── VideoPlayer.tsx      # Lecteur MPEG-TS
│   │   ├── VideoControls.tsx    # Contrôles de lecture
│   │   └── TVPlayer.tsx         # Composant combiné
│   └── ui/               # Composants UI
│       ├── Header.tsx            # En-tête
│       └── Sidebar.tsx           # Barre latérale
├── lib/                   # Utilitaires et configuration
│   ├── channels.ts       # Configuration des chaînes
│   └── localStorage.ts   # Gestion du stockage local
├── types/                 # Types TypeScript
│   └── index.ts          # Définitions des types
└── public/                # Fichiers statiques
```

## 🎨 Personnalisation

### Thème et Couleurs

L'application utilise Tailwind CSS. Pour personnaliser les couleurs, modifiez le fichier `tailwind.config.ts`.

### Ajouter un Logo

Placez vos logos de chaînes dans le dossier `public/logos/` et référencez-les dans `lib/channels.ts` :

```typescript
{
  id: '1',
  name: 'Ma Chaîne',
  url: 'http://...',
  logo: '/logos/ma-chaine.png',
}
```

## 🔧 Options Disponibles pour les Utilisateurs

L'application offre plusieurs options configurables :

1. **Contrôles de lecture**
   - Play/Pause
   - Réglage du volume
   - Mute/Unmute
   - Mode plein écran

2. **Qualité vidéo**
   - Auto (adaptatif)
   - Haute
   - Moyenne
   - Basse

3. **Favoris**
   - Marquer des chaînes comme favorites
   - Accès rapide aux chaînes favorites

4. **Recherche**
   - Rechercher des chaînes par nom
   - Filtrer par catégorie

## 📱 Compatibilité

- ✅ Chrome/Edge (recommandé)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile (iOS/Android)

**Note** : La lecture de flux MPEG-TS nécessite un navigateur supportant Media Source Extensions (MSE).

## 🛠️ Technologies Utilisées

- **Next.js 16** - Framework React
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **mpegts.js** - Lecteur MPEG-TS
- **Lucide React** - Icônes

## 🐛 Dépannage

### Le flux ne se charge pas

1. Vérifiez que l'URL du flux est correcte et accessible
2. Assurez-vous que le flux est au format MPEG-TS
3. Vérifiez la console du navigateur pour les erreurs
4. Vérifiez que votre navigateur supporte MSE (Media Source Extensions)

### Erreur "Failed to fetch dynamically imported module"

Si vous rencontrez cette erreur avec Next.js 16, essayez :

```bash
# Nettoyer le cache
rm -rf .next
npm run dev
```

### Les contrôles ne s'affichent pas

- Déplacez votre souris sur le lecteur
- Les contrôles se masquent automatiquement après 3 secondes d'inactivité pendant la lecture

## 📄 Licence

Ce projet est libre d'utilisation pour un usage personnel et commercial.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

Développé avec ❤️ en utilisant Next.js et React
