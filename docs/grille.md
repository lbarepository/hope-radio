# SPEC — Fonctionnalité "Grille des programmes"

> Spec destinée à Claude Code.
> Périmètre : WordPress uniquement (back-office + API GraphQL).
> Le rendu front Next.js est hors-scope de cette spec.
> Basée sur la documentation officielle FullCalendar v6 (fullcalendar.io/docs).

---

## Contexte

Hope Radio est un site de radio chrétienne francophone en architecture headless.
WordPress est **uniquement un back-office** : aucune page n'est affichée aux visiteurs.
Le contenu est exposé via **WPGraphQL** et consommé par un front Next.js.

La "Grille des programmes" est la planification hebdomadaire récurrente des émissions :
chaque case associe une **Émission** (CPT `emission`) à un créneau horaire sur un jour de la semaine.

La grille est **récurrente** : elle représente une semaine-type, sans dates calendaires.

---

## Librairie : FullCalendar v6

**Package :** `fullcalendar` (standard bundle — MIT, open-source)
**Version :** 6.1.20 (dernière stable)
**Aucune dépendance externe requise** — le bundle standard est autonome.

### CDN à utiliser (vanilla JS, standard bundle)

Le standard bundle inclut tous les plugins nécessaires (`timeGrid`, `interaction`, locales).
Un seul fichier à charger :

```html
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.20/index.global.min.js"></script>
```

Pour la locale française, ajouter **après** le bundle :

```html
<script src="https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.20/locales/fr.global.min.js"></script>
```

> ⚠️ Ne pas utiliser les anciens bundles jQuery (v3 et antérieur). FullCalendar v6 est vanilla JS pur.

### Format d'un event récurrent (grille hebdomadaire)

FullCalendar supporte nativement les événements récurrents sans date via `daysOfWeek` :

```js
{
    id:          'slot-42',     // identifiant unique (string)
    title:       'Le Morning',  // titre de l'émission
    daysOfWeek:  [1],           // tableau : 0=dimanche, 1=lundi, ..., 6=samedi
    startTime:   '08:00:00',    // HH:MM:SS
    endTime:     '09:00:00',    // HH:MM:SS
    color:       '#3498db',     // couleur de fond (hex)
    extendedProps: {
        emissionId: 42,         // ID WordPress du post emission
        postId:     7,          // ID WordPress du post grille_slot
    }
}
```

> `daysOfWeek` est un tableau d'entiers. Un créneau qui couvre plusieurs jours
> (ex : lundi et mardi) aurait `daysOfWeek: [1, 2]` — mais pour la grille radio,
> chaque créneau ne couvre **qu'un seul jour** : `daysOfWeek: [n]`.

### Callbacks clés

| Callback | Signature | Usage |
|---|---|---|
| `select` | `(info)` | L'utilisateur dessine une plage horaire vide |
| `eventClick` | `(info)` | Clic sur un créneau existant → édition |
| `eventDrop` | `(info)` | Drag & drop d'un créneau |
| `eventResize` | `(info)` | Redimensionnement d'un créneau |

**Accès aux données dans les callbacks :**

```js
// select
select: function(info) {
    // info.startStr  → "2026-05-04T08:00:00"
    // info.endStr    → "2026-05-04T09:00:00"
    // info.start.getDay() → jour de la semaine (0-6)
}

// eventClick
eventClick: function(info) {
    // info.event.id               → 'slot-42'
    // info.event.title            → 'Le Morning'
    // info.event.extendedProps.emissionId
    // info.event.extendedProps.postId
}

// eventDrop / eventResize
eventDrop: function(info) {
    // info.event.id
    // info.event.startStr         → nouvelle heure de début (ISO)
    // info.event.endStr           → nouvelle heure de fin (ISO)
    // info.event.start.getDay()   → nouveau jour de la semaine
    // info.revert()               → annule le déplacement (à appeler si AJAX échoue)
}
```

### Méthodes de l'instance

