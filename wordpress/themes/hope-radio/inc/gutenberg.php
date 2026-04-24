<?php

add_filter('allowed_block_types_all', function ($allowed_blocks, $editor_context) {
    return [
        'core/paragraph',
        'core/heading',
        'core/image',
        'core/list',
        'core/quote',
        'core/embed',
        'core/audio',
        'core/separator',
        'core/columns',
        'core/group',
    ];
}, 10, 2);
