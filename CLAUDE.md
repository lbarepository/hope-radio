# CLAUDE.md — Global

> Mémoire racine du projet. Contient la vision d'ensemble, l'architecture et les décisions transverses.
> Chaque sous-projet dispose de son propre `CLAUDE.md` local pour les détails qui lui sont spécifiques.
> **Ne pas dupliquer ici ce qui est déjà dans `wordpress/CLAUDE.md` ou `frontend/CLAUDE.md`.**

---

## Contexte du projet

Site de radio en ligne avec application mobile. Le client administre tout le contenu dans WordPress via l'éditeur Gutenberg. Le site public et l'application mobile sont gérés par des technologies distinctes pour garantir la continuité du lecteur audio lors de la navigation.

---

## Structure du monorepo

```
/
├── CLAUDE.md                  ← ce fichier — vision globale
├── wordpress/
│   ├── CLAUDE.md              ← thème, CPT, blocs, plugins, design system
│   └── wp-content/
│       └── themes/
│           └── radio-theme/
└── frontend/
    ├── CLAUDE.md              ← Next.js, composants, GraphQL, player, store
    ├── app/
    ├── components/
    ├── graphql/
    └── store/
```

---

## Architecture

```
WordPress (administration — Gutenberg)
        |
    WPGraphQL
        |
   _____|______
   |           |
Faust.js    Expo / React Native
Next.js     Application mobile
(web)       iOS + Android
   |           |
Player      Player
persistant  persistant
(layout)    (état global)
```

**Principe headless** : WordPress est uniquement un back-office. Il n'affiche jamais de page aux visiteurs. Next.js gère le front web, Expo gère le mobile. Les deux consomment les données WordPress via WPGraphQL.

---

## Stack technique

| Couche | Technologie | Dépôt |
|---|---|---|
| CMS | WordPress + Gutenberg | `wordpress/` |
| API | WPGraphQL | `wordpress/` |
| Bridge | Faust.js | `wordpress/` + `frontend/` |
| Front web | Next.js (App Router) | `frontend/` |
| Mobile | Expo / React Native | `mobile/` (à venir) |
| State global | Zustand | `frontend/store/` |
| Styles (front) | Tailwind CSS | `frontend/` |
| Styles (admin) | theme.json + CSS blocs | `wordpress/` |

---

## Grandes sections du site

| Section | Type | Description |
|---|---|---|
| Actualités | Archive CPT `post` | Actualités de la radio |
| Émissions | Archive CPT `emission` | Filtrable par thème |
| Podcasts | Archive CPT `podcast` | Liste des podcasts |
| L'agenda | Archive CPT `agenda` | Items en slide, filtrable par thème |
| La grille | Page dédiée | Grille des émissions de la semaine, filtre par jour |
| La radio | Page Gutenberg libre | Histoire, animateurs, chiffres clés, zones de diffusion |

---

## Menus

| Menu | Slug | Contenu |
|---|---|---|
| Menu principal | `main-menu` | Navigation principale |
| Menu secondaire | `secondary-menu` | Contact, réseaux sociaux |

---

## Variables d'environnement

```bash
# frontend/.env.local
NEXT_PUBLIC_WORDPRESS_URL=https://admin.radio.fr
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://admin.radio.fr/graphql
FAUST_SECRET_KEY=xxx

# wordpress/wp-config.php
FAUST_SECRET_KEY=xxx
```

---

## Décisions techniques actées

| Date | Décision | Raison |
|---|---|---|
| Avril 2026 | Architecture headless retenue | Continuité player audio, performance, mobile |
| Avril 2026 | Faust.js choisi comme bridge | Support officiel WP Engine, rendu Gutenberg natif |
| Avril 2026 | Expo pour le mobile | Partage de code avec Next.js, une seule équipe |
| Avril 2026 | Zustand pour le state player | Léger, compatible web et React Native |

---

## Ressources

| Ressource | URL |
|---|---|
| Faust.js | https://faustjs.org/docs |
| WPGraphQL | https://www.wpgraphql.com/docs |
| Next.js App Router | https://nextjs.org/docs/app |
| Expo Audio | https://docs.expo.dev/versions/latest/sdk/audio |
| Zustand | https://zustand-demo.pmnd.rs |

## Typography