```js
// Ajouter un event
calendar.addEvent({ id, title, daysOfWeek, startTime, endTime, color, extendedProps });

// Récupérer un event par son id
const event = calendar.getEventById('slot-42');

// Mettre à jour un event (après save AJAX)
event.setProp('title', 'Nouveau titre');
event.setExtendedProp('emissionId', 43);

// Supprimer un event
event.remove();
```

---

## Structure des fichiers

Tout le code est isolé dans :

```
wordpress/wp-content/themes/hope-radio/grille/
├── grille.php                ← point d'entrée, chargé via functions.php
├── class-grille-cpt.php      ← enregistrement du CPT grille_slot
├── class-grille-graphql.php  ← enregistrement des champs WPGraphQL
├── class-grille-admin.php    ← page admin + enqueue des assets
├── class-grille-ajax.php     ← handlers AJAX (save, update, delete)
├── assets/
│   ├── css/
│   │   └── grille-admin.css  ← styles de la page admin uniquement
│   └── js/
│       └── grille-admin.js   ← initialisation FullCalendar + logique modal
```

`functions.php` n'ajoute qu'**une seule ligne** :

```php
require_once get_template_directory() . '/grille/grille.php';
```

`grille.php` instancie les classes et appelle leurs méthodes `init()` qui branchent les hooks.

---

## Ce qu'il faut faire

### 1. CPT `grille_slot`

Fichier : `class-grille-cpt.php`

```php
register_post_type('grille_slot', [
    'labels'              => [
        'name'          => 'Créneaux',
        'singular_name' => 'Créneau',
    ],
    'public'              => false,
    'show_ui'             => false,   // pas de liste admin native
    'show_in_rest'        => false,   // pas d'API REST
    'show_in_graphql'     => true,
    'graphql_single_name' => 'grilleSlot',
    'graphql_plural_name' => 'grilleSlots',
    'supports'            => ['title'],
]);
```

**Champs meta** — enregistrés via `register_post_meta()` natif WordPress :

| Meta key      | Type    | Description                                        |
|---------------|---------|----------------------------------------------------|
| `weekday`     | integer | Entier 0–6 (0=dimanche, 1=lundi, …, 6=samedi)     |
| `heure_debut` | string  | Format `HH:MM` (ex : `08:00`)                      |
| `heure_fin`   | string  | Format `HH:MM` (ex : `09:00`)                      |
| `emission_id` | integer | `ID` du post de type `emission` associé            |

Tous avec `show_in_rest: false`, `show_in_graphql: false` (exposition manuelle en GraphQL).

---

### 2. Page d'administration

Fichier : `class-grille-admin.php`

**Enregistrement du menu :**

```php
add_action('admin_menu', function() {
    add_menu_page(
        'Grille des programmes',
        'Grille',
        'edit_posts',
        'hope-radio-grille',
        [ $this, 'render_page' ],
        'dashicons-schedule',
        25
    );
});
```

**Rendu HTML de la page :**

```html
<div class="wrap">
    <h1 class="wp-heading-inline">Grille des programmes</h1>
    <div id="grille-calendar"></div>
</div>

<!-- Modal créneau -->
<div id="grille-modal" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="grille-modal-title">
    <div id="grille-modal-overlay"></div>
    <div id="grille-modal-box">
        <h2 id="grille-modal-title">Créneau</h2>

        <!-- Champs cachés -->
        <input type="hidden" id="grille-slot-id" />     <!-- guid FullCalendar : "slot-{postId}" -->
        <input type="hidden" id="grille-slot-post-id" /> <!-- postId WordPress -->

        <!-- Émission -->
        <div class="grille-field">
            <label for="grille-emission-id">Émission</label>
            <select id="grille-emission-id" required>
                <option value="">— Choisir une émission —</option>
                <!-- Options injectées via wp_localize_script → GrilleData.emissions -->
            </select>
        </div>

        <!-- Jour -->
        <div class="grille-field">
            <label for="grille-weekday">Jour</label>
            <select id="grille-weekday">
                <option value="0">Dimanche</option>
                <option value="1">Lundi</option>
                <option value="2">Mardi</option>
                <option value="3">Mercredi</option>
                <option value="4">Jeudi</option>
                <option value="5">Vendredi</option>
                <option value="6">Samedi</option>
            </select>
        </div>

        <!-- Horaires -->
        <div class="grille-field">
            <label for="grille-heure-debut">Début</label>
            <input type="time" id="grille-heure-debut" step="900" required />
            <!-- step="900" → intervalles de 15 min -->
        </div>
        <div class="grille-field">
            <label for="grille-heure-fin">Fin</label>
            <input type="time" id="grille-heure-fin" step="900" required />
        </div>

        <!-- Actions -->
        <div class="grille-modal-actions">
            <button type="button" id="grille-btn-save"   class="button button-primary">Enregistrer</button>
            <button type="button" id="grille-btn-delete" class="button button-link-delete" style="display:none;">Supprimer</button>
            <button type="button" id="grille-btn-cancel" class="button">Annuler</button>
        </div>

        <div id="grille-modal-error" class="notice notice-error" style="display:none;"></div>
    </div>
</div>
```

