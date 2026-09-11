// Miroir exact de la réponse WPGraphQL pour GET_SLIDES_HOME.
//
// Structure anticipée basée sur le répéteur ACF slides_home
// (Options du thème > Home > Slides), exposé manuellement en GraphQL.
// lien1/lien2 reflètent le champ ACF "Lien" (url + title + target).
//
// !! Ne pas modifier la structure de ce fichier sans mettre à jour
//   la query GET_SLIDES_HOME dans graphql/hero.ts.

import type { GetSlidesHomeData } from '@/graphql/hero';

export const MOCK_SLIDES_HOME: GetSlidesHomeData = {
  slidesHome: [
    {
      titre:       "Titre de l'Émission",
      description: "Avec nom de l'animateur et des chroniqueurs, de 18h à 20h.",
      image:       null,
      lien1:       { url: '/emissions/titre-emission/', title: "L'émission", target: null },
      lien2:       null,
    },
    {
      titre:       'Nom du Podcast Featured',
      description: 'Description courte du podcast — saison 2.',
      image:       null,
      lien1:       { url: '/podcasts/nom-podcast-featured/', title: 'Le podcast', target: null },
      lien2:       { url: '/live/', title: 'Message en direct', target: null },
    },
    {
      titre:       "Titre de l'Article à la Une",
      description: "Un court résumé de l'actualité mise à la une.",
      image:       null,
      lien1:       { url: '/actualites/titre-article-une/', title: "L'article", target: null },
      lien2:       null,
    },
  ],
};
