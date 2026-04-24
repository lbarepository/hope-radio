# Style du hero section Hope Radio Hero Section
Tous les styles ci-dessous sont à adapter en TailwindCSS, ils sont donnés en css régulier à titre d'exemple pour expliquer les styles à appliquer.

## UI attendu
![UI hero section](images/hero-section-ui.png)
## Conteneur
**Nom de l'élement** : `.hope-radio-hero-section`
**Role** : Conteneur du bloc hero section, il s'étend sur toute la largeur de l'écran, mais le contenu est dans un conteneur `.container`
**Style** :
Le padding doit-être ajusté pour mobile et tablette, pour que le bloc soit plus compact sur les petits écrans. Sur desktop, le padding top est de 135px + 40px (pour laisser de la place au menu principal dont la hauteur est de 135px sur desktop et tablette en mode paysage), sur mobile et tablette, le padding top est de 80px + 40px.
```css
.hope-radio-hero-section {
    width: 100%;
    position: relative;
    padding: calc(135px + 40px) 0 0 0;
}
```
**Le conteneur** `.container` a des styles supplémentaires pour aligner le contenu à gauche et créer un espace entre le contenu et le bloc à droite :
```css
.hope-radio-hero-section .container {
    display: flex;
    justify-content: space-between;
    gap: 40px;
}
```
## Image de fond
**Nom de l'élement** : `.hope-radio-hero-section__background`
**Role** : Image de fond du bloc hero section, elle doit s'afficher en background du bloc, avec un effet cover, center center, repeat
**Style** :
```css
.hope-radio-hero-section__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    z-index: 1;
}
```

## Bloc à droite
**Nom de l'élement** : `.hope-radio-hero-section__right`
**Role** : Bloc à droite du hero section, il contient une image d'illustration
**Style** :
```css
.hope-radio-hero-section__right {
    width: 512px;
    height: 546px;
    z-index: 2;
}
```
## Bloc à gauche
**Nom de l'élement** : `.hope-radio-hero-section__left` il occupe la place restante (width du container - width du bloc à droite tout en prenant en compte le gap du parent).
**Role** : Bloc à gauche du hero section, il contient un tag `A la une`, un titre, une description et deux boutons d'appel à l'action.
**Style** :
```css
.hope-radio-hero-section__left {
    display: flex;
    flex-direction: column;
}
.hope-radio-hero-section__left .tag {
    /* style du tag A la une */
    margin-bottom: 26px; 
}

.hope-radio-hero-section__left .title {
    /* style du titre */
    margin-bottom: 19px; 
}

.hope-radio-hero-section__left .description {
    margin-bottom: 40px;
}
```

## Responsive
* Le bloc à droite s'affiche avent le bloc à gauche sur mobile et tablette en mode portrait.
* Sur mobile et tablette en mode portrait, le bloc à droite est plus petit pour s'adapter à la taille de l'écran, il a une largeur de 100% et une hauteur auto.
```css
@media (max-width: 768px) {
    .hope-radio-hero-section .container {
        flex-direction: column;
    }
    .hope-radio-hero-section__right {
        width: 100%;
        height: auto;
        order:1
    }
	.hope-radio-hero-section__left {
        order:2
    }
}
```