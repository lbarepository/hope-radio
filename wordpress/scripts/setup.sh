#!/bin/bash
# setup.sh — Installation initiale de WordPress en local
# Usage : docker compose --profile tools run wpcli bash /scripts/setup.sh

set -e

WP="wp --allow-root --path=/var/www/html"

echo "⏳ Attente de WordPress..."
until $WP core is-installed 2>/dev/null; do
  sleep 2
done

echo "✅ WordPress détecté, configuration en cours..."

# ── Installation de base ──────────────────────────────────────────────────────
$WP core install \
  --url="http://localhost:8080" \
  --title="Radio - Dev" \
  --admin_user="admin" \
  --admin_password="admin" \
  --admin_email="dev@radio.local" \
  --skip-email

# ── Langue ────────────────────────────────────────────────────────────────────
$WP language core install fr_FR
$WP site switch-language fr_FR

# ── Thème : activer le thème hope-radio ─────────────────────────────────────────
$WP theme activate hope-radio

# ── Plugins essentiels ────────────────────────────────────────────────────────
echo "📦 Installation des plugins..."

# WPGraphQL (indispensable pour l'API)
$WP plugin install wp-graphql --activate

# Faust.js plugin (découplage WordPress/Next.js)
$WP plugin install faustwp --activate

# Advanced Custom Fields (pour les métadonnées : flux audio, réseaux sociaux, etc.)
$WP plugin install advanced-custom-fields --activate

# ACF to WPGraphQL (expose les champs ACF dans l'API GraphQL)
$WP plugin install wpgraphql-acf --activate

# Yoast SEO (optionnel mais souvent demandé)
$WP plugin install wordpress-seo --activate

# ── Réglages WordPress ────────────────────────────────────────────────────────
echo "⚙️  Configuration des réglages..."

# Permaliens : structure propre pour l'API
$WP rewrite structure '/%postname%/'
$WP rewrite flush

# Désactiver les commentaires (inutiles pour une radio)
$WP option update default_comment_status closed
$WP option update default_ping_status closed

# Fuseau horaire
$WP option update timezone_string "Europe/Paris"

# ── Clé secrète Faust.js ─────────────────────────────────────────────────────
$WP option update faustwp_settings '{"secret_key":"dev-secret-key-change-in-prod","frontend_uri":"http://localhost:3000","menu_locations":""}' --format=json

# ── CORS : autoriser Next.js à appeler l'API ──────────────────────────────────
$WP option update graphql_general_settings '{"public_introspection_enabled":"on","batch_queries_enabled":"on","batch_limit":"10","query_depth_enabled":"off"}' --format=json

# ── Contenu de démonstration ──────────────────────────────────────────────────
echo "📝 Création de contenu de démo..."

# Page d'accueil
$WP post create \
  --post_type=page \
  --post_title="Accueil" \
  --post_status=publish \
  --post_content="Page d'accueil de la radio."

# Quelques émissions de test
for title in "Le Morning" "L'Après-midi" "La Soirée"; do
  $WP post create \
    --post_type=emission \
    --post_title="$title" \
    --post_status=publish \
    --post_content="Description de l'émission $title."
done

echo ""
echo "🎉 Installation terminée !"
echo ""
echo "  WordPress admin : http://localhost:8080/wp-admin"
echo "  Login           : admin / admin"
echo "  GraphQL API     : http://localhost:8080/graphql"
echo "  Next.js         : http://localhost:3000"
echo ""