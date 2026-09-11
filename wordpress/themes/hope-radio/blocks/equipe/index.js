/**
 * Interface de saisie dans l'éditeur pour le bloc hope-radio/equipe.
 *
 * Le bloc ne propose qu'un titre de section : les animateurs sont
 * récupérés automatiquement (CPT Animateur), aucune sélection manuelle.
 * L'aperçu dans l'éditeur passe par ServerSideRender, qui appelle
 * render.php (placeholder — le vrai rendu du slider est fait par Next.js).
 */
(function (wp) {
	var registerBlockType = wp.blocks.registerBlockType;
	var el                = wp.element.createElement;
	var __                = wp.i18n.__;
	var useBlockProps      = wp.blockEditor.useBlockProps;
	var TextControl        = wp.components.TextControl;
	var ServerSideRender   = wp.serverSideRender;

	registerBlockType('hope-radio/equipe', {
		edit: function (props) {
			var attributes    = props.attributes;
			var setAttributes = props.setAttributes;
			var blockProps    = useBlockProps({ className: 'hope-radio-equipe-editor' });

			return el(
				'div',
				blockProps,
				el(TextControl, {
					label: __("Titre de la section", 'hope-radio'),
					value: attributes.titre,
					onChange: function (value) {
						setAttributes({ titre: value });
					},
				}),
				el(ServerSideRender, {
					block: 'hope-radio/equipe',
					attributes: attributes,
				})
			);
		},
		save: function () {
			// Bloc dynamique : le rendu est entièrement délégué à render.php (admin)
			// puis au composant Next.js correspondant (front).
			return null;
		},
	});
})(window.wp);
