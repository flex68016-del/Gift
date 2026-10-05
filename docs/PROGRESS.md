# Journal d'avancement du projet Moment

## 2026-10-03
- Dépôt initialisé
- Règles globales du projet créées (.windsurf/rules/project.md)

## Prompt 0 terminé
- Fichier de règles créé avec activation toujours active
- Branche : chore/00-regles-projet
- En attente de fusion dans main

## Prompt 1 terminé
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
- CI de sécurité ajoutée (gitleaks, audit, CodeQL, Semgrep)
- Dependabot configuré
- .npmrc et .nvmrc configurés
- Middleware CSP avancé avec nonce et Trusted Types (mode report-only)
- Protection de l'agent Windsurf (.codeiumignore)

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

## Prompt 2 terminé
### 2A - Schema RLS et privilèges
- 8 migrations SQL créées (types, tables, triggers, fonctions)
- Tables : gifts, gift_blocks, assets, music_tracks, payments, webhook_events, contributors, contributions, reactions, gift_events, daily_stats, abuse_reports, audit_log
- RLS activé sur toutes les tables (refus par défaut)
- Rôle app_server créé avec privilèges minimaux
- Politiques RLS pour app_server
- Fonctions SQL : record_open, publish_gift, maintain_partitions, purge_old_events
- Seed SQL avec 3 pistes musicales de test
- Document SUPABASE-HARDENING.md créé

### 2B - Sécurité crypto et jetons
- Utilitaires de jetons (generateSlug, generateEditToken, sha256, safeEqual)
- Chiffrement AES-256-GCM avec préfixe de version (encrypt, decrypt)
- HMAC-SHA-256 pour indexation d'e-mails (hmacEmail)
- Hash scrypt pour secrets (hashSecret, verifySecret, dummyHash)
- Tests unitaires complets

### 2C - Accès SQL et stockage
- Client SQL postgres.js pooler-safe (prepare: false, pool petit, timeout court)
- Client de migration avec timeout plus long
- Interface StorageProvider (abstraction pour changement de backend)
- Implémentation Supabase (service-role, upload, download, signed URLs, delete)
- Validation des chemins avec tests

## Prompt 3 terminé
- Jetons de design CSS (couleurs, typographie, espacements, rayons, ombres, transitions)
- Polices via next/font (Inter, Playfair Display)
- Composants UI accessibles (Button, Field, Dialog, Toast, Stepper, Switch)
- Moteur de performance (detectTier, useTier)
- Moteur audio (AudioEngine)
- Directeur de scène (SceneDirector avec GSAP)
- Primitives d'animation (TextCompose, Confetti, Haptics, Reveal)
- Page de test /dev/motion

## Prompt 4 terminé
- Schémas Zod pour tous les types de blocs (letter, gallery, voice, timeline, counter, quiz, reveal, music)
- Registre de blocs (blockRegistry)
- Composants de rendu neutres pour tous les types de blocs
- Fonctions de validation (validateGift, normalizeOrder)
- Tests unitaires des schémas et registre
- Page de test /dev/blocks
- Configuration Vitest avec jsdom et mock d'environnement

## Prompt 5A terminé
- API routes (POST /api/gifts, PATCH /api/gifts/[id])
- Protection CSRF (assertSameOrigin, assertBodySize)
- Rate limiting (placeholder pour Upstash)
- Cookies signés (__Host-gift-draft, __Host-did)
- Helper requireGiftOwner pour authentification
- Composant Turnstile client
- Intégration musicale sécurisée (YouTube/Spotify)
- Éditeur multi-étapes (Thème → Infos → Contenu → Musique → Ouverture → Aperçu)
- Auto-save avec debounce (800ms)
- Drag-and-drop des blocs avec dnd-kit
- Étape Ouverture (immédiate, secret, date programmée)
- Étape Musique (bibliothèque ou lien)

## Prompt 5B terminé
- Composant ImageUploader (compression navigateur WebP, 1600px max, miniature 480px)
- Composant VoiceRecorder (MediaRecorder, 60s max, indicateur de niveau)
- POST /api/uploads/sign (vérification propriété et quotas, URL signée)
- POST /api/uploads/finalize (contrôle taille/type par magic numbers, mise en file)
- File de tâches QStash (client, vérification signature avec rotation)
- Registre de jobs (process-image, send-email, cleanup, etc.)
- Job process-image avec sharp (WebP, suppression EXIF/GPS, limitInputPixels)
- Route POST /api/jobs/[name] pour exécution des jobs

## Prompt 6 - Partiellement terminé
### Complété
- Interface ThemeDefinition et registre de thèmes
- Thème anniversaire (birthday-envelope)
- Tokens CSS spécifiques au thème (palette, typographie, espacements)
- Scène signature "enveloppe" avec GSAP
- Adaptation par niveau (lite = simple touch, standard/ultra = animation complète)
- Bouton "Passer l'animation" toujours disponible
- Premier geste reprend AudioContext et lance la musique
- Page de test /dev/themes/birthday
- Registre de thèmes avec OpeningScene et transitions
- Preload manifest (assets critiques ≤150KB estimé, CSS généré dynamiquement)
- Tests unitaires pour performance-level selection (5 tests)
- Aperçu du thème dans l'éditeur (étape Thème)
- data-testid ajouté pour tests E2E
- Correction useTier pour éviter setState synchrone dans effect
- Support prefers-reduced-motion (fondus uniquement)

