-- Ajouter une colonne processed pour le suivi des événements traités
ALTER TABLE gift_events ADD COLUMN IF NOT EXISTS processed BOOLEAN NOT NULL DEFAULT false;

-- Modifier record_open pour ne pas verrouiller
-- Ajouter des fonctions pour le batch des compteurs d'ouverture

-- Modifier la fonction record_open pour ne pas verrouiller la ligne du cadeau
CREATE OR REPLACE FUNCTION record_open(p_gift_id UUID, p_device_id TEXT)
RETURNS VOID AS $$
BEGIN
  -- Insérer l'événement d'ouverture sans verrou
  INSERT INTO gift_events (gift_id, type, meta, created_at, processed)
  VALUES (p_gift_id, 'opened', '{"device_id": ' || quote_literal(p_device_id) || '}', NOW(), false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour recalculer open_count par batch depuis gift_events
CREATE OR REPLACE FUNCTION flush_open_counts()
RETURNS VOID AS $$
BEGIN
  -- Recalculer open_count pour tous les cadeaux qui ont des événements non traités
  WITH open_counts AS (
    SELECT
      gift_id,
      COUNT(*)::INTEGER as count
    FROM gift_events
    WHERE type = 'opened'
      AND processed = false
    GROUP BY gift_id
  )
  UPDATE gifts
  SET open_count = gifts.open_count + open_counts.count
  FROM open_counts
  WHERE gifts.id = open_counts.gift_id;

  -- Marquer les événements comme traités
  UPDATE gift_events
  SET processed = true
  WHERE type = 'opened'
    AND processed = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
