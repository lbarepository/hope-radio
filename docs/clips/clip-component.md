# Clip à la une
C'est un composant qui affiche sous forme de slider swiperjs de type cover et que chaque item affichera le contenu d'un clip

## C'est quoi un clip ?
Un post type contenant : 
* Titre
* Image à la une, qui servira de couverture pour l'item du slide
* Champ lien acf `clip_url`
Le post type Clip n'utilise pas gutenberg

## Fonctionnalité
Au clic sur un item du slide, cela ouvre un lien externe `clip_url`

## UI
![clip](../clips.png)

## Ce qu'il faut faire
* Créer le post type Clip dans l'admin wordpress
* Créer un champ acf url attaché au post type qui servira d'url de la vidéo 
* Ne pas afficher l'éditeur wysiwyg dans le post type car c'est inutile
* Le post type doit avoir une image à la une
