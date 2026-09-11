# Bloc `hope-radio/equipe`

Section « L'équipe » : slider automatique des animateurs (CPT `animateur`),
affichant pour chacun sa photo dans une bulle, son nom + prénom et sa fonction.

---

## Fonctionnement

Bloc **dynamique** et **automatique** : contrairement à `hero-section`, il n'y a
aucune sélection manuelle d'animateurs. Le seul champ de saisie est le titre
de la section (`titre`, défaut : « L'équipe »).

- **Admin (WordPress)** : `render.php` affiche un placeholder minimaliste
  (titre + nombre d'animateurs publiés trouvés via `WP_Query`/`get_posts`),
  visible dans l'éditeur via `ServerSideRender`. Aucun vrai rendu visuel.
- **Front (Next.js)** : le composant correspondant interroge WPGraphQL pour
  lister tous les animateurs publiés (requête `animateurs`, pas de lien avec
  le bloc lui-même) et affiche le slider (Swiper) avec, par slide :
  photo dans une bulle ronde, `PRÉNOM NOM`, fonction.

## Attributs (`block.json`)

| Attribut | Type | Défaut | Description |
|---|---|---|---|
| `titre` | `string` | `"L'équipe"` | Titre affiché au-dessus du slider |

## Champs GraphQL consommés (CPT `animateur`)

Exposés via `group_animateur` (WPGraphQL for ACF, `inc/acf-fields.php`) :

```graphql
query GetAnimateurs {
  animateurs(where: { status: PUBLISH }) {
    nodes {
      id
      title
      animateurInfos {
        prenom
        nom
        fonction
        photo {
          node {
            sourceUrl
            altText
          }
        }
        # note : photo est une AcfMediaItemConnectionEdge, comme featuredImage
      }
    }
  }
}
```

## Fichiers

- `blocks/equipe/block.json`
- `blocks/equipe/render.php` — placeholder admin (ServerSideRender)
- `blocks/equipe/index.js` — UI éditeur (titre + aperçu SSR)
- `blocks/equipe/index.asset.php` — dépendances du script éditeur (pas de build tool dans ce thème)
- `assets/css/blocks/equipe.css` — styles placeholder admin
- `inc/blocks.php` — `register_block_type` + catégorie `hope-radio`

## À faire côté Next.js (non couvert ici)

- Requête GraphQL `animateurs` (cf. ci-dessus)
- Composant `Equipe`/`EquipeSlider` (Swiper) sur la page « La radio »
  (`frontend/app/radio/page.tsx`, actuellement un stub)
