# CLAUDE.md — WordPress

> Mémoire du sous-projet WordPress. Couvre le thème headless, le design system, les CPT, les blocs Gutenberg et les plugins.
> Lire aussi le `CLAUDE.md` racine pour le contexte global et l'architecture.

---

## Rôle de WordPress dans ce projet

WordPress est **uniquement un back-office**. Il n'affiche jamais de pages aux visiteurs — c'est Next.js qui s'en charge. Le thème est donc minimaliste : son seul rôle est de cadrer l'éditeur Gutenberg et d'exposer les données via WPGraphQL.

---

## Structure du thème

```
hope-radio/
├── CLAUDE.md                        ← ce fichier
├── theme.json                       ← cadrage éditorial (source de vérité des styles admin)
├── style.css                        ← en-tête obligatoire WordPress (pas de styles ici)
├── functions.php                    ← loader uniquement (require_once des fichiers inc/)
├── index.php                        ← vide — le front est géré par Next.js
├── inc/
│   ├── theme-setup.php              ← after_setup_theme : theme supports + nav menus
│   ├── post-types.php               ← init : enregistrement des 4 CPT
│   ├── gutenberg.php                ← filtres éditeur : blocs autorisés, styles de blocs
│   └── acf-fields.php               ← acf_add_local_field_group pour chaque CPT
├── assets/
│   └── css/
│       └── blocks/                  ← styles placeholder admin, un fichier par bloc custom
│           ├── hero-section.css
│           ├── actualites.css
│           ├── a-decouvrir.css
│           ├── podcasts.css
│           ├── bannieres.css
│           ├── clips.css
│           ├── playlists.css
│           ├── autres-radios.css
│           ├── chiffres-cles.css
│           ├── zones-diffusion.css
│           └── equipe.css
├── block-patterns/                  ← patterns Gutenberg réutilisables
│   ├── emission.php
│   └── animateur.php
├── blocks/                          ← blocs Gutenberg custom
│   ├── hero-section/
│   │   ├── block.json               ← attributs natifs, pas d'ACF
│   │   ├── render.php               ← placeholder uniquement (pas de vrai rendu)
│   │   └── index.js                 ← interface de saisie dans l'éditeur
│   └── ...
└── modes/                           ← documentation de référence
    ├── theme-json.md                ← règles complètes de styles — LIRE EN PREMIER
    └── blocs/
        ├── hero-section.md
        └── styles/
            └── hero-section.md
```

> **Avant tout travail de style**, consulter [`modes/theme-json.md`](modes/theme-json.md).
> Le `theme.json` est la source de vérité pour l'éditeur. Les styles spécifiques à chaque bloc (placeholder admin) sont dans `assets/css/blocks/[nom-du-bloc].css`.

---

## Blocs Gutenberg custom — pattern

Les blocs custom suivent un principe strict lié à l'architecture headless :

- **Côté WordPress (admin)** : le bloc expose des champs de saisie à l'utilisateur et affiche un **placeholder visuel simple** dans l'éditeur (titre du bloc + aperçu minimaliste). Aucun vrai rendu.
- **Côté Next.js (front)** : le vrai rendu visuel est entièrement géré par le composant React correspondant.
- **Les blocs utilisent les attributs natifs `block.json`** — pas d'ACF pour les blocs. ACF est réservé aux métadonnées des CPT.
- Les attributs sont exposés via WPGraphQL et consommés par Next.js.

### Structure d'un bloc custom

```json
// block.json
{
  "name": "hope-radio/hero-section",
  "title": "Hero Section",
  "category": "hope-radio",
  "attributes": {
    "titre": { "type": "string" },
    "sousTitre": { "type": "string" },
    "imageId": { "type": "number" }
  },
  "supports": {
    "html": false,
    "align": false
  }
}
```

```php
// render.php — placeholder uniquement
<div class="hope-radio-block-placeholder">
  <span class="placeholder-label">Hope Radio — <?= $block['title'] ?></span>
</div>
```

---

## Design system

### Couleurs

| Nom | Slug | Valeur |
|---|---|---|
| Primaire | `primary` | `#72004A` |
| Secondaire | `secondary` | `#E35711` |
| Tertiaire | `tertiary` | `#2847AF` |

Règles `theme.json` : `"custom": false` et `"defaultPalette": false` — aucune couleur libre autorisée dans l'éditeur.

### Typographies