**Enqueue des assets — uniquement sur cette page admin :**

```php
add_action('admin_enqueue_scripts', function(string $hook): void {
    if ($hook !== 'toplevel_page_hope-radio-grille') return;

    // FullCalendar standard bundle (inclut timeGrid + interaction)
    wp_enqueue_script(
        'fullcalendar',
        'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.20/index.global.min.js',
        [],
        '6.1.20',
        true
    );

    // Locale française
    wp_enqueue_script(
        'fullcalendar-fr',
        'https://cdn.jsdelivr.net/npm/@fullcalendar/core@6.1.20/locales/fr.global.min.js',
        ['fullcalendar'],
        '6.1.20',
        true
    );

    // Assets locaux
    wp_enqueue_style(
        'grille-admin',
        get_template_directory_uri() . '/grille/assets/css/grille-admin.css',
        [],
        '1.0.0'
    );
    wp_enqueue_script(
        'grille-admin',
        get_template_directory_uri() . '/grille/assets/js/grille-admin.js',
        ['fullcalendar', 'fullcalendar-fr'],
        '1.0.0',
        true
    );

    // Données injectées en JS
    wp_localize_script('grille-admin', 'GrilleData', [
        'ajaxUrl'   => admin_url('admin-ajax.php'),
        'nonce'     => wp_create_nonce('grille_nonce'),
        'emissions' => $this->get_emissions_list(),
        // Format : [ { id: 42, title: "Le Morning", color: "#3498db" }, ... ]
        'slots'     => $this->get_all_slots(),
        // Format : voir section "Format des slots injectés" ci-dessous
    ]);
});
```

**Format des slots injectés (`get_all_slots()`) :**

```json
[
    {
        "postId":     7,
        "id":         "slot-7",
        "title":      "Le Morning",
        "weekday":    1,
        "heureDebut": "08:00",
        "heureFin":   "09:00",
        "emissionId": 42,
        "color":      "#3498db"
    }
]
```

**Format des émissions injectées (`get_emissions_list()`) :**

```json
[
    { "id": 42, "title": "Le Morning",    "color": "#3498db" },
    { "id": 43, "title": "L'Après-midi", "color": "#e74c3c" }
]
```

La couleur est générée de manière **déterministe** : `PALETTE[$emission_id % count(PALETTE)]`
sur une palette fixe de 12 couleurs hex définie comme constante dans la classe.

---

### 3. Initialisation FullCalendar (`grille-admin.js`)

