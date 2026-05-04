<?php

class Grille_GraphQL {

    public function init(): void {
        add_action('graphql_register_types', [$this, 'register_fields']);
    }

    public function register_fields(): void {
        register_graphql_fields('GrilleSlot', [
            'weekday' => [
                'type'        => 'Int',
                'description' => 'Jour de la semaine (0=dimanche, 1=lundi, …, 6=samedi)',
                'resolve'     => function ($post) {
                    return (int) get_post_meta($post->ID, 'weekday', true);
                },
            ],
            'heureDebut' => [
                'type'        => 'String',
                'description' => 'Heure de début au format HH:MM',
                'resolve'     => function ($post) {
                    return get_post_meta($post->ID, 'heure_debut', true) ?: null;
                },
            ],
            'heureFin' => [
                'type'        => 'String',
                'description' => 'Heure de fin au format HH:MM',
                'resolve'     => function ($post) {
                    return get_post_meta($post->ID, 'heure_fin', true) ?: null;
                },
            ],
            'emission' => [
                'type'        => 'Emission',
                'description' => 'Émission associée à ce créneau',
                'resolve'     => function ($post) {
                    $emission_id = (int) get_post_meta($post->ID, 'emission_id', true);
                    if (!$emission_id) return null;
                    $emission = get_post($emission_id);
                    if (!$emission || $emission->post_status !== 'publish') return null;
                    return $emission;
                },
            ],
        ]);

        register_graphql_field('RootQuery', 'grilleSlots', [
            'type'        => ['list_of' => 'GrilleSlot'],
            'description' => 'Créneaux de la grille hebdomadaire, optionnellement filtrés par jour.',
            'args'        => [
                'weekday' => [
                    'type'        => 'Int',
                    'description' => 'Filtrer par jour (0=dimanche … 6=samedi)',
                ],
            ],
            'resolve' => function ($root, $args) {
                $query_args = [
                    'post_type'      => 'grille_slot',
                    'post_status'    => 'publish',
                    'posts_per_page' => -1,
                    'orderby'        => 'meta_value_num',
                    'meta_key'       => 'weekday',
                    'order'          => 'ASC',
                ];

                if (isset($args['weekday'])) {
                    $query_args['meta_query'] = [[
                        'key'     => 'weekday',
                        'value'   => (int) $args['weekday'],
                        'compare' => '=',
                        'type'    => 'NUMERIC',
                    ]];
                }

                return get_posts($query_args) ?: [];
            },
        ]);
    }
}
