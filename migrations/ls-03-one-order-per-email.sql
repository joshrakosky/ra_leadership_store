-- One Leadership order per email. Emails are stored lowercase in the app.
-- Safe to re-run.

DROP INDEX IF EXISTS idx_ra_leadership_orders_email;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ra_leadership_orders_one_per_email
  ON ra_leadership_orders (email);