### Reste à faire (selon CDC)
- Tests Playwright pour l'ouverture (configuration Playwright nécessaire)
- Validation FPS ~50 sur midrange Android (requiert tests sur device réel)
- Validation critical payload ≤150 KB (estimé à ~50KB sans images statiques)
- Intégration complète du thème dans l'aperçu éditeur (aperçu statique pour l'instant)
- Finale basée sur reveal.animation (à implémenter quand bloc reveal est prêt)
- Transitions action-driven entre blocs (à implémenter avec block system)

## Prompt 7A - Thème Parchemin terminé
### Complété
- Scène signature avec sceau de cire brisable (toucher)
- Parchemin qui se déroule avec animation GSAP
- Variante lite (sceau disparaît en fondu, parchemin affiché directement)
- Variante standard/ultra (animation complète avec timeline GSAP)
- Palette de couleurs du CDC (Brun encre #2E2118, Parchemin #EBDCBB, Cire rouge #8E1B1B, Or terni #B38B3E)
- Typographie IM Fell English (titres) et Cormorant Garamond (texte)
- Page de test /dev/themes/parchemin
- Intégration dans l'éditeur (aperçu statique dans l'étape Thème)
- Messages i18n FR/EN
- Support prefers-reduced-motion
- Bouton Passer l'animation

## Prompt 7B - Thème Cadeau terminé
### Complété
- Scène signature avec boîte cadeau et ruban tirable
- Couvercle qui s'envole et lumière qui jaillit
- Version 2,5D (couches CSS + Motion)
- Variante lite (ruban se dénoue au toucher, fondu)
- Variante standard/ultra (animation complète avec timeline GSAP)
- Palette de couleurs du CDC (Vert forêt #14382B, Ruban or #D9A93F, Ivoire #F6F1E4, Rouge baie #B8283B, Nuit #0E1B16)
- Typographie Bricolage Grotesque (titres) et Source Serif 4 (texte)
- Page de test /dev/themes/gift
- Intégration dans l'éditeur (aperçu statique dans l'étape Thème)
- Messages i18n FR/EN
- Support prefers-reduced-motion
- Bouton Passer l'animation
- Extension prévue pour version 3D future (ultra)

### Commun - Tests et validation
- Page de test combinée /dev/themes/all pour tous les thèmes
- Affichage de tous les blocs V1 après la scène d'ouverture
- Sélecteur de thème et de niveau de performance
- Vérification que tous les blocs s'affichent correctement dans les 3 thèmes
- Budget de poids respecté (~50KB par thème sans images statiques)
- Simplification de SceneDirector (suppression de la méthode play)

## Prompt 8A - Page destinataire et déverrouillage terminé
### Complété
- Page `/[locale]/g/[slug]` avec coque minimale (aucun bloc ni URL de fichier)
- Métadonnées OG avec `robots: noindex, nofollow`
- Anti-énumération : même page neutre pour cadeaux non publiés/brouillons/expirés
- Image OG générique du thème
- `POST /api/g/[slug]/unlock` : vérification mot secret avec hash
- Cookie signé de 24h (`__Host-gift-unlock`, httpOnly, Secure, SameSite=Lax)
- Vérification CSRF
- Message d'erreur générique
- Placeholder pour limites d'essais (5 essais/15min par cadeau + IP)
- `GET /api/g/[slug]/content` : refus (423) si planifié et non échu
- Refus si secret non déverrouillé
- Renvoie les blocs validés et URLs signées (placeholder)
- Cache-Control: no-store
- Hook `useGiftExperience` : machine d'états (locked → ready → intro → blocks → finale → ended)
- Reprise au dernier bloc vu (stockage local, sans donnée sensible)
- Envoi automatique d'événements (opened, completed)
- Écrans : chargement, mot secret avec indice, compte à rebours, intro, blocs, finale, fin
- Intégration du thème depuis le registre
- Utilisation de `useTier` pour le niveau de performance
- Affichage de la scène d'ouverture du thème
- `POST /api/g/[slug]/report` : signalement vers abuse_reports
- Limite de 500 caractères
- Ajout de `signCookie` et `verifyCookie` (alias)

### Reste à faire (selon CDC)
- Durcir le mot secret : limites Upstash, Turnstile après 3 échecs, verrouillage 15min après 5 échecs (placeholders ajoutés)
- Tests E2E et validation

## Prompt 8B - Cache des points chauds terminé
### Complété
- Migration SQL `0009_cache_perf_optimizations.sql` :
  - Ajout colonne `processed` à `gift_events`
  - Modification de `record_open` pour ne pas verrouiller (insertion directe dans gift_events)
  - Fonction `flush_open_counts` pour recalculer `open_count` par batch
