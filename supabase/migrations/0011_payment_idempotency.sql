-- Ajouter l'idempotence aux paiements
-- Permet d'éviter les doubles créations de paiement si l'utilisateur clique plusieurs fois

-- Ajouter la colonne idempotency_key
ALTER TABLE payments ADD COLUMN IF NOT EXISTS idempotency_key TEXT;

-- Créer un index pour les recherches rapides
CREATE INDEX IF NOT EXISTS payments_idempotency_key_idx ON payments(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- Contrainte d'unicité : un seul paiement par (gift_id, idempotency_key)
-- La contrainte avec ON CONFLICT DO NOTHING sera gérée au niveau applicatif
ALTER TABLE payments
ADD CONSTRAINT payments_gift_idempotency_unique
UNIQUE (gift_id, idempotency_key);
