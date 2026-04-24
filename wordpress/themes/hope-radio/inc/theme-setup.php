<?php

add_action('after_setup_theme', function () {
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('title-tag');

    register_nav_menus([
        'main-menu'      => __('Menu principal', 'hope-radio'),
        'secondary-menu' => __('Menu secondaire', 'hope-radio'),
    ]);
});
