-- =========================
-- DROP TABLES SCRIPT
-- =========================

-- Drop tabelele în ordine inversă pentru a respecta foreign key constraints
DROP TABLE IF EXISTS imagini CASCADE;
DROP TABLE IF EXISTS apartamente CASCADE;
DROP TABLE IF EXISTS casee CASCADE;
DROP TABLE IF EXISTS terenuri CASCADE;
DROP TABLE IF EXISTS spatii_comerciale CASCADE;
DROP TABLE IF EXISTS anunturi CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS ownership CASCADE;