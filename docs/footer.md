# Footer
Afficher le composant footer, qui doit apparaitre partout sur le site

## Composition du footer
Le footer est composé de 4 colonnes en grid sur desktop, et une colonne pour mobile et dans un conteneur centré

### Première colonne
* Titre : Hope radio
* À propos
* Adresse
* Numéro de téléphone
* Email

### Deuxième colonne
***Menu partenaires*** Enregistré dans le backoffice et déclaré dans le fichier `@wordpress/themes/hope-radio/inc/theme-setup.php`

### Troisième colonne
***Menu plus d'infos*** Enregistré dans le backoffice et déclaré dans le fichier `@wordpress/themes/hope-radio/inc/theme-setup.php`

### Quatrième colonne
***Inscription newsletter*** Pour l'instant implémenter le html du front
***Liste des réseaux sociaux*** Menu réseaux sociaux, comme celui dans topmenu

### Bas du footer
On affiche le copyright, un champ acf `copyright` contenant le texte suivant `© Tous droits réservés. Mentions légales I Politique de confidentialité I  Plan du site `

## Ce qu'il faut faire
* Créer un onglet `Footer` dans l'option acf `Général` déjà crée dans le fichier `@wordpress/themes/hope-radio/inc/acf-fields.php`
* Créer les champs de la première colonne dans cet onglet
* Créer le champ pour le copyright

## Styles
Le footer a un fond de couleur blanc

*** Les titres de chaque colonne ***
```css
color: #72004A;

/* Small text LABEL */
font-family: "Gravesend Sans";
font-size: 14px;
font-style: normal;
font-weight: 700;
line-height: 124%; /* 17.36px */
````
*** La description dans la première colonne ***
```css
color: #000;

/* Small texte */
font-family: Poppins;
font-size: 14px;
font-style: normal;
font-weight: 700;
line-height: 140%; /* 19.6px */
```
*** L'adresse dans la première colonne****
```css
color: #31251A;

/* X-small text label */
font-family: "Gravesend Sans Bold";
font-size: 12px;
font-style: normal;
font-weight: 700;
line-height: 116%;
```
*** Pour chaque items de menu ***
```css
color: #000;

/* Small texte */
font-family: Poppins;
font-size: 14px;
font-style: normal;
font-weight: 700;
line-height: 140%; /* 19.6px */
```
***Le copyright ***
```css
color: #000;
text-align: center;
font-family: Archivo;
font-size: 12px;
font-style: normal;
font-weight: 400;
line-height: 20px; /* 166.667% */
```
***Les réseaux sociaux ***
Utiliser le champ image `Icône — pages internes (header blanc)` du menu réseaux sociaux pour les icônes