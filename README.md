# TD7 — Mini-projet Photobox

> **BUT Informatique S4 — Programmation Web en JavaScript/TypeScript**
> IUT Nancy Charlemagne — Université de Lorraine

---

## 👤 Membres du groupe

| Nom | Prénom |
|-----|--------|
| Vidiri | Luca |

---

## 📋 Description

Application web permettant de parcourir et d'afficher des photos issues de l'API **Phox** (PhotoBox), développée en **TypeScript** avec **ESBuild**.

L'API utilisée : `https://webetu.iutnc.univ-lorraine.fr/www/canals5/phox/api`

---

## ✅ Fonctionnalités réalisées

### Exercice 1 — Affichage d'une photo
- Récupération des données d'une photo via `fetch` (module `photoloader`)
- Affichage de la photo, du titre, de la description et des dimensions dans la page via un template **Handlebars** (module `ui`)
- Lecture de l'identifiant de photo depuis le hash de l'URL (`index.html#105`)
- Rechargement automatique au changement de hash

### Exercice 2 — Affichage de la catégorie et des commentaires
- Chargement de la catégorie de la photo via les liens de l'API (`links.categorie`)
- Chargement et affichage des commentaires associés à la photo (`links.comments`)
- Fonctions `displayCategorie()` et `displayCommentaires()` dans le module `ui`

### Exercice 3 — Galerie de photos
- Affichage d'une galerie de vignettes cliquables (module `gallery` + `gallery_ui`)
- Bouton **"galerie"** pour charger et afficher la liste de photos
- Désactivation automatique des boutons de navigation selon la pagination disponible

### Exercice 4 — Navigation dans les galeries
- Pagination complète : boutons **first**, **prev**, **next**, **last**
- Stockage de la page courante et navigation via les liens de pagination (`links.next`, `links.prev`, etc.)


---

## 🏗️ Architecture

```
TD7/
├── index.html          # Page principale
├── index.ts            # Module principal (orchestration)
├── css/
│   └── index.css       # Styles
└── lib/
    ├── config.ts       # Configuration (URL de l'API, constantes)
    ├── photoloader.ts  # Chargement des ressources via fetch
    ├── ui.ts           # Affichage d'une photo (Handlebars)
    ├── gallery.ts      # Chargement et pagination des galeries
    └── gallery_ui.ts   # Affichage des galeries (vignettes)
```

---

## 🚀 Lancer le projet

### Prérequis
- [Node.js](https://nodejs.org/) installé
- Connexion au réseau de l'IUT ou **VPN @etu** actif (pour accéder à l'API)

### Installation et démarrage

```bash
npm install
npm run dev
```

---

## 🛠️ Technologies utilisées

- **TypeScript** — typage statique
- **ESBuild** — compilation et bundling
- **Handlebars** — templates HTML
- **Fetch API** — requêtes asynchrones
- **Promesses / async-await** — gestion de l'asynchronisme
