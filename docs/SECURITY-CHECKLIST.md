# Checklist de sécurité - Moment

Cette checklist doit être déroulée à la fin de chaque étape, sur le diff Git.

## Secrets

- [ ] Aucun secret dans le code (clés API, tokens, mots de passe)
- [ ] Aucun secret dans les journaux (console.log, logger)
- [ ] Aucun secret dans les erreurs affichées à l'utilisateur
- [ ] Aucun secret dans les URLs ou métadonnées
- [ ] `.env*` dans `.gitignore` et vérifié avec `git check-ignore`
- [ ] Seules les variables publiques (`NEXT_PUBLIC_*`) sont côté client

## Entrées validées

- [ ] Toutes les entrées utilisateur sont validées avec Zod côté serveur
- [ ] Schémas Zod utilisent `.strict()` pour rejeter les champs inconnus
- [ ] Listes blanches de champs (pas d'affectation de masse)
- [ ] Tailles maximales sur tous les champs texte
- [ ] Types MIME validés côté serveur (octets d'en-tête)
- [ ] URLs validées et reconstruites côté serveur

## Autorisations

- [ ] Le navigateur n'accède jamais directement aux tables de contenu
- [ ] Toute lecture/écriture passe par des Route Handlers ou Server Actions
- [ ] RLS activée sur toutes les tables
- [ ] Aucune politique pour `anon` et `authenticated` sur les tables de contenu
- [ ] Rôle `app_server` utilisé côté serveur, privilèges minimaux
- [ ] `service_role` uniquement dans `src/lib/storage/supabase.ts` avec `import "server-only"`

## Fuite avant déverrouillage

- [ ] Aucune donnée du cadeau envoyée avant déverrouillage
- [ ] L'heure du serveur fait foi (pas de vérification côté client)
- [ ] Slug aléatoire de 12 caractères base58 (≈ 70 bits)
- [ ] Réponses uniformes pour éviter l'énumération
- [ ] URL signées de 15 minutes pour les médias
- [ ] Cache-Control: no-store sur routes privées
- [ ] X-Robots-Tag: noindex sur routes privées

## RLS et privilèges

- [ ] FORCE ROW LEVEL SECURITY activé sur toutes les tables
- [ ] Privilèges retirés à `anon`, `authenticated` et `public`
- [ ] `alter default privileges` configuré pour futures tables
- [ ] Droits table par table sur `app_server` (pas de wildcard)
- [ ] Aucun `delete` sur `payments`, `webhook_events`, `audit_log`
- [ ] Fonctions en `security definer` avec `set search_path = ''`

## En-têtes de sécurité

- [ ] Strict-Transport-Security activé
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy configuré (strict-origin-when-cross-origin par défaut)
- [ ] Cross-Origin-Opener-Policy: same-origin
- [ ] Cross-Origin-Resource-Policy: same-site
- [ ] Permissions-Policy restrictif (microphone autorisé sur pages spécifiques)
- [ ] X-Powered-By désactivé
- [ ] CSP stricte à nonce (report-only en développement)

## Dépendances

- [ ] Versions exactes dans package.json
- [ ] `pnpm-lock.yaml` versionné
- [ ] Node version figé dans `.nvmrc`
- [ ] `ignore-scripts=true` dans `.npmrc`
- [ ] Aucune nouvelle dépendance sans vérification (mainteneur, vulnérabilités, licence)
- [ ] `pnpm audit --audit-level=high` passe

## Journaux

- [ ] Aucune donnée personnelle dans les journaux
- [ ] Événements de sécurité journalisés (échecs, accès)
- [ ] Aucun `console.log` en production
- [ ] Messages d'erreur génériques côté utilisateur
- [ ] Détails uniquement dans les journaux serveur

## Contrôle supplémentaire

- [ ] `pnpm typecheck` passe sans erreur
- [ ] `pnpm lint` passe sans erreur bloquante
- [ ] Tests unitaires passent (quand applicable)
- [ ] Aucun `any` ou `@ts-ignore` sans commentaire justifié
- [ ] Toutes les traductions dans `messages/fr.json` et `messages/en.json`
