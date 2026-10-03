# Journal d'avancement du projet Moment

## 2026-10-03
- Dépôt initialisé
- Règles globales du projet créées (.windsurf/rules/project.md)

## Prompt 0 terminé
- Fichier de règles créé avec activation toujours active
- Branche : chore/00-regles-projet
- En attente de fusion dans main

## Prompt 1 en cours
- Next.js initialisé avec TypeScript strict, Tailwind, ESLint
- Dépendances installées : zod, next-intl, Supabase, Prettier, Vitest, Playwright
- Scripts configurés : dev, build, typecheck, lint, test, e2e
- Validation des variables d'environnement (src/lib/env.ts)
- next-intl configuré (routes fr/en, middleware, messages)
- En-têtes de sécurité dans middleware
- Arborescence du projet créée
- CI GitHub Actions basique (typecheck, lint, test)
- Documents de sécurité créés : THREAT-MODEL.md, SECURITY-CHECKLIST.md, SECURITY.md
- .well-known/security.txt créé
- .codeiumignore créé (exclusion des fichiers de secrets)
- CODEOWNERS créé

## Actions manuelles pour moi
1. Protection de la branche main sur GitHub :
   - Activer "Require pull request before merging"
   - Activer "Require status checks to pass before merging"
   - Cocher : typecheck, lint, test
   - Désactiver "Allow administrators to bypass"
   - Activer "Do not allow bypassing the above settings"
   - Activer "Require branches to be up to date before merging"
   - Désactiver "Allow force pushes" sur main
2. Secret scanning avec push protection sur GitHub
3. Double authentification (2FA/MFA) activée sur :
   - GitHub
   - Vercel (quand configuré)
   - Supabase (quand configuré)
   - FedaPay (quand configuré)
