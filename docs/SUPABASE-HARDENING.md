# Réglages Supabase à effectuer manuellement

## À faire dans le tableau de bord Supabase

### 1. Buckets Storage
Créer deux buckets privés (sans aucune politique publique) :

1. **gift-assets**
   - Private bucket
   - Path: `{gift_id}/{asset_id}.{ext}`
   - File size limit: 25 Mo
   - Allowed MIME types: image/jpeg, image/png, image/webp, audio/webm, audio/ogg, audio/mp4, audio/m4a

2. **music-library**
   - Private bucket
   - Allowed MIME types: audio/mpeg, audio/ogg, audio/webm, audio/mp4

### 2. Rôle app_server
- Le mot de passe du rôle `app_server` doit être défini hors du dépôt
- Ajouter le mot de passe à `DATABASE_URL` (format: `postgresql://app_server:PASSWORD@host:port/database`)
- Ne jamais stocker le mot de passe dans le code ou les migrations

### 3. Data API
- **Désactiver** la Data API car l'application utilise SQL direct via le pooler
- Settings → API → Disable Data API

### 4. Configuration de l'e-mail
- Confirmer l'e-mail du compte admin
- Activer la 2FA (MFA AAL2) sur le compte admin

### 5. Restrictions réseau (si disponibles)
- Restreindre l'accès aux IPs de confiance pour les fonctions Edge
- Restreindre l'accès Storage aux rôles autorisés

### 6. PITR (Point-in-Time Recovery)
- Activer PITR pour la base de données
- Configurer la rétention (7 jours minimum)

### 7. Politique de mot de passe
- Activer la politique de mot de passe forte pour les rôles

### 8. Extensions
- S'assurer que `pgcrypto` est activé (créé dans la migration 0001)
