-- CURĂȚĂ BAZA DE DATE (opțional)
TRUNCATE imagini, apartamente, casee, terenuri, spatii_comerciale, anunturi, localitati, orase, users RESTART IDENTITY CASCADE;

-- 1. USERS
INSERT INTO users (id, username, email, password_hash) VALUES
(1, 'alex123', 'alex@example.com', '$2b$10$wQy2QwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw'),
(2, 'maria89', 'maria@example.com', '$2b$10$wQy2QwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw'),
(3, 'daniel_v', 'daniel@example.com', '$2b$10$wQy2QwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw'),
(4, 'cristina_m', 'cristina@example.com', '$2b$10$wQy2QwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw'),
(5, 'geo2025', 'geo@example.com', '$2b$10$wQy2QwQwQwQwQwQwQwQwQeQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw');

-- 2. ORASE
INSERT INTO orase (id, nume) VALUES
(1, 'Bucuresti'),
(2, 'Cluj-Napoca'),
(3, 'Iasi');

-- 3. LOCALITATI
INSERT INTO localitati (id, nume, oras_id) VALUES
(1, 'Sector 1', 1),
(2, 'Sector 2', 1),
(3, 'Manastur', 2),
(4, 'Gheorgheni', 2),
(5, 'Copou', 3),
(6, 'Tatarasi', 3);

-- 4. ANUNTURI - Apartamente
INSERT INTO anunturi (id, id_user, tip_imobil, tip_oferta, titlu, pret, comision, oras_id, localitate_id, strada, latitudine, longitudine, descriere) VALUES
(1, 1, 'apartament', 'vanzare', 'Apartament 2 camere, renovat', 85000, 2.5, 1, 1, 'Str. Aviatorilor 12', 44.4582, 26.0776, 'Apartament cu 2 camere decomandat, complet renovat.'),
(2, 2, 'apartament', 'inchiriat', 'Apartament 3 camere modern', 500, 0, 2, 3, 'Str. Observatorului 45', 46.7653, 23.5899, 'Apartament spatios, complet mobilat.'),
(3, 3, 'apartament', 'vanzare', 'Garsoniera confort 1', 45000, 1.5, 3, 5, 'Bd. Carol 78', 47.1642, 27.5823, 'Garsoniera luminoasa, aproape de centru.'),
(4, 4, 'apartament', 'vanzare', 'Apartament 4 camere, Copou', 115000, 2.0, 3, 5, 'Str. Universitatii 10', 47.1751, 27.5749, 'Ideal familie numeroasa, langa parc.'),
(5, 5, 'apartament', 'inchiriat', 'Apartament cu vedere la parc', 600, 0, 1, 2, 'Str. Dacia 123', 44.4421, 26.1210, 'Foarte aproape de metrou, vedere superba.');

-- 4a. Detalii apartamente
INSERT INTO apartamente (anunt_id, nr_camere, nr_bai, compartimentare, confort, etaj, an_constructie, suprafata_utila) VALUES
(1, 2, 1, 'decomandat', '1', 3, 2008, 55.4),
(2, 3, 2, 'semidecomandat', '1', 5, 2015, 78.2),
(3, 1, 1, 'nedecomandat', '2', 2, 1990, 30.0),
(4, 4, 2, 'decomandat', '1', 1, 2020, 95.0),
(5, 2, 1, 'decomandat', '1', 6, 2012, 60.3);

-- 5. ANUNTURI - Case
INSERT INTO anunturi (id, id_user, tip_imobil, tip_oferta, titlu, pret, comision, oras_id, localitate_id, strada, latitudine, longitudine, descriere) VALUES
(6, 1, 'casa', 'vanzare', 'Casa cu 4 camere si curte', 145000, 3.0, 1, 1, 'Str. Florilor 10', 44.4599, 26.0799, 'Casa individuala, 400mp teren.'),
(7, 2, 'casa', 'inchiriat', 'Vila ultramoderna', 1200, 0, 2, 3, 'Str. Trandafirilor 30', 46.7702, 23.5984, 'Curte, garaj, terasa.'),
(8, 3, 'casa', 'vanzare', 'Casa batraneasca', 58000, 0, 3, 6, 'Str. Costache Negruzzi', 47.1623, 27.5900, 'Necesita renovare.'),
(9, 4, 'casa', 'vanzare', 'Duplex nou', 98000, 1.2, 2, 4, 'Str. Nasaud 9', 46.7722, 23.6093, 'Duplex in constructie noua.'),
(10, 5, 'casa', 'inchiriat', 'Casa mobilata modern', 950, 0, 1, 2, 'Str. Barbu Vacarescu', 44.4411, 26.1170, 'Complet utilata, zona linistita.');

