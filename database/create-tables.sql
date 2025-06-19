-- =========================
-- BAZA DE DATE ANUNTURI IMOBILIARE
-- =========================

-- TABELA PRINCIPALA: ANUNTURI
CREATE TABLE anunturi (
    id SERIAL PRIMARY KEY,
    tip_imobil VARCHAR(20) NOT NULL CHECK (tip_imobil IN ('apartament', 'casa', 'teren', 'spatiu_comercial')),
    tip_oferta VARCHAR(10) NOT NULL CHECK (tip_oferta IN ('vanzare', 'cumparare')),
    titlu TEXT NOT NULL,
    pret NUMERIC(12, 2) NOT NULL,
    comision NUMERIC(5, 2),
    localizare TEXT,
    descriere TEXT,
    data_publicare TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABELA IMAGINI (MAXIM 16 IMAGINI / ANUNT)
CREATE TABLE imagini (
    id SERIAL PRIMARY KEY,
    anunt_id INTEGER NOT NULL REFERENCES anunturi(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    ordine INTEGER NOT NULL CHECK (ordine >= 1 AND ordine <= 16),
    UNIQUE(anunt_id, ordine)
);

-- TABELA SPECIFICA: APARTAMENTE
CREATE TABLE apartamente (
    anunt_id INTEGER PRIMARY KEY REFERENCES anunturi(id) ON DELETE CASCADE,
    nr_camere INTEGER,
    nr_bai INTEGER,
    compartimentare VARCHAR(50),
    confort VARCHAR(50),
    etaj INTEGER,
    an_constructie INTEGER,
    suprafata_utila NUMERIC(10,2)
);

-- TABELA SPECIFICA: CASE
CREATE TABLE casee (
    anunt_id INTEGER PRIMARY KEY REFERENCES anunturi(id) ON DELETE CASCADE,
    nr_camere INTEGER,
    nr_bai INTEGER,
    an_constructie INTEGER,
    suprafata_utila NUMERIC(10,2),
    suprafata_teren NUMERIC(10,2)
);

-- TABELA SPECIFICA: TERENURI
CREATE TABLE terenuri (
    anunt_id INTEGER PRIMARY KEY REFERENCES anunturi(id) ON DELETE CASCADE,
    suprafata_teren NUMERIC(10,2),
    tip_teren VARCHAR(50),
    clasificare VARCHAR(50),
    front_stradal NUMERIC(10,2)
);

-- TABELA SPECIFICA: SPATII COMERCIALE
CREATE TABLE spatii_comerciale (
    anunt_id INTEGER PRIMARY KEY REFERENCES anunturi(id) ON DELETE CASCADE,
    suprafata_utila NUMERIC(10,2),
    nr_camere INTEGER,
    nr_bai INTEGER,
    an_constructie INTEGER
);
