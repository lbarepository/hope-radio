<?php

/**
 * Render du bloc hope-radio/equipe — PLACEHOLDER ADMIN UNIQUEMENT.
 *
 * Aucun vrai rendu ici : le slider (nom, fonction, photo dans une bulle)
 * est entièrement géré par le composant Next.js correspondant, qui
 * interroge WPGraphQL pour lister les animateurs publiés (CPT Animateur).
 * Ce fichier sert d'aperçu dans l'éditeur Gutenberg (ServerSideRender,
 * voir index.js).
 *
 * IMPORTANT : ce placeholder finit aussi dans le HTML public quand la page
 * WordPress (générique, hors CPT dédié) est rendue via `content` en
 * Next.js (app/[...slug]/page.tsx) — WPGraphQL n'expose pas encore
 * editorBlocks sur ce site. L'attribut `data-hope-radio-block="equipe"`
 * ci-dessous sert de marqueur : Next.js repère ce bloc dans le HTML et le
 * remplace par le vrai composant <EquipeSection> (voir
 * frontend/lib/wpBlockContent.tsx). Ne pas retirer cet attribut, et ne pas
 * ajouter de <div> imbriqué dans ce placeholder (le marqueur est extrait
 * par une regex qui s'arrête au premier </div> fermant).
 *
 * @var array    $attributes
 * @var string   $content
 * @var WP_Block $block
 */

$titre = $attributes['titre'] ?? "L'équipe";

$animateurs = get_posts([
    'post_type'      => 'animateur',
    'post_status'    => 'publish',
    'posts_per_page' => -1,
    'fields'         => 'ids',
]);

$count = count($animateurs);

?>
<div class="hope-radio-block-placeholder hope-radio-block-placeholder--equipe" data-hope-radio-block="equipe" data-titre="<?php echo esc_attr($titre); ?>">
    <span class="placeholder-label">Hope Radio — <?php echo esc_html($titre); ?></span>
    <p class="placeholder-description">
        <?php
        if ($count > 0) {
            printf(
                esc_html(
                    _n(
                        '%d animateur publié — récupéré automatiquement.',
                        '%d animateurs publiés — récupérés automatiquement.',
                        $count,
                        'hope-radio'
                    )
                ),
                (int) $count
            );
        } else {
            esc_html_e('Aucun animateur publié pour le moment (CPT Animateur).', 'hope-radio');
        }
        ?>
    </p>
</div>
