# FAQ
Créer une page faq qui affiche un faq sous forme d'accordeon

## UI
![FAQ](faq.png)

## Structure
* Titre `Faq` en `h1` comme sur la page archive agenda
* Description du faq
* Liste des questions / réponses

## Sources de données
Créer onglet FAQ dans l'option acf `group_promotions` qui contiendra :
* Un repeater faq qui contiendra une question et une réponse
* Un textarea `faq_description`
* Un champ texte qui contiendra le texte `Vous avez une question?` avec comme nom `faq_label`

## Styles
* sur le front la valeur de faq_label a comme style : 
```css
font-family: Gravesend Sans;
font-weight: 700;
font-style: Bold;
font-size: 32px;
leading-trim: NONE;
line-height: 100%;
letter-spacing: 0%;
vertical-align: bottom;
```

* Description
```css
font-family: Archivo;
font-weight: 700;
font-style: Bold;
font-size: 16px;
leading-trim: NONE;
line-height: 25px;
letter-spacing: 0%;
```
* Item de l'accordeon
```css
background-color:white;
```
* Question
```css
padding:30px;
font-family: Archivo;
font-weight: 700;
font-style: Bold;
font-size: 20px;
leading-trim: NONE;
line-height: 25px;
letter-spacing: 0%;
```
* Description
```css
font-family: Poppins;
font-weight: 400;
font-style: Regular;
font-size: 12px;
leading-trim: NONE;
line-height: 20px;
letter-spacing: 0%;
text-transform: capitalize;
```

* Arrow up 
```svg
<svg width="15" height="9" viewBox="0 0 15 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.65715 0.292893C7.04768 -0.097631 7.68084 -0.097631 8.07136 0.292893L14.4353 6.65685C14.8259 7.04738 14.8259 7.68054 14.4353 8.07107C14.0448 8.46159 13.4116 8.46159 13.0211 8.07107L7.36426 2.41421L1.7074 8.07107C1.31688 8.46159 0.683714 8.46159 0.29319 8.07107C-0.0973344 7.68054 -0.0973344 7.04738 0.29319 6.65685L6.65715 0.292893ZM7.36426 2.5L6.36426 2.5V1L7.36426 1L8.36426 1V2.5L7.36426 2.5Z" fill="black"/>
</svg>
```

* Arrow down c'est le arrow up avec rotation de 90 degré
* Entre la question et la réponse, une ligne horizontale de background black à 15%
* La page a un fond image comme sur le composant HeroSlider.tsx