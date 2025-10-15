# Virtual Library - Application de Gestion de Bibliothèque Personnelle

Une application web moderne et minimaliste pour gérer votre bibliothèque personnelle avec scan de codes-barres.

## 🚀 Fonctionnalités

- **Authentification sécurisée** avec JWT
- **Dashboard** avec statistiques de lecture
- **Bibliothèque personnelle** avec gestion des statuts (à lire, en cours, lu)
- **Scan de codes-barres** pour ajouter des livres facilement
- **Recherche de livres** via l'API Google Books
- **Gestion de profil** utilisateur
- **Design responsive** optimisé mobile et desktop

## 🛠️ Technologies

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Scan**: ZXing Library pour la lecture de codes-barres
- **API**: Intégration avec backend Django REST Framework
- **Authentification**: JWT avec refresh tokens
- **Icons**: Lucide React

## 📱 Navigation

L'application utilise une navigation fixe en bas avec 5 sections :

1. **Dashboard** (📊) - Statistiques de lecture
2. **Bibliothèque** (📚) - Collection personnelle
3. **Scan** (📷) - Ajout de livres par code-barres
4. **Social** (👥) - Fonctionnalités sociales (à venir)
5. **Paramètres** (⚙️) - Gestion du profil

## 🔧 Configuration

1. Copiez le fichier `.env.example` vers `.env`
2. Configurez l'URL de votre API Django :

```bash
REACT_APP_API_URL=https://votre-api.com
```

## 🎨 Design

Interface minimaliste avec :
- Palette de couleurs sobres (blanc, gris, accents colorés)
- Typographie claire avec maximum 2 tailles
- Icônes uniformes et intuitives
- Animations fluides et micro-interactions
- Cartes avec ombres légères et coins arrondis

## 📡 API

L'application communique avec un backend Django REST Framework via les endpoints :

- `/api/auth/` - Authentification
- `/api/books/` - Recherche de livres
- `/api/library/` - Gestion de la bibliothèque
- `/api/user/` - Gestion du profil utilisateur

## 🔒 Sécurité

- Tokens JWT avec expiration automatique
- Refresh tokens pour maintenir la session
- Headers d'autorisation sécurisés
- Gestion des erreurs d'authentification

## 📱 Responsive

Optimisé pour tous les appareils :
- Mobile : 2 colonnes pour les livres
- Tablet : 3 colonnes
- Desktop : 4+ colonnes
- Navigation adaptative selon la taille d'écran