```js
document.addEventListener('DOMContentLoaded', function () {

    // ── Populer le select des émissions ──────────────────────────────────────
    const selectEmission = document.getElementById('grille-emission-id');
    GrilleData.emissions.forEach(function (em) {
        const opt = document.createElement('option');
        opt.value       = em.id;
        opt.textContent = em.title;
        selectEmission.appendChild(opt);
    });

    // ── Convertir les slots WP en events FullCalendar ─────────────────────────
    const initialEvents = GrilleData.slots.map(function (slot) {
        return {
            id:          slot.id,               // "slot-{postId}"
            title:       slot.title,
            daysOfWeek:  [parseInt(slot.weekday, 10)],
            startTime:   slot.heureDebut + ':00', // "08:00:00"
            endTime:     slot.heureFin   + ':00', // "09:00:00"
            color:       slot.color,
            extendedProps: {
                emissionId: slot.emissionId,
                postId:     slot.postId,
            },
        };
    });

    // ── Initialisation FullCalendar ───────────────────────────────────────────
    const calendarEl = document.getElementById('grille-calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale:           'fr',
        initialView:      'timeGridWeek',
        allDaySlot:       false,
        slotMinTime:      '05:00:00',
        slotMaxTime:      '24:00:00',
        slotDuration:     '00:15:00',   // grille toutes les 15 min
        slotLabelInterval:'01:00:00',   // labels toutes les heures
        height:           'auto',
        selectable:       true,         // permet de dessiner un créneau
        editable:         true,         // active drag & drop + resize
        eventOverlap:     false,        // interdit les chevauchements
        headerToolbar:    false,        // on n'a pas besoin de navigation de date
        events:           initialEvents,

        // Dessin d'une nouvelle plage horaire
        select: function (info) {
            const weekday    = info.start.getDay();
            const heureDebut = formatTime(info.start);
            const heureFin   = formatTime(info.end);
            openModal('create', {
                weekday:    weekday,
                heureDebut: heureDebut,
                heureFin:   heureFin,
            });
            calendar.unselect();
        },

        // Clic sur un créneau existant → mode édition
        eventClick: function (info) {
            openModal('edit', {
                id:         info.event.id,
                postId:     info.event.extendedProps.postId,
                emissionId: info.event.extendedProps.emissionId,
                weekday:    info.event.start.getDay(),
                heureDebut: formatTime(info.event.start),
                heureFin:   formatTime(info.event.end),
            });
        },

        // Drag & drop → sauvegarde silencieuse
        eventDrop: function (info) {
            ajaxUpdateSlot(
                {
                    postId:     info.event.extendedProps.postId,
                    weekday:    info.event.start.getDay(),
                    heureDebut: formatTime(info.event.start),
                    heureFin:   formatTime(info.event.end),
                },
                null,
                function () { info.revert(); } // annuler si erreur AJAX
            );
        },

        // Resize → sauvegarde silencieuse
        eventResize: function (info) {
            ajaxUpdateSlot(
                {
                    postId:     info.event.extendedProps.postId,
                    weekday:    info.event.start.getDay(),
                    heureDebut: formatTime(info.event.start),
                    heureFin:   formatTime(info.event.end),
                },
                null,
                function () { info.revert(); }
            );
        },
    });

    calendar.render();

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Extrait "HH:MM" depuis un objet Date. */
    function formatTime(date) {
        return date.toTimeString().slice(0, 5);
    }

    // ── Modal ─────────────────────────────────────────────────────────────────

    const modal        = document.getElementById('grille-modal');
    const overlay      = document.getElementById('grille-modal-overlay');
    const errorBox     = document.getElementById('grille-modal-error');
    const btnDelete    = document.getElementById('grille-btn-delete');

    function openModal(mode, data) {
        document.getElementById('grille-slot-id').value       = data.id       || '';
        document.getElementById('grille-slot-post-id').value  = data.postId   || '';
        document.getElementById('grille-emission-id').value   = data.emissionId || '';
        document.getElementById('grille-weekday').value       = data.weekday  !== undefined ? data.weekday : '';
        document.getElementById('grille-heure-debut').value   = data.heureDebut || '';
        document.getElementById('grille-heure-fin').value     = data.heureFin  || '';

        btnDelete.style.display = (mode === 'edit') ? 'inline-block' : 'none';
        errorBox.style.display  = 'none';
        modal.style.display     = 'flex';
        document.getElementById('grille-emission-id').focus();
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    overlay.addEventListener('click', closeModal);
    document.getElementById('grille-btn-cancel').addEventListener('click', closeModal);

    // Fermeture au clavier (Escape)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });

    // ── Bouton Enregistrer ────────────────────────────────────────────────────

    document.getElementById('grille-btn-save').addEventListener('click', function () {
        const emissionId  = document.getElementById('grille-emission-id').value;
        const weekday     = document.getElementById('grille-weekday').value;
        const heureDebut  = document.getElementById('grille-heure-debut').value;
        const heureFin    = document.getElementById('grille-heure-fin').value;
        const slotId      = document.getElementById('grille-slot-id').value;
        const postId      = document.getElementById('grille-slot-post-id').value;

        if (!emissionId || !heureDebut || !heureFin) {
            showError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        ajaxSaveSlot(
            { emissionId, weekday, heureDebut, heureFin, slotId, postId },
            function (saved) {
                const emission = GrilleData.emissions.find(function(e) {
                    return e.id == saved.emissionId;
                });

                if (slotId) {
                    // Mise à jour d'un event existant
                    const existing = calendar.getEventById(slotId);
                    if (existing) existing.remove();
                }

                // Ajout (ou re-ajout) de l'event avec les données sauvegardées
                calendar.addEvent({
                    id:          'slot-' + saved.postId,
                    title:       emission ? emission.title : 'Émission',
                    daysOfWeek:  [parseInt(saved.weekday, 10)],
                    startTime:   saved.heureDebut + ':00',
                    endTime:     saved.heureFin   + ':00',
                    color:       emission ? emission.color : '#999999',
                    extendedProps: {
                        emissionId: saved.emissionId,
                        postId:     saved.postId,
                    },
                });

                closeModal();
            },
            showError
        );
    });

    // ── Bouton Supprimer ──────────────────────────────────────────────────────

    btnDelete.addEventListener('click', function () {
        const postId = document.getElementById('grille-slot-post-id').value;
        const slotId = document.getElementById('grille-slot-id').value;

        if (!confirm('Supprimer ce créneau définitivement ?')) return;

        ajaxDeleteSlot(
            postId,
            function () {
                const existing = calendar.getEventById(slotId);
                if (existing) existing.remove();
                closeModal();
            },
            showError
        );
    });

    // ── Affichage d'erreur modal ──────────────────────────────────────────────

    function showError(msg) {
        errorBox.textContent    = msg;
        errorBox.style.display  = 'block';
    }

    // ── AJAX helpers ─────────────────────────────────────────────────────────

    function ajaxPost(action, data, onSuccess, onError) {
        const body = new URLSearchParams(Object.assign({ action: action, nonce: GrilleData.nonce }, data));
        fetch(GrilleData.ajaxUrl, { method: 'POST', body: body })
            .then(function (r) { return r.json(); })
            .then(function (json) {
                if (json.success) {
                    if (onSuccess) onSuccess(json.data);
                } else {
                    if (onError) onError(json.data || 'Une erreur est survenue.');
                }
            })
            .catch(function () {
                if (onError) onError('Erreur réseau.');
            });
    }

    function ajaxSaveSlot(data, onSuccess, onError) {
        ajaxPost('grille_save_slot', data, onSuccess, onError);
    }

    function ajaxUpdateSlot(data, onSuccess, onError) {
        ajaxPost('grille_update_slot', data, onSuccess, onError);
    }

    function ajaxDeleteSlot(postId, onSuccess, onError) {
        ajaxPost('grille_delete_slot', { postId: postId }, onSuccess, onError);
    }
});
```