-- 5a. Detalii case
INSERT INTO casee (anunt_id, nr_camere, nr_bai, an_constructie, suprafata_utila, suprafata_teren) VALUES
(6, 4, 2, 2000, 120.5, 400.0),
(7, 5, 3, 2018, 150.0, 250.0),
(8, 3, 1, 1975, 90.0, 500.0),
(9, 4, 2, 2023, 110.0, 300.0),
(10, 4, 2, 2010, 100.0, 350.0);

-- 6. ANUNTURI - Terenuri
INSERT INTO anunturi (id, id_user, tip_imobil, tip_oferta, titlu, pret, comision, oras_id, localitate_id, strada, latitudine, longitudine, descriere) VALUES
(11, 1, 'teren', 'vanzare', 'Teren intravilan 500mp', 40000, 2.0, 3, 6, 'Str. Verde 33', 47.1690, 27.5871, 'Ideal constructie casa.'),
(12, 2, 'teren', 'vanzare', 'Teren agricol 1000mp', 30000, 1.5, 2, 3, 'Str. Campului 88', 46.7750, 23.6000, 'Situat la marginea orasului.'),
(13, 3, 'teren', 'vanzare', 'Teren industrial', 80000, 2.5, 1, 2, 'Str. Fabricii', 44.4500, 26.1222, 'Aproape de sosea nationala.'),
(14, 4, 'teren', 'inchiriat', 'Teren parcare auto', 700, 0, 3, 5, 'Str. Lunca', 47.1700, 27.5911, 'Ideal parcare.'),
(15, 5, 'teren', 'vanzare', 'Teren pentru hale', 60000, 3.0, 2, 4, 'Str. Depozitelor', 46.7766, 23.6111, 'Zona industriala.');

-- 6a. Detalii terenuri
INSERT INTO terenuri (anunt_id, suprafata_teren, tip_teren, clasificare, front_stradal) VALUES
(11, 500.0, 'intravilan', 'rezidential', 18.0),
(12, 1000.0, 'agricol', 'extravilan', 20.0),
(13, 800.0, 'industrial', 'intravilan', 25.0),
(14, 300.0, 'parcare', 'intravilan', 15.0),
(15, 1200.0, 'constructii', 'intravilan', 30.0);

-- 7. ANUNTURI - Spatii comerciale
INSERT INTO anunturi (id, id_user, tip_imobil, tip_oferta, titlu, pret, comision, oras_id, localitate_id, strada, latitudine, longitudine, descriere) VALUES
(16, 2, 'spatiu_comercial', 'vanzare', 'Spatiu comercial zona centrala', 130000, 3.0, 1, 1, 'Bd. Magheru 22', 44.4382, 26.0960, 'Vitrina la strada.'),
(17, 3, 'spatiu_comercial', 'inchiriat', 'Spatiu birouri 100mp', 850, 0, 2, 4, 'Str. Calea Turzii', 46.7688, 23.6065, 'Zona ultracentrala.'),
(18, 4, 'spatiu_comercial', 'inchiriat', 'Salon de infrumusetare', 600, 0, 3, 6, 'Str. Independentei', 47.1671, 27.5765, 'Renovat recent.'),
(19, 5, 'spatiu_comercial', 'vanzare', 'Spatiu depozit', 110000, 2.0, 1, 2, 'Str. Viitorului 88', 44.4433, 26.1241, 'Spatiu generos.');

-- 7a. Detalii spatii comerciale
INSERT INTO spatii_comerciale (anunt_id, suprafata_utila, nr_camere, nr_bai, an_constructie) VALUES
(16, 85.0, 4, 1, 2005),
(17, 100.0, 5, 2, 2015),
(18, 65.0, 3, 1, 2021),
(19, 150.0, 1, 1, 2010);

