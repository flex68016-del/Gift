-- Ajouter des contraintes pour la machine d'états des paiements
-- Garantir un seul paiement approuvé par cadeau

-- Fonction pour valider les transitions de statut
CREATE OR REPLACE FUNCTION validate_payment_transition()
RETURNS TRIGGER AS $$
BEGIN
  -- Transitions autorisées :
  -- pending → approved
  -- pending → declined
  -- pending → canceled
  -- approved → refunded

  IF OLD.status = 'pending' THEN
    IF NEW.status NOT IN ('approved', 'declined', 'canceled') THEN
      RAISE EXCEPTION 'Invalid transition from pending to %', NEW.status;
    END IF;
  ELSIF OLD.status = 'approved' THEN
    IF NEW.status != 'refunded' THEN
      RAISE EXCEPTION 'Invalid transition from approved to %', NEW.status;
    END IF;
  ELSE
    -- Pas de transition depuis les autres statuts
    RAISE EXCEPTION 'Cannot transition from %', OLD.status;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour valider les transitions
DROP TRIGGER IF EXISTS payment_transition_trigger ON payments;
CREATE TRIGGER payment_transition_trigger
BEFORE UPDATE OF status ON payments
FOR EACH ROW
EXECUTE FUNCTION validate_payment_transition();

-- Contrainte d'unicité : un seul paiement approuvé par cadeau
-- Note : EXCLUDE nécessite l'extension btree_gist
-- Si l'extension n'est pas disponible, utiliser un trigger à la place
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'btree_gist') THEN
    ALTER TABLE payments
    ADD CONSTRAINT payments_gift_approved_unique
    EXCLUDE USING gist (
      gift_id WITH =,
      status WITH =
    ) WHERE (status = 'approved');
  ELSE
    -- Fallback : trigger pour garantir l'unicité
    CREATE OR REPLACE FUNCTION prevent_duplicate_approved_payment()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.status = 'approved' THEN
        IF EXISTS (
          SELECT 1 FROM payments
          WHERE gift_id = NEW.gift_id
            AND status = 'approved'
            AND id != NEW.id
        ) THEN
          RAISE EXCEPTION 'Only one approved payment per gift';
        END IF;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS prevent_duplicate_approved_trigger ON payments;
    CREATE TRIGGER prevent_duplicate_approved_trigger
    BEFORE INSERT OR UPDATE OF status ON payments
    FOR EACH ROW
    EXECUTE FUNCTION prevent_duplicate_approved_payment();
  END IF;
END
$$;

-- Index pour les requêtes fréquentes
CREATE INDEX IF NOT EXISTS payments_gift_status_idx ON payments(gift_id, status);
CREATE INDEX IF NOT EXISTS payments_transaction_idx ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS payments_created_idx ON payments(created_at);
