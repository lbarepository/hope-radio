<?php

// 1. Activer le support des fonctionnalités nécessaires
add_action('after_setup_theme', function () {
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('title-tag');
});

/*
* 2. Restreindre les blocs disponibles dans Gutenberg
* Le rédacteur ne voit que ce dont il a besoin
 * Note : Si vous souhaitez ajouter des blocs personnalisés ou de plugins, ajoutez-les à la liste ci-dessous
 */
add_filter('allowed_block_types_all', function ($allowed_blocks, $editor_context) {
    return [
        'core/paragraph',
        'core/heading',
        'core/image',
        'core/list',
        'core/quote',
        'core/embed',           // Pour intégrer du contenu externe
        'core/audio',           // Pour les extraits audio
        'core/separator',
        'core/columns',
        'core/group',
    ];
}, 10, 2);