-- 8. IMAGINI - pentru toate anunturile valide (1..19)
INSERT INTO imagini (anunt_id, url, ordine) VALUES
-- Anunt 1
(1, 'http://localhost:3001/images/image3.jpg', 1),
(1, 'http://localhost:3001/images/image7.jpg', 2),
(1, 'http://localhost:3001/images/image1.jpg', 3),
-- Anunt 2
(2, 'http://localhost:3001/images/image9.jpg', 1),
(2, 'http://localhost:3001/images/image2.jpg', 2),
(2, 'http://localhost:3001/images/image5.jpg', 3),
-- Anunt 3
(3, 'http://localhost:3001/images/image8.jpg', 1),
(3, 'http://localhost:3001/images/image4.jpg', 2),
(3, 'http://localhost:3001/images/image10.jpg', 3),
-- Anunt 4
(4, 'http://localhost:3001/images/image6.jpg', 1),
(4, 'http://localhost:3001/images/image1.jpg', 2),
(4, 'http://localhost:3001/images/image3.jpg', 3),
-- Anunt 5
(5, 'http://localhost:3001/images/image2.jpg', 1),
(5, 'http://localhost:3001/images/image8.jpg', 2),
(5, 'http://localhost:3001/images/image9.jpg', 3),
-- Anunt 6
(6, 'http://localhost:3001/images/image4.jpg', 1),
(6, 'http://localhost:3001/images/image7.jpg', 2),
(6, 'http://localhost:3001/images/image5.jpg', 3),
-- Anunt 7
(7, 'http://localhost:3001/images/image10.jpg', 1),
(7, 'http://localhost:3001/images/image6.jpg', 2),
(7, 'http://localhost:3001/images/image2.jpg', 3),
-- Anunt 8
(8, 'http://localhost:3001/images/image1.jpg', 1),
(8, 'http://localhost:3001/images/image9.jpg', 2),
(8, 'http://localhost:3001/images/image7.jpg', 3),
-- Anunt 9
(9, 'http://localhost:3001/images/image5.jpg', 1),
(9, 'http://localhost:3001/images/image3.jpg', 2),
(9, 'http://localhost:3001/images/image8.jpg', 3),
-- Anunt 10
(10, 'http://localhost:3001/images/image4.jpg', 1),
(10, 'http://localhost:3001/images/image10.jpg', 2),
(10, 'http://localhost:3001/images/image1.jpg', 3),
-- Anunt 11
(11, 'http://localhost:3001/images/image6.jpg', 1),
(11, 'http://localhost:3001/images/image2.jpg', 2),
(11, 'http://localhost:3001/images/image9.jpg', 3),
-- Anunt 12
(12, 'http://localhost:3001/images/image7.jpg', 1),
(12, 'http://localhost:3001/images/image5.jpg', 2),
(12, 'http://localhost:3001/images/image3.jpg', 3),
-- Anunt 13
(13, 'http://localhost:3001/images/image8.jpg', 1),
(13, 'http://localhost:3001/images/image1.jpg', 2),
(13, 'http://localhost:3001/images/image4.jpg', 3),
-- Anunt 14
(14, 'http://localhost:3001/images/image10.jpg', 1),
(14, 'http://localhost:3001/images/image6.jpg', 2),
(14, 'http://localhost:3001/images/image2.jpg', 3),
-- Anunt 15
(15, 'http://localhost:3001/images/image9.jpg', 1),
(15, 'http://localhost:3001/images/image7.jpg', 2),
(15, 'http://localhost:3001/images/image5.jpg', 3),
-- Anunt 16
(16, 'http://localhost:3001/images/image3.jpg', 1),
(16, 'http://localhost:3001/images/image8.jpg', 2),
(16, 'http://localhost:3001/images/image1.jpg', 3),
-- Anunt 17
(17, 'http://localhost:3001/images/image4.jpg', 1),
(17, 'http://localhost:3001/images/image10.jpg', 2),
(17, 'http://localhost:3001/images/image6.jpg', 3),
-- Anunt 18
(18, 'http://localhost:3001/images/image2.jpg', 1),
(18, 'http://localhost:3001/images/image9.jpg', 2),
(18, 'http://localhost:3001/images/image7.jpg', 3),
-- Anunt 19
(19, 'http://localhost:3001/images/image5.jpg', 1),
(19, 'http://localhost:3001/images/image3.jpg', 2),
(19, 'http://localhost:3001/images/image8.jpg', 3);

-- Resetare secvențe cu COALESCE pentru a gestiona tabelele goale
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0));
SELECT setval('orase_id_seq', COALESCE((SELECT MAX(id) FROM orase), 0));
SELECT setval('localitati_id_seq', COALESCE((SELECT MAX(id) FROM localitati), 0));
SELECT setval('anunturi_id_seq', COALESCE((SELECT MAX(id) FROM anunturi), 0));
SELECT setval('imagini_id_seq', COALESCE((SELECT MAX(id) FROM imagini), 0));