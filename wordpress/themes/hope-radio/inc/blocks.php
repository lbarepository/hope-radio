<?php

/**
 * Blocs Gutenberg custom du thème.
 * Chaque bloc suit le pattern défini dans CLAUDE.md : attributs natifs
 * block.json, placeholder admin uniquement (aucun vrai rendu), le rendu
 * réel étant géré par Next.js via WPGraphQL.
 */

add_action('init', function () {
    register_block_type(get_template_directory() . '/blocks/equipe');
});

/**
 * Catégorie dédiée aux blocs custom Hope Radio dans l'inserteur.
 */
add_filter('block_categories_all', function (array $categories) {
    return array_merge(
        [
            [
                'slug'  => 'hope-radio',
                'title' => __('Hope Radio', 'hope-radio'),
                'icon'  => 'admin-site-alt3',
            ],
        ],
        $categories
    );
});
