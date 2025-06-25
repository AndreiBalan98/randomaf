-- =========================
-- DROP TABLES SCRIPT
-- =========================

-- Drop tabelele in ordine inversa pentru a respecta foreign key constraints
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS ownership CASCADE;
DROP TABLE IF EXISTS imagini CASCADE;
DROP TABLE IF EXISTS apartamente CASCADE;
DROP TABLE IF EXISTS casee CASCADE;
DROP TABLE IF EXISTS terenuri CASCADE;
DROP TABLE IF EXISTS spatii_comerciale CASCADE;
DROP TABLE IF EXISTS anunturi CASCADE;
DROP TABLE IF EXISTS localitati CASCADE;
DROP TABLE IF EXISTS orase CASCADE;
DROP TABLE IF EXISTS users CASCADE;