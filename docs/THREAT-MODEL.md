# Modèle de menaces - Moment

Ce document identifie les menaces principales par actif, avec le risque, la parade et le test de vérification.

## Actif : Contenu des cadeaux (photos, textes, vocaux)

| Menace | Risque | Parade | Test de vérification |
|--------|--------|--------|---------------------|
| Lecture avant déverrouillage | Élevé | Coque minimale sans contenu, slug aléatoire de 12 caractères base58 (≈ 70 bits), réponses uniformes | Test RLS : anon ne peut pas lire gifts/gift_blocks/assets |
| Énumération de slugs | Moyen | Slug aléatoire, réponses uniformes, noindex, Cache-Control: no-store | Test : tentative de deviner des slugs |
| IDOR (Insecure Direct Object Reference) | Élevé | Privilèges SQL retirés + RLS, URL signées de 15 min | Test : accès avec slug d'un autre cadeau |
| Fuite par cache | Moyen | Cache-Control: no-store sur routes privées, URL signées courtes | Test : vérifier les en-têtes de cache |
| Aperçu de lien ou moteur de recherche | Faible | OG générique, noindex, robots.txt exclusion | Test : vérifier les métadonnées OG |

## Actif : Jeton d'édition

| Menace | Risque | Parade | Test de vérification |
|--------|--------|--------|---------------------|
| Vol (e-mail, historique, en-tête Referer) | Moyen | 256 bits, stocké en hash, échange contre cookie __Host-, nettoyage URL | Test : tentative de réutilisation après échange |
| Force brute | Faible | Comparaison à temps constant, session de 7 jours | Test : test de comparaison de hash |
| Réutilisation après récupération | Faible | Rotation à la récupération, empreinte dans cookie | Test : récupération + tentative ancien jeton |

## Actif : Mot secret

| Menace | Risque | Parade | Test de vérification |
|--------|--------|--------|---------------------|
| Force brute | Élevé | argon2id, limites par cadeau et par IP, temporisation exponentielle | Test : test de charge sur /unlock |
| Devinette | Moyen | Messages d'erreur génériques, indice limité | Test : essais avec mots communs |
| Verrouillage abusif | Moyen | Turnstile après 3 échecs, verrouillage 15 min (jamais global) | Test : tenter de bloquer un cadeau |

## Actif : Paiement

| Menace | Risque | Parade | Test de vérification |
|--------|--------|--------|---------------------|
| Faux webhook | Critique | Signature + horodatage, revérification par API FedaPay | Test : webhook sans signature |
| Rejeu de webhook | Critique | Idempotence (webhook_events), machine d'états | Test : envoyer même webhook deux fois |
| Manipulation du prix | Critique | Prix calculé côté serveur uniquement | Test : tenter de modifier le prix |
| Double publication | Critique | Idempotence, statut unique | Test : webhook sur cadeau déjà publié |

## Actif : Fichiers envoyés

| Menace | Risque | Parade | Test de vérification |
|--------|--------|--------|---------------------|
| Fichiers piégés (polyglotte, SVG, HTML) | Critique | Liste blanche MIME, réencodage serveur, nosniff | Test : upload SVG, HTML |
| Bombes de décompression | Moyen | Réencodage avec limites, job asynchrone | Test : upload image massive |
| EXIF/GPS | Moyen | Réencodage serveur (suppression métadonnées) | Test : upload avec métadonnées |
| XSS stockée | Critique | Content-Type imposé, bucket privé, origine distincte | Test : upload fichier JS |

## Actif : Administration

| Menace | Risque | Parade | Test de vérification |
|--------|--------|--------|---------------------|
| Vol de session | Critique | MFA AAL2, session courte (30 min inactivité) | Test : session sans MFA |
| Abus de privilège | Critique | audit_log, accès au contenu seulement après signalement | Test : accès sans signalement |
| Accès non autorisé | Critique | Rôle admin vérifié, MFA requis | Test : tentative accès sans rôle |

## Actif : Chaîne d'approvisionnement

| Menace | Risque | Parade | Test de vérification |
|--------|--------|--------|---------------------|
| Paquet malveillant | Critique | Versions figées, scripts d'installation désactivés, audits bloquants | Test : CI avec dépendance vulnérable |
| Secret publié | Critique | gitleaks hook + CI, protection de branche | Test : commit de faux secret |
| Action CI détournée | Critique | Actions épinglées par SHA, permissions lecture seule | Test : modification workflow |

## Actif : Abus (spam, scraping, coûts)

| Menace | Risque | Parade | Test de vérification |
|--------|--------|--------|---------------------|
| Créations massives | Moyen | Turnstile, limites par appareil, quotas | Test : création en boucle |
| Envois massifs | Moyen | Quotas par cadeau, file de tâches | Test : upload en boucle |
| Scraping | Faible | Turnstile, limites, réponse uniforme | Test : scraping de cadeaux |

## Actif : Agent de développement (Windsurf)

| Menace | Risque | Parade | Test de vérification |
|--------|--------|--------|---------------------|
| Injection de prompt | Critique | Règles de l'agent, contenu externe = donnée | Test : prompt malveillant dans fichier |
| Exfiltration de secrets | Critique | Règles : jamais lire .env*, .codeiumignore | Test : tentative lecture .env |
| Commande destructive | Critique | Règles : pas de rm -rf, DROP sans accord | Test : tentative commande destructive |