| Usage | Police |
|---|---|
| Paragraphes et corps de texte | Century Gothic |
| Titres h1–hn dans le contenu Gutenberg | Gravesend Sans |
| Titres dans les blocs custom et les archives | Copyright Radosław Łukasiewicz (radluka.com) |

### Tailles de police

| Élément | Taille | Remarque |
|---|---|---|
| h1 | 120px | — |
| h2 | 88px | — |
| h3 | 64px | — |
| h4 | 48px | — |
| h5 | 32px | — |
| Paragraphes et listes | 16px | line-height: 180% |

### Boutons

Forme pill — `border-radius: 9999px`, padding `10px 30px`, taille de texte `16px`.

---

## theme.json — règles éditoriales

- Palette limitée aux 3 couleurs de la charte — `"custom": false`, `"defaultPalette": false`
- Tailles de police prédéfinies uniquement — `"customFontSize": false`
- Familles typographiques déclarées explicitement, pas de police libre
- Blocs disponibles restreints à la liste ci-dessous

### Blocs core autorisés

```
core/paragraph
core/heading
core/image
core/list
core/quote
core/embed
core/audio
core/separator
core/columns
core/group
```

### Blocs custom

Chaque bloc custom a un fichier de documentation dans `modes/blocs/` et un fichier CSS placeholder dans `assets/css/blocks/`.

| Bloc | Slug | Statut | Doc |
|---|---|---|---|
| Hero section | `hope-radio/hero-section` | Développé | `modes/blocs/hero-section.md` |
| Actualités | `hope-radio/actualites` | À venir | — |
| À découvrir aujourd'hui (slide) | `hope-radio/a-decouvrir` | À venir | — |
| Podcasts (slide) | `hope-radio/podcasts` | À venir | — |
| Bannières (slide) | `hope-radio/bannieres` | À venir | — |
| Clips à la une (coverflow) | `hope-radio/clips` | À venir | — |
| Nos playlists (slide) | `hope-radio/playlists` | À venir | — |
| Nos autres radios | `hope-radio/autres-radios` | À venir | — |
| Chiffres clés | `hope-radio/chiffres-cles` | À venir | — |
| Zones de diffusion (accordéon) | `hope-radio/zones-diffusion` | À venir | — |
| L'équipe | `hope-radio/equipe` | À venir | — |

---

## Custom Post Types (CPT)

Tous les CPT doivent avoir `show_in_rest: true`, `show_in_graphql: true`, `graphql_single_name` et `graphql_plural_name` définis.

| CPT | Slug | Champs ACF principaux |
|---|---|---|
| Actualités | `post` (natif) | — |
| Émissions | `emission` | horaire, thème, stream_url, animateurs (relation) |
| Animateurs | `animateur` | prénom, nom, fonction, bio, photo, réseaux sociaux |
| Podcasts | `podcast` | fichier_audio, emission (relation), durée, date_enregistrement |
| Agenda | `agenda` | date_evenement, thème, lien |

---

## Plugins requis

| Plugin | Obligatoire | Rôle |
|---|---|---|
| WPGraphQL | Oui | Expose tout le contenu en GraphQL |
| Faust.js (plugin WP) | Oui | Bridge officiel WordPress ↔ Next.js |
| Advanced Custom Fields (ACF) | Oui | Champs métier sur les CPT uniquement |
| WPGraphQL for ACF | Oui | Expose les champs ACF dans le schéma GraphQL |
| WPGraphQL Smart Cache | Recommandé | Invalide le cache Next.js à chaque publication |

---

## Points de vigilance

- Les blocs custom utilisent les **attributs natifs `block.json`**, pas ACF. ACF est réservé aux métadonnées des CPT.
- Le `render.php` de chaque bloc custom n'affiche qu'un placeholder — ne jamais y mettre de vrai rendu HTML.
- Tout nouveau CPT doit avoir `show_in_graphql: true` et ses champs ACF exposés via WPGraphQL for ACF, sinon Next.js ne peut pas les consommer.
- Ne jamais activer un thème qui affiche un front public — WordPress ne doit servir aucune page HTML aux visiteurs.
- Les mises à jour de WPGraphQL peuvent renommer des champs dans le schéma GraphQL — toujours tester l'API après une mise à jour.
- Les styles définis dans `theme.json` s'appliquent à l'éditeur Gutenberg uniquement, pas au site public.
- Ne jamais écrire de styles dans `style.css` — utiliser `theme.json` pour le global et `assets/css/blocks/` pour les placeholders des blocs.