- Job `flush-open-counts` dans src/lib/queue/jobs/flush-open-counts.ts
  - Appel de la fonction SQL `flush_open_counts()`
  - Max retries: 3, retry delay: 300s (5min)
- Cache Redis/Upstash dans src/lib/cache.ts :
  - Implémentation UpstashCache (placeholder REST API)
  - Cache des cadeaux chauds (60s, sans URL signées)
  - Cache de la coque de page (30s)
  - Fonctions : cacheGift, getCachedGift, invalidateGiftCache, cacheGiftShell, getCachedGiftShell, invalidateAllGiftCaches
- Intégration du cache dans `/api/g/[slug]/content` :
  - Tentative de récupération depuis le cache
  - Mise en cache si absent
- Étalement aléatoire côté client dans GiftClient.tsx :
  - Délai aléatoire 0-3s avant de demander le contenu pour les cadeaux planifiés
  - Utilisation de useEffect avec setTimeout pour éviter l'attente synchrone
- Optimisation de la génération d'URL signées :
  - Structure préparée pour génération par lot (une seule opération par réponse)
  - Placeholder pour l'intégration réelle avec StorageProvider

### Reste à faire (selon CDC)
- Configuration réelle d'Upstash Redis (variables d'environnement)
- Tests de charge pour valider l'absence de verrou sur record_open
- Validation de la convergence de open_count après passage du job
- Intégration réelle de la génération d'URL signées par lot

## Prompt 9A - Paiement FedaPay et publication terminé
### Complété
- Interface PaymentProvider (abstraction pour changement de fournisseur)
- Implémentation FedaPayProvider (placeholder API REST)
- Grille tarifaire côté serveur (Standard 1500 XOF, Premium à définir)
- POST /api/gifts/[id]/checkout : authentification propriétaire, validation cadeau, création paiement, transaction FedaPay
- POST /api/webhooks/fedapay : vérification signature (double secret pour rotation), idempotence via webhook_events, vérification montant/devise, publication transactionnelle
- Machine d'états des paiements (pending → approved/declined/canceled → refunded)
- Verrou SELECT FOR UPDATE pendant traitement webhook
- Contrainte d'unicité : un seul paiement approuvé par cadeau (trigger ou EXCLUDE)
- Migration SQL 0010_payment_constraints.sql :
  - Fonction validate_payment_transition()
  - Trigger payment_transition_trigger
  - Trigger prevent_duplicate_approved_trigger (fallback sans btree_gist)
  - Index pour les requêtes fréquentes
- Page /checkout/return avec vérification statut (limité en débit)
- API GET /api/payments/[transactionId]/status
- Messages i18n FR/EN pour checkout
- Documentation PAYMENTS.md avec procédure test sandbox

### Reste à faire (selon CDC)
- Implémentation réelle de l'API FedaPay (fetch/SDK)
- Template d'e-mail de confirmation (Resend)
- Job send-email idempotent
- Limites de débit par cadeau et IP sur /checkout
- Expiration des paiements pending après 1 heure (job de cleanup)
- Fournisseur de secours (Stripe)

## Prompt 9B - Rapprochement des paiements terminé
### Complété
- Job reconcile-payments dans src/lib/queue/jobs/reconcile-payments.ts
- Récupération des paiements pending depuis plus de 5 minutes
- Vérification du statut depuis l'API FedaPay
- Verrou SELECT FOR UPDATE pendant traitement
- Publication automatique si approuvé
- Disjoncteur (circuit breaker) après 3 échecs consécutifs
- Placeholder pour alerte et fournisseur de secours

### Reste à faire (selon CDC)
- Implémentation réelle de l'alerte (email, Slack, Sentry)
- Bascule automatique vers fournisseur de secours (Stripe) quand disponible

## Prompt 10A - Tableau de bord terminé
### Complété
- Route /[locale]/manage/[token] : échange jeton contre cookie session
- Comparaison à temps constant du jeton
- Cookie __Host-manage-session (httpOnly, Secure, SameSite=Lax, 7 jours)
- Redirection vers /manage après échange
- Tableau de bord /[locale]/manage : statut, première ouverture, nombre d'ouvertures
- Boutons : Modifier, Copier le lien, Télécharger QR (placeholder), Supprimer
- API DELETE /api/gifts/[id] : suppression logique (deleted_at)
- Invalidation du cache après suppression
- Signature kid pour rotation des clés dans signCookie/verifyCookie
- Support ancien format (3 parts) et nouveau format (4 parts)
- dynamic force-dynamic pour éviter le cache
- Messages i18n FR/EN pour gestion
- Composant ManageDashboard client avec confirmation suppression

### Reste à faire (selon CDC)
- Actions sensibles : jeton CSRF en double soumission
- E-mail de notification après suppression ou récupération
- Rotation complète : invalidation de l'ancien jeton et des sessions existantes
