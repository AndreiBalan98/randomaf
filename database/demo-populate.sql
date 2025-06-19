-- =========================
-- POPULARE DATE DEMO
-- =========================

-- 5 x APARTAMENTE
INSERT INTO anunturi (tip_imobil, tip_oferta, titlu, pret, comision, localizare, descriere)
VALUES 
('apartament', 'vanzare', 'Apartament 2 camere', 75000, 2.5, 'Bucuresti, Sector 3', 'Apartament spațios, zona linistita'),
('apartament', 'cumparare', 'Caut apartament 3 camere', 95000, 0, 'Cluj-Napoca, Centru', 'Sunt interesat de un apartament luminos.'),
('apartament', 'vanzare', 'Apartament 4 camere modern', 120000, 3, 'Iasi, Copou', 'Complet renovat, aproape de parc.'),
('apartament', 'vanzare', 'Apartament decomandat', 68000, 2, 'Timisoara, Complex', 'Ideal pentru studenti.'),
('apartament', 'vanzare', 'Apartament tip studio', 48000, 1.5, 'Brasov, Astra', 'Potrivit pentru investitie.');

-- Atribute specifice pentru apartamente
INSERT INTO apartamente (anunt_id, nr_camere, nr_bai, compartimentare, confort, etaj, an_constructie, suprafata_utila)
VALUES 
(1, 2, 1, 'decomandat', '1', 3, 2010, 60),
(2, 3, 2, 'semidecomandat', '2', 2, 2008, 75),
(3, 4, 2, 'decomandat', '1', 1, 2020, 90),
(4, 2, 1, 'circular', '3', 4, 2005, 55),
(5, 1, 1, 'open-space', '1', 5, 2015, 38);

-- 5 x CASE
INSERT INTO anunturi (tip_imobil, tip_oferta, titlu, pret, comision, localizare, descriere)
VALUES 
('casa', 'vanzare', 'Casa individuala', 150000, 2, 'Bucuresti, Prelungirea Ghencea', 'Curte mare, zona linistita.'),
('casa', 'vanzare', 'Casa duplex', 135000, 2.5, 'Oradea, Rogerius', 'Constructie noua.'),
('casa', 'cumparare', 'Caut casa batraneasca', 60000, 0, 'Arad, periferie', 'Vreau o casa veche cu potential.'),
('casa', 'vanzare', 'Vila P+1', 210000, 3, 'Constanta, Palazu Mare', 'Lux, finisaje premium.'),
('casa', 'vanzare', 'Casa mica de vacanta', 85000, 1.5, 'Sibiu, Gusterita', 'Ideala pentru weekend.');

-- Atribute case
INSERT INTO casee (anunt_id, nr_camere, nr_bai, an_constructie, suprafata_utila, suprafata_teren)
VALUES 
(6, 4, 2, 2012, 120, 300),
(7, 3, 2, 2021, 100, 250),
(8, 2, 1, 1960, 80, 400),
(9, 5, 3, 2020, 200, 500),
(10, 2, 1, 2015, 60, 200);

-- 5 x TERENURI
INSERT INTO anunturi (tip_imobil, tip_oferta, titlu, pret, comision, localizare, descriere)
VALUES 
('teren', 'vanzare', 'Teren intravilan 500mp', 45000, 2, 'Bucuresti, Berceni', 'Acces facil la utilitati.'),
('teren', 'cumparare', 'Caut teren agricol', 30000, 0, 'Galati, zona rurala', 'Minim 1000mp.'),
('teren', 'vanzare', 'Teren 1000mp - deschidere mare', 80000, 1.8, 'Cluj, Floresti', 'Ideal pentru constructie bloc.'),
('teren', 'vanzare', 'Teren extravilan', 25000, 2.5, 'Ialomita, campie', 'Teren agricol, foarte fertil.'),
('teren', 'vanzare', 'Teren pentru hala', 95000, 2, 'Timis, zona industriala', 'Acces TIR, gaze si curent.');

-- Atribute terenuri
INSERT INTO terenuri (anunt_id, suprafata_teren, tip_teren, clasificare, front_stradal)
VALUES 
(11, 500, 'intravilan', 'rezidential', 18),
(12, 1200, 'agricol', 'extravilan', 25),
(13, 1000, 'intravilan', 'constructii', 30),
(14, 1500, 'extravilan', 'agricol', 22),
(15, 800, 'intravilan', 'industrial', 28);

-- 5 x SPATII COMERCIALE
INSERT INTO anunturi (tip_imobil, tip_oferta, titlu, pret, comision, localizare, descriere)
VALUES 
('spatiu_comercial', 'vanzare', 'Spatiu comercial stradal', 180000, 3, 'Bucuresti, Unirii', 'Vad comercial excelent.'),
('spatiu_comercial', 'cumparare', 'Caut spatiu pentru birouri', 120000, 0, 'Timisoara, Centru', 'Zona accesibila.'),
('spatiu_comercial', 'vanzare', 'Spatiu depozitare', 95000, 2.5, 'Satu Mare', 'Hala industriala.'),
('spatiu_comercial', 'vanzare', 'Spatiu open space 200mp', 150000, 2, 'Cluj-Napoca, Marasti', 'Etaj 1, cladire business.'),
('spatiu_comercial', 'vanzare', 'Parter comercial cu vitrina', 175000, 2.8, 'Oradea, Centru', 'Ideal farmacie sau banca.');

-- Atribute spatii comerciale
INSERT INTO spatii_comerciale (anunt_id, suprafata_utila, nr_camere, nr_bai, an_constructie)
VALUES 
(16, 150, 4, 2, 2010),
(17, 120, 3, 1, 2008),
(18, 300, 2, 1, 2015),
(19, 200, 1, 1, 2020),
(20, 180, 2, 2, 2012);

-- Exemple IMAGINI pentru primele 20 de anunțuri
INSERT INTO imagini (anunt_id, url, ordine) VALUES (1, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (2, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (3, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (4, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (5, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (6, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (7, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (8, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (9, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (10, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (11, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (12, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (13, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (14, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (15, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (16, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (17, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (18, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (19, 'http://localhost:3001/images/casa1.jpg', 1);
INSERT INTO imagini (anunt_id, url, ordine) VALUES (20, 'http://localhost:3001/images/casa1.jpg', 1);
