<?php


// Configuration du thème
add_action('after_setup_theme', 'after_setup_theme_hope_radio');

// Autoriser l'upload de svg
add_filter('upload_mimes', 'add_file_types_to_uploads');


function after_setup_theme_hope_radio() {
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('title-tag');

    register_nav_menus([
        'main-menu'      => __('Menu principal', 'hope-radio'),
        'secondary-menu' => __('Menu secondaire', 'hope-radio'),
    ]);
}

function add_file_types_to_uploads($file_types){
    $new_filetypes = array();
    $new_filetypes['svg'] = 'image/svg+xml';
    $file_types = array_merge($file_types, $new_filetypes );
    return $file_types;
}
