# Archive agenda

Afficher tous les posts agenda sous forme de slide

## UI attendu
![agenda](agendas.png)

## Mise en page
Background de la page : #31251A

## Filtre
Comme pour les articles, pouvoir filtrer par catégorie 

## Ce qu'il faut faire
* Créer un taxonomie dans le backoffice de agenda
* Récupérer tous les agendas
* Filtrer par catégorie
* Utiliser swiperjs comme librairie du slide

## Fonctionnement du slide
* De droite vers la gauche
* Le slide actif a une largeur 2 fois plus grande que les autres, quand un slide est active il faut une transition de sa taille
* sur desktop, afficher 2slides et une moitié du troisième visible 


## Item du slide
* Image 70% de la hauteur
* Titre
* Description
* Uniquement l'item active qui a le bouton qui est affiché à droite de la description

## Taille des textes
Exactement comme sur l'archive des actualités