# Trivia Master IA 🧠✨

Bienvenue sur **Trivia Master IA**, le jeu de quiz nouvelle génération propulsé par l'intelligence artificielle Google Gemini.

## 🎮 Fonctionnalités

- **Modes de Jeu Variés** : Solo, Multijoueur (local), Battle vs IA, Duel, Tournoi, Vrai/Faux, Mort Subite...
- **Intelligence Artificielle** : Les questions sont générées à l'infini par Google Gemini 2.5 Flash.
- **Défis Viraux** : Créez un quiz sur n'importe quel sujet et envoyez un lien de défi à vos amis.
- **Design Adaptatif** : Interface fluide avec thèmes Clair ☀️, Sombre 🌙 et Gamer 🎮.

## 🚀 Déploiement (Mettre en ligne)

Le moyen le plus simple de mettre ce jeu en ligne est d'utiliser **Vercel**.

1.  Créez un compte sur [Vercel.com](https://vercel.com).
2.  Importez ce dépôt GitHub.
3.  **IMPORTANT** : Dans les paramètres du projet (Environment Variables), ajoutez votre clé API :
    *   **Name** : `API_KEY`
    *   **Value** : `Votre_Clé_Google_Gemini_Ici`
4.  Cliquez sur **Deploy**.

## 🛠️ Installation Locale

Pour tester le projet sur votre ordinateur :

1.  Clonez le dépôt.
2.  Installez les dépendances : `npm install`
3.  Créez un fichier `.env` à la racine et ajoutez : `API_KEY=votre_clé_ici`
4.  Lancez le serveur : `npm run dev`