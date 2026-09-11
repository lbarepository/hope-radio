<?php

/**
 * Render du bloc hope-radio/equipe — PLACEHOLDER ADMIN UNIQUEMENT.
 *
 * Aucun vrai rendu ici : le slider (nom, fonction, photo dans une bulle)
 * est entièrement géré par le composant Next.js correspondant, qui
 * interroge WPGraphQL pour lister les animateurs publiés (CPT Animateur).
 * Ce fichier sert uniquement d'aperçu dans l'éditeur Gutenberg, via
 * ServerSideRender (voir index.js).
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
<div class="hope-radio-block-placeholder hope-radio-block-placeholder--equipe">
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
