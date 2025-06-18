-- Baza de date: REM (Real Estate Management)

-- Tabela principală pentru toate imobilele
CREATE TABLE imobile (
    id SERIAL PRIMARY KEY,
    titlu VARCHAR(255) NOT NULL,
    pret DECIMAL(12,2) NOT NULL,
    locatie VARCHAR(255) NOT NULL,
    descriere TEXT,
    tip VARCHAR(50) NOT NULL, -- 'apartament', 'casa'/'casee', 'teren', 'spatiu-comercial'
    tranzactie VARCHAR(20) NOT NULL -- 'vanzare', 'inchiriere'
);

-- Tabela pentru apartamente (detalii specifice)
CREATE TABLE apartamente (
    id SERIAL PRIMARY KEY,
    imobil_id INTEGER REFERENCES imobile(id) ON DELETE CASCADE,
    suprafata_utila DECIMAL(8,2),
    nr_camere INTEGER,
    nr_bai INTEGER,
    compartimentare VARCHAR(100), -- 'decomandat', 'semidecomandat', 'circular'
    confort VARCHAR(50), -- 'lux', '1', '2', '3'
    etaj INTEGER,
    an_constructie INTEGER
);

-- Tabela pentru case (detalii specifice)
CREATE TABLE casee (
    id SERIAL PRIMARY KEY,
    imobil_id INTEGER REFERENCES imobile(id) ON DELETE CASCADE,
    suprafata_utila DECIMAL(8,2),
    suprafata_teren DECIMAL(8,2),
    nr_camere INTEGER,
    nr_bai INTEGER,
    an_constructie INTEGER,
    alte_dotari TEXT -- garaj, gradina, piscina, etc.
);

-- Tabela pentru terenuri (detalii specifice)
CREATE TABLE terenuri (
    id SERIAL PRIMARY KEY,
    imobil_id INTEGER REFERENCES imobile(id) ON DELETE CASCADE,
    suprafata_teren DECIMAL(8,2),
    tip_teren VARCHAR(50), -- 'constructie', 'agricol', 'industrial'
    clasificare VARCHAR(50), -- 'intravilan', 'extravilan'
    front_stradal DECIMAL(8,2) -- metri front la strada
);

-- Tabela pentru spatii comerciale (detalii specifice)
CREATE TABLE spatii_comerciale (
    id SERIAL PRIMARY KEY,
    imobil_id INTEGER REFERENCES imobile(id) ON DELETE CASCADE,
    suprafata_utila DECIMAL(8,2),
    alte_dotari TEXT -- parcare, vitrina, depozit, etc.
);

-- Tabela pentru imaginile asociate imobilelor
CREATE TABLE imagini_imobil (
    id SERIAL PRIMARY KEY,
    imobil_id INTEGER REFERENCES imobile(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL -- calea catre fisierul imagine
);

-- Indexuri pentru performanta
CREATE INDEX idx_imobile_tip ON imobile(tip);
CREATE INDEX idx_imobile_tranzactie ON imobile(tranzactie);
CREATE INDEX idx_imobile_pret ON imobile(pret);
CREATE INDEX idx_apartamente_imobil_id ON apartamente(imobil_id);
CREATE INDEX idx_casee_imobil_id ON casee(imobil_id);
CREATE INDEX idx_terenuri_imobil_id ON terenuri(imobil_id);
CREATE INDEX idx_spatii_comerciale_imobil_id ON spatii_comerciale(imobil_id);
CREATE INDEX idx_imagini_imobil_id ON imagini_imobil(imobil_id);

-- Exemple de date pentru testare
INSERT INTO imobile (titlu, pret, locatie, descriere, tip, tranzactie) VALUES
('Apartament 3 camere Centrul Vechi', 85000, 'Bucuresti, Sector 3', 'Apartament spatios in zona centrala', 'apartament', 'vanzare'),
('Casa cu gradina', 120000, 'Ilfov, Otopeni', 'Casa individuala cu gradina mare', 'casa', 'vanzare'),
('Teren constructii', 45000, 'Cluj, Floresti', 'Teren pentru constructie casa', 'teren', 'vanzare'),
('Spatiu comercial', 1500, 'Timisoara, Centru', 'Spatiu comercial pentru birou', 'spatiu-comercial', 'inchiriere');

-- Exemplu de date pentru apartament
INSERT INTO apartamente (imobil_id, suprafata_utila, nr_camere, nr_bai, compartimentare, confort, etaj, an_constructie) VALUES
(1, 75.5, 3, 1, 'decomandat', '1', 4, 2005);

-- Exemplu de date pentru casa
INSERT INTO casee (imobil_id, suprafata_utila, suprafata_teren, nr_camere, nr_bai, an_constructie, alte_dotari) VALUES
(2, 120.0, 500.0, 4, 2, 2010, 'garaj, gradina, terasa');

-- Exemplu de date pentru teren
INSERT INTO terenuri (imobil_id, suprafata_teren, tip_teren, clasificare, front_stradal) VALUES
(3, 800.0, 'constructie', 'intravilan', 20.0);

-- Exemplu de date pentru spatiu comercial
INSERT INTO spatii_comerciale (imobil_id, suprafata_utila, alte_dotari) VALUES
(4, 50.0, 'parcare, climatizare');