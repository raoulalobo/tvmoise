# 🔑 Configuration de YouTube Data API v3

## Pourquoi ?
- **15 → 50 vidéos** : L'API permet de récupérer jusqu'à 50 vidéos au lieu de 15 avec le RSS
- **Plus de données** : durée, statistiques, tags, etc.
- **Gratuit** : 10 000 requêtes/jour (largement suffisant)

## Guide Rapide (5 minutes)

### 1. Créer un projet Google Cloud

1. Aller sur : https://console.cloud.google.com/
2. Se connecter avec un compte Google
3. Cliquer sur **"Sélectionner un projet"** → **"Nouveau projet"**
4. Nom du projet : `WebTV YouTube` (ou ce que vous voulez)
5. Cliquer sur **"Créer"**

### 2. Activer YouTube Data API v3

1. Dans le menu, aller sur **"APIs et services"** → **"Bibliothèque"**
2. Rechercher : `YouTube Data API v3`
3. Cliquer sur **"YouTube Data API v3"**
4. Cliquer sur **"Activer"**

### 3. Créer une clé API

1. Aller sur **"APIs et services"** → **"Identifiants"**
2. Cliquer sur **"Créer des identifiants"** → **"Clé API"**
3. Copier la clé générée (format : `AIzaSy...`)
4. **Optionnel mais recommandé** : Restreindre la clé
   - Cliquer sur la clé créée
   - Restrictions d'API → Sélectionner **"YouTube Data API v3"**
   - Sauvegarder

### 4. Configurer dans l'application

1. Ouvrir le fichier `.env.local` à la racine du projet
2. Remplacer `YOUR_API_KEY_HERE` par votre clé :

```env
YOUTUBE_API_KEY=AIzaSy...votre_vraie_clé...
```

3. Sauvegarder le fichier
4. Redémarrer le serveur Next.js :

```bash
npm run dev
```

### 5. Vérifier que ça fonctionne

Ouvrir : http://localhost:3001/api/youtube/feed

Si tout fonctionne, vous devriez voir :
```json
{
  "success": true,
  "videos": [...],
  "count": 50,
  "source": "api",
  "info": "YouTube Data API v3 (50 vidéos max)"
}
```

Si la clé n'est pas configurée, l'app utilisera le RSS (15 vidéos) en fallback :
```json
{
  "success": true,
  "videos": [...],
  "count": 15,
  "source": "rss",
  "info": "RSS Feed fallback (15 vidéos max)"
}
```

## Quota et Limites

- **Quota quotidien** : 10 000 unités/jour (gratuit)
- **Coût par requête** : 1 unité pour `playlistItems.list`
- **Avec cache de 10 min** : ~144 requêtes/jour = 144 unités/jour
- **Marge** : 69x la limite avant d'atteindre le quota

Largement suffisant pour une application personnelle !

## Sécurité

⚠️ **Important** : Ne jamais partager votre clé API publiquement
- Le fichier `.env.local` est dans `.gitignore` (pas versionné)
- Ne pas commit la clé dans le code source
- Si la clé est compromise, la révoquer dans Google Cloud Console

## Résolution de Problèmes

### Erreur : "API key not valid"
- Vérifier que la clé est bien copiée dans `.env.local`
- Vérifier que l'API YouTube Data v3 est activée
- Redémarrer le serveur après modification du `.env.local`

### Erreur : "The request cannot be completed because you have exceeded your quota"
- Augmenter le quota dans Google Cloud Console (gratuit jusqu'à 10k)
- Ou augmenter le temps de cache (actuellement 10 min)

### Fallback sur RSS (15 vidéos)
- Normal si la clé n'est pas configurée
- L'application continue de fonctionner avec le RSS

## Ressources

- [Documentation YouTube Data API v3](https://developers.google.com/youtube/v3/docs)
- [Quota Calculator](https://developers.google.com/youtube/v3/determine_quota_cost)
- [Google Cloud Console](https://console.cloud.google.com/)
