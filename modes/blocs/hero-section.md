# Hero section
C'est un bloc gutenberg appelé `Hope Radio Slider Principal` pour créer une section hero dont chaque slide avec un tag `A la une` une image de fond, une image d'illustration, un titre, une description et deux boutons d'appel à l'action.
Le bloc n'a pas de padding bottom, il s'étend sur toute la largeur de l'écran, mais le contenu est dans un conteneur `.container`. 
* **Hauteur min** 579px + 135px (le 135px sert à compenser le padding top) et alignement vertical des deux colonnes : center

## Configuration du slide 
 * fade in/out
 * autoplay
 * Pas de pagination, pas de navigation

## Contenu
### Image de fond :
* Image affichée en background du bloc, avec un effet cover, center center, repeat (champ image en backoffice du bloc)

## Bloc à droite
Image width 512px height 546px (champ image en backoffice du bloc)

### Un bloc à gauche flex column :
* ***Un tag `A la une`*** (champ texte en backoffice), Tag : pill, fond transparent, bordure 1px solid white, texte blanc, font-size, padding, border-radius
* Une description (champ textarea en backoffice)
* **Deux boutons d'appel à l'action.** padding, border-radius, couleurs exactes des deux variantes, gap entre eux, icône du 2e bouton
* **Overlay fond** background: rgba(114, 0, 74, 0.7) ou similaire en position: absolute au-dessus du bg
Entre le tag et le titre, il y a un marge de 26px, entre le titre et la description une marge de 19px, entre la description et les boutons une marge de 40px.

## Librairies utilisées
* SwiperJS pour le slide
* Gsap pour les animations d'apparition
* TailwindCSS pour le style