# SECURITY.md

> Liste des problèmes de sécurité identifiés mais non corrigés immédiatement (dette de sécurité à traiter plus tard).
> Chaque entrée : date, fichier(s), problème, correctif proposé, statut.

---

## À traiter

### 2026-09-11 — XSS potentiel via `dangerouslySetInnerHTML` (contenu WordPress)

- **Fichiers concernés** :
  - `frontend/components/emissions/EmissionDetail.tsx`
  - `frontend/components/actualites/ArticleDetail.tsx`
  - `frontend/app/[...slug]/page.tsx`
  - `frontend/lib/wpBlockContent.tsx` (découpe `content` en segments, chaque segment HTML étant ensuite passé à `dangerouslySetInnerHTML` par l'appelant)
  - `frontend/components/equipe/AnimateurModal.tsx` (champ ACF `bio`, wysiwyg — popup animateur du bloc équipe)
- **Problème** : le HTML issu de WordPress (`content`/`bio`) est injecté tel quel via `dangerouslySetInnerHTML`, sans sanitization. Si un compte admin WordPress est compromis (ou si du contenu tiers non fiable est un jour intégré via ce champ), du JS arbitraire pourrait s'exécuter côté client.
- **Contexte / risque actuel** : contenu saisi uniquement par les administrateurs via l'éditeur Gutenberg / champs ACF wysiwyg (back-office de confiance) — risque jugé faible en l'état, mais pas nul (défense en profondeur recommandée).
- **Correctif proposé** : sanitizer le HTML avant rendu avec `isomorphic-dompurify` :
  ```ts
  import DOMPurify from 'isomorphic-dompurify';
  // ...
  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
  ```
  Appliquer aux quatre fichiers listés ci-dessus.
- **Statut** : ⏳ non corrigé — à traiter plus tard.

---

## Corrigé

_(déplacer ici les entrées une fois traitées, avec la date de correction)_

### 2026-09-11 — XSS via schéma d'URL non validé (`frontend/components/equipe/AnimateurModal.tsx`)

- **Problème** : les liens réseaux sociaux de l'animateur (champs ACF `url`) étaient rendus tels quels dans un `href`, sans validation du schéma — un admin saisissant `javascript:...` aurait pu injecter du JS exécuté au clic.
- **Correctif appliqué** : fonction `safeHttpUrl()` qui ne laisse passer que les URLs `http:`/`https:` avant de générer le lien ; les autres sont filtrées (lien non affiché).
- **Date de correction** : 2026-09-11.
