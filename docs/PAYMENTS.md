# Paiements FedaPay - Documentation

## Configuration

### Variables d'environnement

```bash
# Mode FedaPay (sandbox ou production)
FEDAPAY_ENV=sandbox

# Clés API
FEDAPAY_PUBLIC_KEY=pk_test_xxx
FEDAPAY_SECRET_KEY=sk_test_xxx

# Webhook secrets (rotation supportée)
FEDAPAY_WEBHOOK_SECRET=whsec_xxx
FEDAPAY_WEBHOOK_SECRET_PREVIOUS=whsec_old_xxx  # Optionnel, pour rotation
```

## Test en Sandbox

### 1. Créer un compte FedaPay Sandbox

1. Allez sur https://sandbox.fedapay.com/
2. Créez un compte développeur
3. Récupérez vos clés API depuis le dashboard

### 2. Configurer le webhook

1. Dans le dashboard FedaPay, ajoutez l'URL de votre webhook :
   ```
   https://votre-domaine.com/api/webhooks/fedapay
   ```
2. Copiez le secret du webhook et ajoutez-le à `FEDAPAY_WEBHOOK_SECRET`

### 3. Tester les scénarios

#### Scénario 1 : Paiement réussi
1. Créez un cadeau dans l'éditeur
2. Cliquez sur "Publier"
3. Remplissez l'e-mail et le numéro de téléphone
4. Suivez le lien de paiement FedaPay
5. Utilisez les cartes de test FedaPay (voir documentation FedaPay)
6. Vérifiez que :
   - Le webhook est appelé
   - Le cadeau passe en statut `published`
   - L'e-mail de confirmation est envoyé

#### Scénario 2 : Paiement refusé
1. Utilisez une carte de test refusée
2. Vérifiez que :
   - Le statut du paiement passe à `declined`
   - Le cadeau reste en `draft`
   - L'utilisateur peut réessayer

#### Scénario 3 : Paiement annulé
1. Annulez le paiement sur la page FedaPay
2. Vérifiez que :
   - Le statut du paiement passe à `canceled`
   - Le cadeau reste en `draft`

#### Scénario 4 : Rejeu de webhook
1. Simulez l'envoi du même webhook deux fois
2. Vérifiez que :
   - Le deuxième appel est ignoré (idempotence)
   - Aucune double publication n'occure

#### Scénario 5 : Signature invalide
1. Envoyez un webhook avec une signature incorrecte
2. Vérifiez que :
   - L'endpoint retourne 401
   - L'événement n'est pas traité

### 4. Cartes de test FedaPay

Consultez la documentation FedaPay pour la liste des cartes de test disponibles en sandbox.

## Machine d'états des paiements

```
pending → approved → refunded
pending → declined
pending → canceled
```

Les transitions non autorisées sont rejetées.

## Sécurité

- Le prix est défini côté serveur uniquement
- La signature du webhook est vérifiée à temps constant
- Le timestamp du webhook est vérifié (tolérance 5 minutes)
- Double secret pour la rotation des clés
- Verrou `SELECT ... FOR UPDATE` pendant le traitement
- Idempotence via `webhook_events`
- Journalisation sans données personnelles

## Migration vers la production

1. Basculez `FEDAPAY_ENV=sandbox` → `FEDAPAY_ENV=production`
2. Remplacez les clés de test par les clés de production
3. Mettez à jour l'URL du webhook si nécessaire
4. Faites un premier paiement de test en production (montant minimal)
5. Surveillez les logs et les webhooks

## Fournisseur de secours (Stripe)

L'interface `PaymentProvider` permet d'ajouter Stripe comme fournisseur de secours sans modifier le code métier. À implémenter dans V1.1.

## Support

En cas de problème :
1. Vérifiez les logs du serveur
2. Vérifiez les logs FedaPay dans le dashboard
3. Consultez la documentation FedaPay : https://doc.fedapay.com/