---

### 4. Handlers AJAX (`class-grille-ajax.php`)

Trois actions AJAX. Toutes protégées par :
```php
check_ajax_referer('grille_nonce', 'nonce');
if (!current_user_can('edit_posts')) { wp_send_json_error('Accès refusé.'); }
```

Enregistrement des hooks :
```php
add_action('wp_ajax_grille_save_slot',   [$this, 'save_slot']);
add_action('wp_ajax_grille_update_slot', [$this, 'update_slot']);
add_action('wp_ajax_grille_delete_slot', [$this, 'delete_slot']);
```

---

#### `grille_save_slot`

Crée ou met à jour un post `grille_slot`.

**Paramètres POST :** `emissionId`, `weekday`, `heureDebut`, `heureFin`, `postId` (vide = création)

**Validation (rejeter avec `wp_send_json_error` si invalide) :**
- `weekday` ∈ `[0, 6]` (entier)
- `heureDebut` et `heureFin` correspondent à `/^\d{2}:\d{2}$/`
- `heureFin` > `heureDebut`
- `emissionId` est un post de type `emission` avec status `publish`

**Logique :**
```php
// Création
$post_id = wp_insert_post([
    'post_type'   => 'grille_slot',
    'post_status' => 'publish',
    'post_title'  => sanitize_text_field($emission->post_title),
]);

// Mise à jour (si postId fourni et valide)
wp_update_post(['ID' => $post_id, 'post_title' => $emission->post_title]);

// Champs meta
update_post_meta($post_id, 'weekday',     (int) $weekday);
update_post_meta($post_id, 'heure_debut', sanitize_text_field($heure_debut));
update_post_meta($post_id, 'heure_fin',   sanitize_text_field($heure_fin));
update_post_meta($post_id, 'emission_id', (int) $emission_id);
```

