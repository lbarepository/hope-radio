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
- **Problème** : le HTML issu de WordPress (`content`) est injecté tel quel via `dangerouslySetInnerHTML`, sans sanitization. Si un compte admin WordPress est compromis (ou si du contenu tiers non fiable est un jour intégré via ce champ), du JS arbitraire pourrait s'exécuter côté client.
- **Contexte / risque actuel** : contenu saisi uniquement par les administrateurs via l'éditeur Gutenberg (back-office de confiance) — risque jugé faible en l'état, mais pas nul (défense en profondeur recommandée).
- **Correctif proposé** : sanitizer le HTML avant rendu avec `isomorphic-dompurify` :
  ```ts
  import DOMPurify from 'isomorphic-dompurify';
  // ...
  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
  ```
  Appliquer aux trois fichiers listés ci-dessus.
- **Statut** : ⏳ non corrigé — à traiter plus tard.

---

## Corrigé

_(déplacer ici les entrées une fois traitées, avec la date de correction)_
