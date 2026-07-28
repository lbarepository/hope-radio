# Catégorie podcast
Créer une page podcasts qui affichera le contenu du flux rss https://feed.ausha.co/JYngpHkm8jO3

# Structure
La page est accessible via le menu `Podcasts` et affiche la structure suivante : 
* Titre de la page `Podcasts`

Une boucle sur le flux rss qui affichera : 
* Le titre du podcast
* La liste des épisodes du podcast en cards sous forme de slide swiperjs

# UI
![categorie-podcast-ui.png](categorie-podcast-ui.png)

# Ce qu'il faut faire
* Si ce n'est déjà fait, créer la page Podcasts
* Comme sur la page emissions la page a une background dont #310C52 et un titre Podcasts
* style du titre podcast
```css
color: #FFF;

/* Sous-titre */
font-family: "Gravesend Sans";
font-size: 32px;
font-style: normal;
font-weight: 700;
line-height: 100%; /* 32px */
```

* L'espacement entre le titre du podcast et les épidodes est de 48px

# Les épisodes
les épisodes du podcast sont dans un slide swiperjs, dont l'espace entre les items sont de 20px, au survol d'un item ce dernier a un scale de 1.4 sans perturber la disposition des autres items.
Une épisode a des bords arrondis de 1rem, un titre du podcast avec le css 
```css
color: #E85B21;
text-align: center;

/* H5 */
font-family: "Copyright Radosaw ukasiewicz, radluka.com";
font-size: 28px;
font-style: normal;
font-weight: 900;
line-height: 110%; /* 30.8px */
```
L'image de fond du podcast