**Retourne :**
```json
{
    "postId":     7,
    "weekday":    1,
    "heureDebut": "08:00",
    "heureFin":   "09:00",
    "emissionId": 42
}
```

---

#### `grille_update_slot`

Mise à jour partielle (drag & drop / resize). Pas de changement d'émission.

**Paramètres POST :** `postId`, `weekday`, `heureDebut`, `heureFin`

**Validation :** identique à `grille_save_slot` (sauf `emissionId`).
Vérifier que le post existe et est de type `grille_slot`.

**Retourne :** `{ "success": true }`

---

#### `grille_delete_slot`

**Paramètres POST :** `postId`

**Logique :**
```php
$post = get_post((int) $post_id);
if (!$post || $post->post_type !== 'grille_slot') {
    wp_send_json_error('Créneau introuvable.');
}
wp_delete_post((int) $post_id, true); // true = suppression définitive
wp_send_json_success();
```

**Retourne :** `{ "success": true }`

---

### 5. Exposition WPGraphQL (`class-grille-graphql.php`)

Hook d'enregistrement : `graphql_register_types`.

#### Champs sur le type `GrilleSlot`

```php
register_graphql_fields('GrilleSlot', [
    'weekday' => [
        'type'        => 'Int',
        'description' => 'Jour de la semaine (0=dimanche, 1=lundi, …, 6=samedi)',
        'resolve'     => function($post) {
            return (int) get_post_meta($post->ID, 'weekday', true);
        },
    ],
    'heureDebut' => [
        'type'        => 'String',
        'description' => 'Heure de début au format HH:MM',
        'resolve'     => function($post) {
            return get_post_meta($post->ID, 'heure_debut', true) ?: null;
        },
    ],
    'heureFin' => [
        'type'        => 'String',
        'description' => 'Heure de fin au format HH:MM',
        'resolve'     => function($post) {
            return get_post_meta($post->ID, 'heure_fin', true) ?: null;
        },
    ],
    'emission' => [
        'type'        => 'Emission',
        'description' => 'Émission associée à ce créneau',
        'resolve'     => function($post) {
            $emission_id = (int) get_post_meta($post->ID, 'emission_id', true);
            if (!$emission_id) return null;
            $emission = get_post($emission_id);
            if (!$emission || $emission->post_status !== 'publish') return null;
            return $emission;
        },
    ],
]);
```

#### Query racine `grilleSlots`

```php
register_graphql_field('RootQuery', 'grilleSlots', [
    'type'        => ['list_of' => 'GrilleSlot'],
    'description' => 'Créneaux de la grille hebdomadaire, optionnellement filtrés par jour.',
    'args'        => [
        'weekday' => [
            'type'        => 'Int',
            'description' => 'Filtrer par jour (0=dimanche … 6=samedi)',
        ],
    ],
    'resolve' => function($root, $args) {
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
```

**Queries GraphQL disponibles côté Next.js :**

