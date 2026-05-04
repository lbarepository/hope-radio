document.addEventListener('DOMContentLoaded', function () {

    // ── Populer le select des émissions ──────────────────────────────────────
    var selectEmission = document.getElementById('grille-emission-id');
    GrilleData.emissions.forEach(function (em) {
        var opt = document.createElement('option');
        opt.value       = em.id;
        opt.textContent = em.title;
        selectEmission.appendChild(opt);
    });

    // ── Convertir les slots WP en events FullCalendar ────────────────────────
    var initialEvents = GrilleData.slots.map(function (slot) {
        return {
            id:          slot.id,
            title:       slot.title,
            daysOfWeek:  [parseInt(slot.weekday, 10)],
            startTime:   slot.heureDebut + ':00',
            endTime:     slot.heureFin   + ':00',
            color:       slot.color,
            extendedProps: {
                emissionId: slot.emissionId,
                postId:     slot.postId,
            },
        };
    });

    // ── Initialisation FullCalendar ───────────────────────────────────────────
    var calendarEl = document.getElementById('grille-calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale:            'fr',
        initialView:       'timeGridWeek',
        allDaySlot:        false,
        slotMinTime:       '05:00:00',
        slotMaxTime:       '24:00:00',
        slotDuration:      '00:15:00',
        slotLabelInterval: '01:00:00',
        height:            'auto',
        selectable:        true,
        editable:          true,
        eventOverlap:      false,
        headerToolbar:     false,
        events:            initialEvents,

        select: function (info) {
            openModal('create', {
                weekday:    info.start.getDay(),
                heureDebut: formatTime(info.start),
                heureFin:   formatTime(info.end),
            });
            calendar.unselect();
        },

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

        eventDrop: function (info) {
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

    function formatTime(date) {
        return date.toTimeString().slice(0, 5);
    }

    // ── Modal ─────────────────────────────────────────────────────────────────

    var modal     = document.getElementById('grille-modal');
    var overlay   = document.getElementById('grille-modal-overlay');
    var errorBox  = document.getElementById('grille-modal-error');
    var btnDelete = document.getElementById('grille-btn-delete');

    function openModal(mode, data) {
        document.getElementById('grille-slot-id').value      = data.id        || '';
        document.getElementById('grille-slot-post-id').value = data.postId    || '';
        document.getElementById('grille-emission-id').value  = data.emissionId || '';
        document.getElementById('grille-weekday').value      = data.weekday !== undefined ? data.weekday : '';
        document.getElementById('grille-heure-debut').value  = data.heureDebut || '';
        document.getElementById('grille-heure-fin').value    = data.heureFin   || '';

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

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
    });

    // ── Bouton Enregistrer ────────────────────────────────────────────────────

    document.getElementById('grille-btn-save').addEventListener('click', function () {
        var emissionId = document.getElementById('grille-emission-id').value;
        var weekday    = document.getElementById('grille-weekday').value;
        var heureDebut = document.getElementById('grille-heure-debut').value;
        var heureFin   = document.getElementById('grille-heure-fin').value;
        var slotId     = document.getElementById('grille-slot-id').value;
        var postId     = document.getElementById('grille-slot-post-id').value;

        if (!emissionId || !heureDebut || !heureFin) {
            showError('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        ajaxSaveSlot(
            { emissionId: emissionId, weekday: weekday, heureDebut: heureDebut, heureFin: heureFin, slotId: slotId, postId: postId },
            function (saved) {
                var emission = GrilleData.emissions.find(function (e) {
                    return e.id == saved.emissionId;
                });

                if (slotId) {
                    var existing = calendar.getEventById(slotId);
                    if (existing) existing.remove();
                }

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
        var postId = document.getElementById('grille-slot-post-id').value;
        var slotId = document.getElementById('grille-slot-id').value;

        if (!confirm('Supprimer ce créneau définitivement ?')) return;

        ajaxDeleteSlot(
            postId,
            function () {
                var existing = calendar.getEventById(slotId);
                if (existing) existing.remove();
                closeModal();
            },
            showError
        );
    });

    // ── Affichage d'erreur modal ──────────────────────────────────────────────

    function showError(msg) {
        errorBox.textContent   = msg;
        errorBox.style.display = 'block';
    }

    // ── AJAX helpers ──────────────────────────────────────────────────────────

    function ajaxPost(action, data, onSuccess, onError) {
        var body = new URLSearchParams(Object.assign({ action: action, nonce: GrilleData.nonce }, data));
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