```graphql
# Tous les créneaux
query GetGrille {
    grilleSlots {
        id
        weekday
        heureDebut
        heureFin
        emission {
            id
            title
            slug
            uri
            featuredImage { node { sourceUrl altText } }
        }
    }
}

# Créneaux d'un jour précis
query GetGrilleJour {
    grilleSlots(weekday: 1) {
        id
        weekday
        heureDebut
        heureFin
        emission { title uri }
    }
}
```

---

## Ce qu'il ne faut pas faire

- **Ne pas utiliser ACF** pour les champs du créneau — `register_post_meta()` natif uniquement.
- **Ne pas utiliser `add_submenu_page`** — créer un `add_menu_page` de premier niveau.
- **Ne pas afficher le CPT dans les listes admin** (`show_ui: false`, `show_in_nav_menus: false`).
- **Ne pas exposer le CPT via l'API REST** (`show_in_rest: false`).
- **Ne pas charger FullCalendar sur toutes les pages admin** — vérifier strictement `$hook === 'toplevel_page_hope-radio-grille'` dans `admin_enqueue_scripts`.
- **Ne pas utiliser l'ancien bundle jQuery de FullCalendar** (v3) — utiliser exclusivement le standard bundle v6 via CDN jsdelivr.
- **Ne pas utiliser `date` ou `start`/`end` ISO pour les events récurrents** — utiliser `daysOfWeek` + `startTime` + `endTime` (format FullCalendar recurring).
- **Ne pas stocker `weekday` en string** (`"lundi"`) en base de données — stocker l'entier `0-6` via `update_post_meta`.
- **Ne pas créer de table SQL custom** — utiliser le CPT + post meta WordPress standard.
- **Ne pas modifier `functions.php`** au-delà d'un seul `require_once` vers `grille/grille.php`.
- **Ne pas écrire de styles dans `style.css`** du thème — uniquement dans `grille/assets/css/grille-admin.css`.
- **Ne pas oublier `wp_die()` après `wp_send_json_success()` / `wp_send_json_error()`** dans les handlers AJAX (requis par WordPress — bien que `wp_send_json_*` appelle déjà `die()` internement depuis WP 4.7, le mentionner évite les doutes).
- **Ne pas appeler `calendar.render()` avant que le DOM soit prêt** — toujours dans `DOMContentLoaded`.
- **Ne pas utiliser `jQuery.ajax`** pour les requêtes AJAX — utiliser l'API `fetch` native (WordPress admin l'embarque depuis IE11 est abandonné).
- **Ne pas gérer les chevauchements sans `eventOverlap: false`** — la radio ne peut pas diffuser deux émissions simultanément sur le même créneau.

---

## Critères de validation

- [ ] La page "Grille" apparaît dans le menu admin WordPress avec l'icône `dashicons-schedule`
- [ ] FullCalendar s'affiche en vue `timeGridWeek` sans navigation de date (`headerToolbar: false`)
- [ ] Les créneaux existants sont chargés et visibles au rendu initial
- [ ] Dessiner une plage vide ouvre le modal avec `weekday` et horaires pré-remplis
- [ ] Le select "Émission" liste tous les posts `emission` publiés
- [ ] Enregistrer un créneau l'ajoute au calendrier sans rechargement de page (via `calendar.addEvent`)
- [ ] Modifier une émission dans le modal met à jour l'event existant (remove + addEvent)
- [ ] Drag & drop sauvegarde silencieusement et annule le déplacement si l'AJAX échoue (`info.revert()`)
- [ ] Resize sauvegarde silencieusement et annule le resize si l'AJAX échoue (`info.revert()`)
- [ ] Clic sur un créneau ouvre le modal en mode édition avec toutes les données pré-remplies
- [ ] Supprimer un créneau le retire du calendrier (`event.remove()`) et le supprime en base
- [ ] Deux créneaux ne peuvent pas se chevaucher (`eventOverlap: false`)
- [ ] La query GraphQL `grilleSlots` retourne tous les créneaux avec l'objet `emission` résolu
- [ ] La query `grilleSlots(weekday: 1)` filtre correctement sur le lundi
- [ ] Aucun asset FullCalendar n'est chargé sur les autres pages admin