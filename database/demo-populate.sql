-- =========================
-- SCRIPT PL/SQL PENTRU POPULAREA BAZEI DE DATE CU ANUNTURI IMOBILIARE
-- 100 de anunturi: 25 apartamente, 25 case, 25 terenuri, 25 spatii comerciale
-- =========================

DO $$
DECLARE
    -- Variabile pentru generarea anunturilor
    v_anunt_id INTEGER;
    v_tip_imobil VARCHAR(20);
    v_tip_oferta VARCHAR(10);
    v_titlu TEXT;
    v_pret NUMERIC(12, 2);
    v_comision NUMERIC(5, 2);
    v_localizare TEXT;
    v_descriere TEXT;
    v_data_publicare TIMESTAMP;
    
    -- Variabile pentru detalii specifice
    v_nr_camere INTEGER;
    v_nr_bai INTEGER;
    v_compartimentare VARCHAR(50);
    v_confort VARCHAR(50);
    v_etaj INTEGER;
    v_an_constructie INTEGER;
    v_suprafata_utila NUMERIC(10,2);
    v_suprafata_teren NUMERIC(10,2);
    v_tip_teren VARCHAR(50);
    v_clasificare VARCHAR(50);
    v_front_stradal NUMERIC(10,2);
    
    -- Arrays pentru date
    v_orase TEXT[] := ARRAY[
        'alba-iulia', 'arad', 'bacau', 'baia-mare', 'bistrita', 'botosani', 'braila', 'brasov',
        'bucuresti', 'buzau', 'calafat', 'calarasi', 'campina', 'campulung', 'cluj-napoca',
        'constanta', 'craiova', 'deva', 'drobeta-turnu-severin', 'focsani', 'galati', 'giurgiu',
        'iasi', 'medias', 'miercurea-ciuc', 'oradea', 'petrosani', 'piatra-neamt', 'pitesti',
        'ploiesti', 'ramnicu-valcea', 'ramnicu-sarat', 'reghin', 'resita', 'roman',
        'rosiorii-de-vede', 'satu-mare', 'sibiu', 'sighetu-marmatiei', 'slatina', 'slobozia',
        'suceava', 'targoviste', 'targu-jiu', 'targu-mures', 'targu-neamt', 'targu-secuiesc',
        'timisoara', 'turda', 'turnu-magurele', 'urziceni', 'vaslui', 'zalau', 'zarnesti'
    ];
    
    -- Arrays pentru localitati per oras
    v_localitati_alba_iulia TEXT[] := ARRAY['Centru', 'Partos', 'Ampoi', 'Cetate', 'Tolstoi', 'Barabant', 'Micesti', 'Oarda'];
    v_localitati_arad TEXT[] := ARRAY['Centru', 'Aurel Vlaicu', 'Grădiște', 'Micălaca', 'Gai', 'Bujac', 'Sânnicolau Mic', 'Vladimirescu'];
    v_localitati_bacau TEXT[] := ARRAY['Centru', 'Nord', 'Sud', 'Serbanesti', 'Gheraiesti', 'Izvoare', 'Letea', 'Mioritei'];
    v_localitati_baia_mare TEXT[] := ARRAY['Centru', 'Valea Roșie', 'Vasile Alecsandri', 'Săsar', 'Ferneziu', 'Griviței', 'Gara', 'Recea'];
    v_localitati_bistrita TEXT[] := ARRAY['Centru', 'Unirea', 'Subcetate', 'Viisoara', 'Sigmir', 'Slatinita', 'Ghinda'];
    v_localitati_botosani TEXT[] := ARRAY['Centru', 'Parcul Tineretului', 'Cătămărăști', 'Pacea', 'Tudora', 'Curtești'];
    v_localitati_braila TEXT[] := ARRAY['Centru', 'Viziru', 'Hipodrom', 'Chercea', 'Obor', 'Radu Negru', 'Lacu Dulce'];
    v_localitati_brasov TEXT[] := ARRAY['Centru', 'Tractorul', 'Răcădău', 'Bartolomeu', 'Noua', 'Astra', 'Schei', 'Stupini'];
    v_localitati_bucuresti TEXT[] := ARRAY['Sector 1', 'Sector 2', 'Sector 3', 'Sector 4', 'Sector 5', 'Sector 6', 'Băneasa', 'Aviatorilor', 'Cotroceni', 'Drumul Taberei', 'Militari', 'Titan', 'Berceni', 'Colentina'];
    v_localitati_buzau TEXT[] := ARRAY['Centru', 'Micro 14', 'Micro 5', 'Dorobanți', 'Bălcescu', 'Simileasca', 'Broșteni'];
    v_localitati_calafat TEXT[] := ARRAY['Centru', 'Basarabi', 'Ciupercenii Vechi', 'Golenți'];
    v_localitati_calarasi TEXT[] := ARRAY['Centru', 'Mircea Vodă', 'Oborul Nou', 'Măgureni', 'Dumbrava', 'Ostroveni'];
    v_localitati_campina TEXT[] := ARRAY['Centru', 'Slobozia', 'Voila', 'Câmpinița', 'Turnătorie'];
    v_localitati_campulung TEXT[] := ARRAY['Centru', 'Grui', 'Vișoi', 'Valea Româneștilor', 'Schei'];
    v_localitati_cluj TEXT[] := ARRAY['Centru', 'Mănăștur', 'Gheorgheni', 'Grigorescu', 'Zorilor', 'Bună Ziua', 'Iris', 'Someșeni'];
    v_localitati_constanta TEXT[] := ARRAY['Centru', 'Tomis Nord', 'Tomis III', 'Faleză Nord', 'Inel II', 'Palas', 'Coiciu', 'Km 4-5'];
    v_localitati_craiova TEXT[] := ARRAY['Centru', 'Rovine', 'Brazda lui Novac', 'Lăpuș', 'Valea Roșie', 'Craiovița Nouă', 'Bariera Vâlcii'];
    v_localitati_deva TEXT[] := ARRAY['Centru', 'Micro 15', 'Micro 16', 'Micro 4', 'Micro 5', 'Aurel Vlaicu', 'Grigorescu'];
    v_localitati_drobeta_turnu_severin TEXT[] := ARRAY['Centru', 'Crihala', 'Schela', 'Gura Văii', 'Dudașu', 'Banovița'];
    v_localitati_focsani TEXT[] := ARRAY['Centru', 'Sud', 'Nord', 'Obor', 'Bahne', 'Gara', 'Mândrești'];
    v_localitati_galati TEXT[] := ARRAY['Centru', 'Mazepa', 'Micro 19', 'Micro 21', 'Micro 40', 'Țiglina', 'Dunărea'];
    v_localitati_giurgiu TEXT[] := ARRAY['Centru', 'Tineretului', 'Smârda', 'Oinacu', 'Steaua Dunării'];
    v_localitati_iasi TEXT[] := ARRAY['Centru', 'Copou', 'Tătărași', 'Nicolina', 'Păcurari', 'CUG', 'Galata', 'Dacia'];
    v_localitati_medias TEXT[] := ARRAY['Centru', 'Gura Câmpului', 'Vitrometan', 'După Zid', 'Moșnei'];
    v_localitati_miercurea_ciuc TEXT[] := ARRAY['Centru', 'Szécseny', 'Spicului', 'Nagymező', 'Harghita'];
    v_localitati_oradea TEXT[] := ARRAY['Centru', 'Rogerius', 'Nufărul', 'Ioșia', 'Velența', 'Oncea', 'Episcopia'];
    v_localitati_petrosani TEXT[] := ARRAY['Centru', 'Aeroport', 'Colonie', 'Dâlja', 'Sașa', 'Livezeni'];
    v_localitati_piatra_neamt TEXT[] := ARRAY['Centru', 'Dărmănești', 'Precista', 'Mărăței', 'Văleni', 'Ciritei'];
    v_localitati_pitesti TEXT[] := ARRAY['Centru', 'Trivale', 'Găvana', 'Prundu', 'Războieni', 'Eremia Grigorescu'];
    v_localitati_ploiesti TEXT[] := ARRAY['Centru', 'Nord', 'Sud', 'Vest', 'Malul Roșu', 'Bariera București', 'Mimiu'];
    v_localitati_ramnicu_valcea TEXT[] := ARRAY['Centru', 'Nord', 'Ostroveni', 'Traian', 'Petrișor', 'Căzănești'];
    v_localitati_ramnicu_sarat TEXT[] := ARRAY['Centru', 'Anghel Saligny', 'Podgoria', 'Bariera Focșani'];
    v_localitati_reghin TEXT[] := ARRAY['Centru', 'Apalina', 'Iernuțeni', 'Dedrad', 'Breaza'];
    v_localitati_resita TEXT[] := ARRAY['Centru', 'Govândari', 'Lunca Bârzavei', 'Muncitoresc', 'Dealul Crucii'];
    v_localitati_roman TEXT[] := ARRAY['Centru', 'Favorit', 'Petru Rareș', 'Mihai Viteazu', 'Nicolae Bălcescu'];
    v_localitati_rosiorii_de_vede TEXT[] := ARRAY['Centru', 'Spitalului', 'Nord', 'Sud', 'Est'];
    v_localitati_satu_mare TEXT[] := ARRAY['Centru', 'Micro 17', 'Micro 16', 'Carpați', 'Soarelui', 'Horea'];
    v_localitati_sibiu TEXT[] := ARRAY['Centru', 'Ștrand', 'Vasile Aaron', 'Hipodrom', 'Turnișor', 'Terezian', 'Lazaret'];
    v_localitati_sighetu_marmatiei TEXT[] := ARRAY['Centru', 'Valea Cufundoasă', 'Iapa', 'Șugău', 'Lazu Baciului'];
    v_localitati_slatina TEXT[] := ARRAY['Centru', 'Progresul', 'Steaua', 'Clocociov', 'Cireașov'];
    v_localitati_slobozia TEXT[] := ARRAY['Centru', 'Gării Noi', 'Mihai Viteazu', 'Sud', 'Vest'];
    v_localitati_suceava TEXT[] := ARRAY['Centru', 'Burdujeni', 'Obcini', 'Ițcani', 'George Enescu', 'Areni'];
    v_localitati_targoviste TEXT[] := ARRAY['Centru', 'Micro 6', 'Micro 9', 'Priseaca', 'Sagricom'];
    v_localitati_targu_jiu TEXT[] := ARRAY['Centru', '9 Mai', 'Debarcader', 'Griviței', 'Bârsești'];
    v_localitati_targu_mures TEXT[] := ARRAY['Centru', 'Dâmbul Pietros', 'Unirii', 'Tudor', 'Aleea Carpați', 'Cornișa'];
    v_localitati_targu_neamt TEXT[] := ARRAY['Centru', 'Blebea', 'Condreni', 'Humulești', 'Ozana'];
    v_localitati_targu_secuiesc TEXT[] := ARRAY['Centru', 'Fabricii', 'Kanta', 'Molnar János', 'Turia'];
    v_localitati_timisoara TEXT[] := ARRAY['Centru', 'Soarelui', 'Girocului', 'Circumvalațiunii', 'Lipovei', 'Aradului', 'Mehala', 'Iosefin'];
    v_localitati_turda TEXT[] := ARRAY['Centru', 'Oprișani', 'Micro 3', 'Poiana', 'Turda Nouă'];
    v_localitati_turnu_magurele TEXT[] := ARRAY['Centru', 'Odaia', 'Magurele', 'Combinat'];
    v_localitati_urziceni TEXT[] := ARRAY['Centru', 'Tineretului', 'Sud', 'Vest', 'Est'];
    v_localitati_vaslui TEXT[] := ARRAY['Centru', 'Moara Grecilor', 'Gara', 'Rediu', 'Bălteni'];
    v_localitati_zalau TEXT[] := ARRAY['Centru', 'Dumbrava Nord', 'Brădet', 'Porolissum', 'Meseș'];
    v_localitati_zarnesti TEXT[] := ARRAY['Centru', 'Tohanu Vechi', 'Tohanu Nou', 'Prund', 'Bălăceanca'];
    
    v_compartimentari TEXT[] := ARRAY['decomandat', 'semidecomandat', 'circular', 'open space'];
    v_conforturi TEXT[] := ARRAY['lux', 'confort 1', 'confort 2', 'semiconfort', 'fara confort'];
    v_tipuri_teren TEXT[] := ARRAY['intravilan', 'extravilan', 'agricol', 'forestier'];
    v_clasificari TEXT[] := ARRAY['constructii', 'agricol', 'drumuri', 'padure'];
    
    v_oras_selectat TEXT;
    v_localitate_selectata TEXT;
    v_counter INTEGER := 0;
    i INTEGER;
    j INTEGER;
    
BEGIN
    -- Seed pentru random
    PERFORM setseed(0.5);
    
    -- APARTAMENTE (25 bucati)
    FOR i IN 1..25 LOOP
        v_counter := v_counter + 1;
        v_tip_imobil := 'apartament';
        v_tip_oferta := CASE WHEN random() < 0.6 THEN 'vanzare' ELSE 'inchiriat' END;
        
        -- Generare detalii apartament
        v_nr_camere := 1 + floor(random() * 4)::INTEGER; -- 1-4 camere
        v_nr_bai := CASE WHEN v_nr_camere <= 2 THEN 1 ELSE 1 + floor(random() * 2)::INTEGER END;
        v_compartimentare := v_compartimentari[1 + floor(random() * array_length(v_compartimentari, 1))::INTEGER];
        v_confort := v_conforturi[1 + floor(random() * array_length(v_conforturi, 1))::INTEGER];
        v_etaj := floor(random() * 10)::INTEGER; -- 0-9 (parter = 0)
        v_an_constructie := 1970 + floor(random() * 54)::INTEGER; -- 1970-2024
        v_suprafata_utila := 35 + random() * 115; -- 35-150 mp
        
        -- Generare pret realistic
        IF v_tip_oferta = 'vanzare' THEN
            v_pret := (v_suprafata_utila * (800 + random() * 1200))::NUMERIC(12,2); -- 800-2000 eur/mp
        ELSE
            v_pret := (v_suprafata_utila * (4 + random() * 8))::NUMERIC(12,2); -- 4-12 eur/mp/luna
        END IF;
        
        v_comision := (random() * 5)::NUMERIC(5,2);
        
        -- Generare localizare
        v_oras_selectat := v_orase[1 + floor(random() * array_length(v_orase, 1))::INTEGER];
        CASE v_oras_selectat
            WHEN 'alba-iulia' THEN v_localitate_selectata := v_localitati_alba_iulia[1 + floor(random() * array_length(v_localitati_alba_iulia, 1))::INTEGER];
            WHEN 'arad' THEN v_localitate_selectata := v_localitati_arad[1 + floor(random() * array_length(v_localitati_arad, 1))::INTEGER];
            WHEN 'bacau' THEN v_localitate_selectata := v_localitati_bacau[1 + floor(random() * array_length(v_localitati_bacau, 1))::INTEGER];
            WHEN 'baia-mare' THEN v_localitate_selectata := v_localitati_baia_mare[1 + floor(random() * array_length(v_localitati_baia_mare, 1))::INTEGER];
            WHEN 'bistrita' THEN v_localitate_selectata := v_localitati_bistrita[1 + floor(random() * array_length(v_localitati_bistrita, 1))::INTEGER];
            WHEN 'botosani' THEN v_localitate_selectata := v_localitati_botosani[1 + floor(random() * array_length(v_localitati_botosani, 1))::INTEGER];
            WHEN 'braila' THEN v_localitate_selectata := v_localitati_braila[1 + floor(random() * array_length(v_localitati_braila, 1))::INTEGER];
            WHEN 'brasov' THEN v_localitate_selectata := v_localitati_brasov[1 + floor(random() * array_length(v_localitati_brasov, 1))::INTEGER];
            WHEN 'bucuresti' THEN v_localitate_selectata := v_localitati_bucuresti[1 + floor(random() * array_length(v_localitati_bucuresti, 1))::INTEGER];
            WHEN 'buzau' THEN v_localitate_selectata := v_localitati_buzau[1 + floor(random() * array_length(v_localitati_buzau, 1))::INTEGER];
            WHEN 'calafat' THEN v_localitate_selectata := v_localitati_calafat[1 + floor(random() * array_length(v_localitati_calafat, 1))::INTEGER];
            WHEN 'calarasi' THEN v_localitate_selectata := v_localitati_calarasi[1 + floor(random() * array_length(v_localitati_calarasi, 1))::INTEGER];
            WHEN 'campina' THEN v_localitate_selectata := v_localitati_campina[1 + floor(random() * array_length(v_localitati_campina, 1))::INTEGER];
            WHEN 'campulung' THEN v_localitate_selectata := v_localitati_campulung[1 + floor(random() * array_length(v_localitati_campulung, 1))::INTEGER];
            WHEN 'cluj-napoca' THEN v_localitate_selectata := v_localitati_cluj[1 + floor(random() * array_length(v_localitati_cluj, 1))::INTEGER];
            WHEN 'constanta' THEN v_localitate_selectata := v_localitati_constanta[1 + floor(random() * array_length(v_localitati_constanta, 1))::INTEGER];
            WHEN 'craiova' THEN v_localitate_selectata := v_localitati_craiova[1 + floor(random() * array_length(v_localitati_craiova, 1))::INTEGER];
            WHEN 'deva' THEN v_localitate_selectata := v_localitati_deva[1 + floor(random() * array_length(v_localitati_deva, 1))::INTEGER];
            WHEN 'drobeta-turnu-severin' THEN v_localitate_selectata := v_localitati_drobeta_turnu_severin[1 + floor(random() * array_length(v_localitati_drobeta_turnu_severin, 1))::INTEGER];
            WHEN 'focsani' THEN v_localitate_selectata := v_localitati_focsani[1 + floor(random() * array_length(v_localitati_focsani, 1))::INTEGER];
            WHEN 'galati' THEN v_localitate_selectata := v_localitati_galati[1 + floor(random() * array_length(v_localitati_galati, 1))::INTEGER];
            WHEN 'giurgiu' THEN v_localitate_selectata := v_localitati_giurgiu[1 + floor(random() * array_length(v_localitati_giurgiu, 1))::INTEGER];
            WHEN 'iasi' THEN v_localitate_selectata := v_localitati_iasi[1 + floor(random() * array_length(v_localitati_iasi, 1))::INTEGER];
            WHEN 'medias' THEN v_localitate_selectata := v_localitati_medias[1 + floor(random() * array_length(v_localitati_medias, 1))::INTEGER];
            WHEN 'miercurea-ciuc' THEN v_localitate_selectata := v_localitati_miercurea_ciuc[1 + floor(random() * array_length(v_localitati_miercurea_ciuc, 1))::INTEGER];
            WHEN 'oradea' THEN v_localitate_selectata := v_localitati_oradea[1 + floor(random() * array_length(v_localitati_oradea, 1))::INTEGER];
            WHEN 'petrosani' THEN v_localitate_selectata := v_localitati_petrosani[1 + floor(random() * array_length(v_localitati_petrosani, 1))::INTEGER];
            WHEN 'piatra-neamt' THEN v_localitate_selectata := v_localitati_piatra_neamt[1 + floor(random() * array_length(v_localitati_piatra_neamt, 1))::INTEGER];
            WHEN 'pitesti' THEN v_localitate_selectata := v_localitati_pitesti[1 + floor(random() * array_length(v_localitati_pitesti, 1))::INTEGER];
            WHEN 'ploiesti' THEN v_localitate_selectata := v_localitati_ploiesti[1 + floor(random() * array_length(v_localitati_ploiesti, 1))::INTEGER];
            WHEN 'ramnicu-valcea' THEN v_localitate_selectata := v_localitati_ramnicu_valcea[1 + floor(random() * array_length(v_localitati_ramnicu_valcea, 1))::INTEGER];
            WHEN 'ramnicu-sarat' THEN v_localitate_selectata := v_localitati_ramnicu_sarat[1 + floor(random() * array_length(v_localitati_ramnicu_sarat, 1))::INTEGER];
            WHEN 'reghin' THEN v_localitate_selectata := v_localitati_reghin[1 + floor(random() * array_length(v_localitati_reghin, 1))::INTEGER];
            WHEN 'resita' THEN v_localitate_selectata := v_localitati_resita[1 + floor(random() * array_length(v_localitati_resita, 1))::INTEGER];
            WHEN 'roman' THEN v_localitate_selectata := v_localitati_roman[1 + floor(random() * array_length(v_localitati_roman, 1))::INTEGER];
            WHEN 'rosiorii-de-vede' THEN v_localitate_selectata := v_localitati_rosiorii_de_vede[1 + floor(random() * array_length(v_localitati_rosiorii_de_vede, 1))::INTEGER];
            WHEN 'satu-mare' THEN v_localitate_selectata := v_localitati_satu_mare[1 + floor(random() * array_length(v_localitati_satu_mare, 1))::INTEGER];
            WHEN 'sibiu' THEN v_localitate_selectata := v_localitati_sibiu[1 + floor(random() * array_length(v_localitati_sibiu, 1))::INTEGER];
            WHEN 'sighetu-marmatiei' THEN v_localitate_selectata := v_localitati_sighetu_marmatiei[1 + floor(random() * array_length(v_localitati_sighetu_marmatiei, 1))::INTEGER];
            WHEN 'slatina' THEN v_localitate_selectata := v_localitati_slatina[1 + floor(random() * array_length(v_localitati_slatina, 1))::INTEGER];
            WHEN 'slobozia' THEN v_localitate_selectata := v_localitati_slobozia[1 + floor(random() * array_length(v_localitati_slobozia, 1))::INTEGER];
            WHEN 'suceava' THEN v_localitate_selectata := v_localitati_suceava[1 + floor(random() * array_length(v_localitati_suceava, 1))::INTEGER];
            WHEN 'targoviste' THEN v_localitate_selectata := v_localitati_targoviste[1 + floor(random() * array_length(v_localitati_targoviste, 1))::INTEGER];
            WHEN 'targu-jiu' THEN v_localitate_selectata := v_localitati_targu_jiu[1 + floor(random() * array_length(v_localitati_targu_jiu, 1))::INTEGER];
            WHEN 'targu-mures' THEN v_localitate_selectata := v_localitati_targu_mures[1 + floor(random() * array_length(v_localitati_targu_mures, 1))::INTEGER];
            WHEN 'targu-neamt' THEN v_localitate_selectata := v_localitati_targu_neamt[1 + floor(random() * array_length(v_localitati_targu_neamt, 1))::INTEGER];
            WHEN 'targu-secuiesc' THEN v_localitate_selectata := v_localitati_targu_secuiesc[1 + floor(random() * array_length(v_localitati_targu_secuiesc, 1))::INTEGER];
            WHEN 'timisoara' THEN v_localitate_selectata := v_localitati_timisoara[1 + floor(random() * array_length(v_localitati_timisoara, 1))::INTEGER];
            WHEN 'turda' THEN v_localitate_selectata := v_localitati_turda[1 + floor(random() * array_length(v_localitati_turda, 1))::INTEGER];
            WHEN 'turnu-magurele' THEN v_localitate_selectata := v_localitati_turnu_magurele[1 + floor(random() * array_length(v_localitati_turnu_magurele, 1))::INTEGER];
            WHEN 'urziceni' THEN v_localitate_selectata := v_localitati_urziceni[1 + floor(random() * array_length(v_localitati_urziceni, 1))::INTEGER];
            WHEN 'vaslui' THEN v_localitate_selectata := v_localitati_vaslui[1 + floor(random() * array_length(v_localitati_vaslui, 1))::INTEGER];
            WHEN 'zalau' THEN v_localitate_selectata := v_localitati_zalau[1 + floor(random() * array_length(v_localitati_zalau, 1))::INTEGER];
            WHEN 'zarnesti' THEN v_localitate_selectata := v_localitati_zarnesti[1 + floor(random() * array_length(v_localitati_zarnesti, 1))::INTEGER];
        END CASE;
        
        v_localizare := initcap(replace(v_oras_selectat, '-', ' ')) || ', ' || v_localitate_selectata;
        
        -- Generare titlu
        v_titlu := CASE v_tip_oferta 
            WHEN 'vanzare' THEN 'Vand apartament ' || v_nr_camere || ' camere, ' || round(v_suprafata_utila) || ' mp, ' || v_localizare
            ELSE 'Inchiriez apartament ' || v_nr_camere || ' camere, ' || round(v_suprafata_utila) || ' mp, ' || v_localizare
        END;
        
        -- Generare descriere
        v_descriere := 'Apartament cu ' || v_nr_camere || ' camere și ' || v_nr_bai || ' băi, suprafața utilă ' || 
                      round(v_suprafata_utila) || ' mp. Compartimentare: ' || v_compartimentare || 
                      ', confort: ' || v_confort || '. Situat la etajul ' || v_etaj || 
                      ', construit în anul ' || v_an_constructie || '. Locație: ' || v_localizare || '.';
        
        v_data_publicare := CURRENT_TIMESTAMP - (random() * 30 || ' days')::INTERVAL;
        
        -- Insert anunt principal
        INSERT INTO anunturi (tip_imobil, tip_oferta, titlu, pret, comision, localizare, descriere, data_publicare)
        VALUES (v_tip_imobil, v_tip_oferta, v_titlu, v_pret, v_comision, v_localizare, v_descriere, v_data_publicare)
        RETURNING id INTO v_anunt_id;
        
        -- Insert detalii apartament
        INSERT INTO apartamente (anunt_id, nr_camere, nr_bai, compartimentare, confort, etaj, an_constructie, suprafata_utila)
        VALUES (v_anunt_id, v_nr_camere, v_nr_bai, v_compartimentare, v_confort, v_etaj, v_an_constructie, v_suprafata_utila);
        
        -- Insert imagini (10 imagini aleatorii)
        FOR j IN 1..10 LOOP
            INSERT INTO imagini (anunt_id, url, ordine)
            VALUES (v_anunt_id, 'http://localhost:3001/images/image' || (1 + floor(random() * 10)::INTEGER) || '.jpg', j);
        END LOOP;
        
        RAISE NOTICE 'Apartament % inserat cu ID %', i, v_anunt_id;
    END LOOP;
    
    -- CASE (25 bucati)
    FOR i IN 1..25 LOOP
        v_counter := v_counter + 1;
        v_tip_imobil := 'casa';
        v_tip_oferta := CASE WHEN random() < 0.7 THEN 'vanzare' ELSE 'inchiriat' END;
        
        -- Generare detalii casa
        v_nr_camere := 2 + floor(random() * 6)::INTEGER; -- 2-7 camere
        v_nr_bai := 1 + floor(random() * 3)::INTEGER; -- 1-3 bai
        v_an_constructie := 1960 + floor(random() * 64)::INTEGER; -- 1960-2024
        v_suprafata_utila := 70 + random() * 230; -- 70-300 mp
        v_suprafata_teren := 200 + random() * 800; -- 200-1000 mp
        
        -- Generare pret realistic
        IF v_tip_oferta = 'vanzare' THEN
            v_pret := (v_suprafata_utila * (600 + random() * 900) + v_suprafata_teren * (50 + random() * 100))::NUMERIC(12,2);
        ELSE
            v_pret := (v_suprafata_utila * (3 + random() * 7))::NUMERIC(12,2); -- 3-10 eur/mp/luna
        END IF;
        
        v_comision := (random() * 5)::NUMERIC(5,2);
        
        -- Generare localizare
        v_oras_selectat := v_orase[1 + floor(random() * array_length(v_orase, 1))::INTEGER];
        CASE v_oras_selectat
            WHEN 'alba-iulia' THEN v_localitate_selectata := v_localitati_alba_iulia[1 + floor(random() * array_length(v_localitati_alba_iulia, 1))::INTEGER];
            WHEN 'arad' THEN v_localitate_selectata := v_localitati_arad[1 + floor(random() * array_length(v_localitati_arad, 1))::INTEGER];
            WHEN 'bacau' THEN v_localitate_selectata := v_localitati_bacau[1 + floor(random() * array_length(v_localitati_bacau, 1))::INTEGER];
            WHEN 'baia-mare' THEN v_localitate_selectata := v_localitati_baia_mare[1 + floor(random() * array_length(v_localitati_baia_mare, 1))::INTEGER];
            WHEN 'bistrita' THEN v_localitate_selectata := v_localitati_bistrita[1 + floor(random() * array_length(v_localitati_bistrita, 1))::INTEGER];
            WHEN 'botosani' THEN v_localitate_selectata := v_localitati_botosani[1 + floor(random() * array_length(v_localitati_botosani, 1))::INTEGER];
            WHEN 'braila' THEN v_localitate_selectata := v_localitati_braila[1 + floor(random() * array_length(v_localitati_braila, 1))::INTEGER];
            WHEN 'brasov' THEN v_localitate_selectata := v_localitati_brasov[1 + floor(random() * array_length(v_localitati_brasov, 1))::INTEGER];
            WHEN 'bucuresti' THEN v_localitate_selectata := v_localitati_bucuresti[1 + floor(random() * array_length(v_localitati_bucuresti, 1))::INTEGER];
            WHEN 'buzau' THEN v_localitate_selectata := v_localitati_buzau[1 + floor(random() * array_length(v_localitati_buzau, 1))::INTEGER];
            WHEN 'calafat' THEN v_localitate_selectata := v_localitati_calafat[1 + floor(random() * array_length(v_localitati_calafat, 1))::INTEGER];
            WHEN 'calarasi' THEN v_localitate_selectata := v_localitati_calarasi[1 + floor(random() * array_length(v_localitati_calarasi, 1))::INTEGER];
            WHEN 'campina' THEN v_localitate_selectata := v_localitati_campina[1 + floor(random() * array_length(v_localitati_campina, 1))::INTEGER];
            WHEN 'campulung' THEN v_localitate_selectata := v_localitati_campulung[1 + floor(random() * array_length(v_localitati_campulung, 1))::INTEGER];
            WHEN 'cluj-napoca' THEN v_localitate_selectata := v_localitati_cluj[1 + floor(random() * array_length(v_localitati_cluj, 1))::INTEGER];
            WHEN 'constanta' THEN v_localitate_selectata := v_localitati_constanta[1 + floor(random() * array_length(v_localitati_constanta, 1))::INTEGER];
            WHEN 'craiova' THEN v_localitate_selectata := v_localitati_craiova[1 + floor(random() * array_length(v_localitati_craiova, 1))::INTEGER];
            WHEN 'deva' THEN v_localitate_selectata := v_localitati_deva[1 + floor(random() * array_length(v_localitati_deva, 1))::INTEGER];
            WHEN 'drobeta-turnu-severin' THEN v_localitate_selectata := v_localitati_drobeta_turnu_severin[1 + floor(random() * array_length(v_localitati_drobeta_turnu_severin, 1))::INTEGER];
            WHEN 'focsani' THEN v_localitate_selectata := v_localitati_focsani[1 + floor(random() * array_length(v_localitati_focsani, 1))::INTEGER];
            WHEN 'galati' THEN v_localitate_selectata := v_localitati_galati[1 + floor(random() * array_length(v_localitati_galati, 1))::INTEGER];
            WHEN 'giurgiu' THEN v_localitate_selectata := v_localitati_giurgiu[1 + floor(random() * array_length(v_localitati_giurgiu, 1))::INTEGER];
            WHEN 'iasi' THEN v_localitate_selectata := v_localitati_iasi[1 + floor(random() * array_length(v_localitati_iasi, 1))::INTEGER];
            WHEN 'medias' THEN v_localitate_selectata := v_localitati_medias[1 + floor(random() * array_length(v_localitati_medias, 1))::INTEGER];
            WHEN 'miercurea-ciuc' THEN v_localitate_selectata := v_localitati_miercurea_ciuc[1 + floor(random() * array_length(v_localitati_miercurea_ciuc, 1))::INTEGER];
            WHEN 'oradea' THEN v_localitate_selectata := v_localitati_oradea[1 + floor(random() * array_length(v_localitati_oradea, 1))::INTEGER];
            WHEN 'petrosani' THEN v_localitate_selectata := v_localitati_petrosani[1 + floor(random() * array_length(v_localitati_petrosani, 1))::INTEGER];
            WHEN 'piatra-neamt' THEN v_localitate_selectata := v_localitati_piatra_neamt[1 + floor(random() * array_length(v_localitati_piatra_neamt, 1))::INTEGER];
            WHEN 'pitesti' THEN v_localitate_selectata := v_localitati_pitesti[1 + floor(random() * array_length(v_localitati_pitesti, 1))::INTEGER];
            WHEN 'ploiesti' THEN v_localitate_selectata := v_localitati_ploiesti[1 + floor(random() * array_length(v_localitati_ploiesti, 1))::INTEGER];
            WHEN 'ramnicu-valcea' THEN v_localitate_selectata := v_localitati_ramnicu_valcea[1 + floor(random() * array_length(v_localitati_ramnicu_valcea, 1))::INTEGER];
            WHEN 'ramnicu-sarat' THEN v_localitate_selectata := v_localitati_ramnicu_sarat[1 + floor(random() * array_length(v_localitati_ramnicu_sarat, 1))::INTEGER];
            WHEN 'reghin' THEN v_localitate_selectata := v_localitati_reghin[1 + floor(random() * array_length(v_localitati_reghin, 1))::INTEGER];
            WHEN 'resita' THEN v_localitate_selectata := v_localitati_resita[1 + floor(random() * array_length(v_localitati_resita, 1))::INTEGER];
            WHEN 'roman' THEN v_localitate_selectata := v_localitati_roman[1 + floor(random() * array_length(v_localitati_roman, 1))::INTEGER];
            WHEN 'rosiorii-de-vede' THEN v_localitate_selectata := v_localitati_rosiorii_de_vede[1 + floor(random() * array_length(v_localitati_rosiorii_de_vede, 1))::INTEGER];
            WHEN 'satu-mare' THEN v_localitate_selectata := v_localitati_satu_mare[1 + floor(random() * array_length(v_localitati_satu_mare, 1))::INTEGER];
            WHEN 'sibiu' THEN v_localitate_selectata := v_localitati_sibiu[1 + floor(random() * array_length(v_localitati_sibiu, 1))::INTEGER];
            WHEN 'sighetu-marmatiei' THEN v_localitate_selectata := v_localitati_sighetu_marmatiei[1 + floor(random() * array_length(v_localitati_sighetu_marmatiei, 1))::INTEGER];
            WHEN 'slatina' THEN v_localitate_selectata := v_localitati_slatina[1 + floor(random() * array_length(v_localitati_slatina, 1))::INTEGER];
            WHEN 'slobozia' THEN v_localitate_selectata := v_localitati_slobozia[1 + floor(random() * array_length(v_localitati_slobozia, 1))::INTEGER];
            WHEN 'suceava' THEN v_localitate_selectata := v_localitati_suceava[1 + floor(random() * array_length(v_localitati_suceava, 1))::INTEGER];
            WHEN 'targoviste' THEN v_localitate_selectata := v_localitati_targoviste[1 + floor(random() * array_length(v_localitati_targoviste, 1))::INTEGER];
            WHEN 'targu-jiu' THEN v_localitate_selectata := v_localitati_targu_jiu[1 + floor(random() * array_length(v_localitati_targu_jiu, 1))::INTEGER];
            WHEN 'targu-mures' THEN v_localitate_selectata := v_localitati_targu_mures[1 + floor(random() * array_length(v_localitati_targu_mures, 1))::INTEGER];
            WHEN 'targu-neamt' THEN v_localitate_selectata := v_localitati_targu_neamt[1 + floor(random() * array_length(v_localitati_targu_neamt, 1))::INTEGER];
            WHEN 'targu-secuiesc' THEN v_localitate_selectata := v_localitati_targu_secuiesc[1 + floor(random() * array_length(v_localitati_targu_secuiesc, 1))::INTEGER];
            WHEN 'timisoara' THEN v_localitate_selectata := v_localitati_timisoara[1 + floor(random() * array_length(v_localitati_timisoara, 1))::INTEGER];
            WHEN 'turda' THEN v_localitate_selectata := v_localitati_turda[1 + floor(random() * array_length(v_localitati_turda, 1))::INTEGER];
            WHEN 'turnu-magurele' THEN v_localitate_selectata := v_localitati_turnu_magurele[1 + floor(random() * array_length(v_localitati_turnu_magurele, 1))::INTEGER];
            WHEN 'urziceni' THEN v_localitate_selectata := v_localitati_urziceni[1 + floor(random() * array_length(v_localitati_urziceni, 1))::INTEGER];
            WHEN 'vaslui' THEN v_localitate_selectata := v_localitati_vaslui[1 + floor(random() * array_length(v_localitati_vaslui, 1))::INTEGER];
            WHEN 'zalau' THEN v_localitate_selectata := v_localitati_zalau[1 + floor(random() * array_length(v_localitati_zalau, 1))::INTEGER];
            WHEN 'zarnesti' THEN v_localitate_selectata := v_localitati_zarnesti[1 + floor(random() * array_length(v_localitati_zarnesti, 1))::INTEGER];
        END CASE;
        
        v_localizare := initcap(replace(v_oras_selectat, '-', ' ')) || ', ' || v_localitate_selectata;
        
        -- Generare titlu
        v_titlu := CASE v_tip_oferta 
            WHEN 'vanzare' THEN 'Vand casa ' || v_nr_camere || ' camere, ' || round(v_suprafata_utila) || ' mp, teren ' || round(v_suprafata_teren) || ' mp, ' || v_localizare
            ELSE 'Inchiriez casa ' || v_nr_camere || ' camere, ' || round(v_suprafata_utila) || ' mp, ' || v_localizare
        END;
        
        -- Generare descriere
        v_descriere := 'Casă cu ' || v_nr_camere || ' camere și ' || v_nr_bai || ' băi, suprafața utilă ' || 
                      round(v_suprafata_utila) || ' mp, teren ' || round(v_suprafata_teren) || ' mp. ' ||
                      'Construită în anul ' || v_an_constructie || '. Locație: ' || v_localizare || '.';
        
        v_data_publicare := CURRENT_TIMESTAMP - (random() * 30 || ' days')::INTERVAL;
        
        -- Insert anunt principal
        INSERT INTO anunturi (tip_imobil, tip_oferta, titlu, pret, comision, localizare, descriere, data_publicare)
        VALUES (v_tip_imobil, v_tip_oferta, v_titlu, v_pret, v_comision, v_localizare, v_descriere, v_data_publicare)
        RETURNING id INTO v_anunt_id;
        
        -- Insert detalii casa
        INSERT INTO casee (anunt_id, nr_camere, nr_bai, an_constructie, suprafata_utila, suprafata_teren)
        VALUES (v_anunt_id, v_nr_camere, v_nr_bai, v_an_constructie, v_suprafata_utila, v_suprafata_teren);
        
        -- Insert imagini (10 imagini aleatorii)
        FOR j IN 1..10 LOOP
            INSERT INTO imagini (anunt_id, url, ordine)
            VALUES (v_anunt_id, 'http://localhost:3001/images/image' || (1 + floor(random() * 10)::INTEGER) || '.jpg', j);
        END LOOP;
        
        RAISE NOTICE 'Casa % inserata cu ID %', i, v_anunt_id;
    END LOOP;
    
    -- TERENURI (25 bucati)
    FOR i IN 1..25 LOOP
        v_counter := v_counter + 1;
        v_tip_imobil := 'teren';
        v_tip_oferta := 'vanzare'; -- Terenurile se vand, nu se inchiriaza
        
        -- Generare detalii teren
        v_suprafata_teren := 200 + random() * 2800; -- 200-3000 mp
        v_tip_teren := v_tipuri_teren[1 + floor(random() * array_length(v_tipuri_teren, 1))::INTEGER];
        v_clasificare := v_clasificari[1 + floor(random() * array_length(v_clasificari, 1))::INTEGER];
        v_front_stradal := 10 + random() * 40; -- 10-50 m
        
        -- Generare pret realistic pentru teren
        v_pret := (v_suprafata_teren * (20 + random() * 180))::NUMERIC(12,2); -- 20-200 eur/mp
        v_comision := (random() * 5)::NUMERIC(5,2);
        
        -- Generare localizare
        v_oras_selectat := v_orase[1 + floor(random() * array_length(v_orase, 1))::INTEGER];
        CASE v_oras_selectat
            WHEN 'alba-iulia' THEN v_localitate_selectata := v_localitati_alba_iulia[1 + floor(random() * array_length(v_localitati_alba_iulia, 1))::INTEGER];
            WHEN 'arad' THEN v_localitate_selectata := v_localitati_arad[1 + floor(random() * array_length(v_localitati_arad, 1))::INTEGER];
            WHEN 'bacau' THEN v_localitate_selectata := v_localitati_bacau[1 + floor(random() * array_length(v_localitati_bacau, 1))::INTEGER];
            WHEN 'baia-mare' THEN v_localitate_selectata := v_localitati_baia_mare[1 + floor(random() * array_length(v_localitati_baia_mare, 1))::INTEGER];
            WHEN 'bistrita' THEN v_localitate_selectata := v_localitati_bistrita[1 + floor(random() * array_length(v_localitati_bistrita, 1))::INTEGER];
            WHEN 'botosani' THEN v_localitate_selectata := v_localitati_botosani[1 + floor(random() * array_length(v_localitati_botosani, 1))::INTEGER];
            WHEN 'braila' THEN v_localitate_selectata := v_localitati_braila[1 + floor(random() * array_length(v_localitati_braila, 1))::INTEGER];
            WHEN 'brasov' THEN v_localitate_selectata := v_localitati_brasov[1 + floor(random() * array_length(v_localitati_brasov, 1))::INTEGER];
            WHEN 'bucuresti' THEN v_localitate_selectata := v_localitati_bucuresti[1 + floor(random() * array_length(v_localitati_bucuresti, 1))::INTEGER];
            WHEN 'buzau' THEN v_localitate_selectata := v_localitati_buzau[1 + floor(random() * array_length(v_localitati_buzau, 1))::INTEGER];
            WHEN 'calafat' THEN v_localitate_selectata := v_localitati_calafat[1 + floor(random() * array_length(v_localitati_calafat, 1))::INTEGER];
            WHEN 'calarasi' THEN v_localitate_selectata := v_localitati_calarasi[1 + floor(random() * array_length(v_localitati_calarasi, 1))::INTEGER];
            WHEN 'campina' THEN v_localitate_selectata := v_localitati_campina[1 + floor(random() * array_length(v_localitati_campina, 1))::INTEGER];
            WHEN 'campulung' THEN v_localitate_selectata := v_localitati_campulung[1 + floor(random() * array_length(v_localitati_campulung, 1))::INTEGER];
            WHEN 'cluj-napoca' THEN v_localitate_selectata := v_localitati_cluj[1 + floor(random() * array_length(v_localitati_cluj, 1))::INTEGER];
            WHEN 'constanta' THEN v_localitate_selectata := v_localitati_constanta[1 + floor(random() * array_length(v_localitati_constanta, 1))::INTEGER];
            WHEN 'craiova' THEN v_localitate_selectata := v_localitati_craiova[1 + floor(random() * array_length(v_localitati_craiova, 1))::INTEGER];
            WHEN 'deva' THEN v_localitate_selectata := v_localitati_deva[1 + floor(random() * array_length(v_localitati_deva, 1))::INTEGER];
            WHEN 'drobeta-turnu-severin' THEN v_localitate_selectata := v_localitati_drobeta_turnu_severin[1 + floor(random() * array_length(v_localitati_drobeta_turnu_severin, 1))::INTEGER];
            WHEN 'focsani' THEN v_localitate_selectata := v_localitati_focsani[1 + floor(random() * array_length(v_localitati_focsani, 1))::INTEGER];
            WHEN 'galati' THEN v_localitate_selectata := v_localitati_galati[1 + floor(random() * array_length(v_localitati_galati, 1))::INTEGER];
            WHEN 'giurgiu' THEN v_localitate_selectata := v_localitati_giurgiu[1 + floor(random() * array_length(v_localitati_giurgiu, 1))::INTEGER];
            WHEN 'iasi' THEN v_localitate_selectata := v_localitati_iasi[1 + floor(random() * array_length(v_localitati_iasi, 1))::INTEGER];
            WHEN 'medias' THEN v_localitate_selectata := v_localitati_medias[1 + floor(random() * array_length(v_localitati_medias, 1))::INTEGER];
            WHEN 'miercurea-ciuc' THEN v_localitate_selectata := v_localitati_miercurea_ciuc[1 + floor(random() * array_length(v_localitati_miercurea_ciuc, 1))::INTEGER];
            WHEN 'oradea' THEN v_localitate_selectata := v_localitati_oradea[1 + floor(random() * array_length(v_localitati_oradea, 1))::INTEGER];
            WHEN 'petrosani' THEN v_localitate_selectata := v_localitati_petrosani[1 + floor(random() * array_length(v_localitati_petrosani, 1))::INTEGER];
            WHEN 'piatra-neamt' THEN v_localitate_selectata := v_localitati_piatra_neamt[1 + floor(random() * array_length(v_localitati_piatra_neamt, 1))::INTEGER];
            WHEN 'pitesti' THEN v_localitate_selectata := v_localitati_pitesti[1 + floor(random() * array_length(v_localitati_pitesti, 1))::INTEGER];
            WHEN 'ploiesti' THEN v_localitate_selectata := v_localitati_ploiesti[1 + floor(random() * array_length(v_localitati_ploiesti, 1))::INTEGER];
            WHEN 'ramnicu-valcea' THEN v_localitate_selectata := v_localitati_ramnicu_valcea[1 + floor(random() * array_length(v_localitati_ramnicu_valcea, 1))::INTEGER];
            WHEN 'ramnicu-sarat' THEN v_localitate_selectata := v_localitati_ramnicu_sarat[1 + floor(random() * array_length(v_localitati_ramnicu_sarat, 1))::INTEGER];
            WHEN 'reghin' THEN v_localitate_selectata := v_localitati_reghin[1 + floor(random() * array_length(v_localitati_reghin, 1))::INTEGER];
            WHEN 'resita' THEN v_localitate_selectata := v_localitati_resita[1 + floor(random() * array_length(v_localitati_resita, 1))::INTEGER];
            WHEN 'roman' THEN v_localitate_selectata := v_localitati_roman[1 + floor(random() * array_length(v_localitati_roman, 1))::INTEGER];
            WHEN 'rosiorii-de-vede' THEN v_localitate_selectata := v_localitati_rosiorii_de_vede[1 + floor(random() * array_length(v_localitati_rosiorii_de_vede, 1))::INTEGER];
            WHEN 'satu-mare' THEN v_localitate_selectata := v_localitati_satu_mare[1 + floor(random() * array_length(v_localitati_satu_mare, 1))::INTEGER];
            WHEN 'sibiu' THEN v_localitate_selectata := v_localitati_sibiu[1 + floor(random() * array_length(v_localitati_sibiu, 1))::INTEGER];
            WHEN 'sighetu-marmatiei' THEN v_localitate_selectata := v_localitati_sighetu_marmatiei[1 + floor(random() * array_length(v_localitati_sighetu_marmatiei, 1))::INTEGER];
            WHEN 'slatina' THEN v_localitate_selectata := v_localitati_slatina[1 + floor(random() * array_length(v_localitati_slatina, 1))::INTEGER];
            WHEN 'slobozia' THEN v_localitate_selectata := v_localitati_slobozia[1 + floor(random() * array_length(v_localitati_slobozia, 1))::INTEGER];
            WHEN 'suceava' THEN v_localitate_selectata := v_localitati_suceava[1 + floor(random() * array_length(v_localitati_suceava, 1))::INTEGER];
            WHEN 'targoviste' THEN v_localitate_selectata := v_localitati_targoviste[1 + floor(random() * array_length(v_localitati_targoviste, 1))::INTEGER];
            WHEN 'targu-jiu' THEN v_localitate_selectata := v_localitati_targu_jiu[1 + floor(random() * array_length(v_localitati_targu_jiu, 1))::INTEGER];
            WHEN 'targu-mures' THEN v_localitate_selectata := v_localitati_targu_mures[1 + floor(random() * array_length(v_localitati_targu_mures, 1))::INTEGER];
            WHEN 'targu-neamt' THEN v_localitate_selectata := v_localitati_targu_neamt[1 + floor(random() * array_length(v_localitati_targu_neamt, 1))::INTEGER];
            WHEN 'targu-secuiesc' THEN v_localitate_selectata := v_localitati_targu_secuiesc[1 + floor(random() * array_length(v_localitati_targu_secuiesc, 1))::INTEGER];
            WHEN 'timisoara' THEN v_localitate_selectata := v_localitati_timisoara[1 + floor(random() * array_length(v_localitati_timisoara, 1))::INTEGER];
            WHEN 'turda' THEN v_localitate_selectata := v_localitati_turda[1 + floor(random() * array_length(v_localitati_turda, 1))::INTEGER];
            WHEN 'turnu-magurele' THEN v_localitate_selectata := v_localitati_turnu_magurele[1 + floor(random() * array_length(v_localitati_turnu_magurele, 1))::INTEGER];
            WHEN 'urziceni' THEN v_localitate_selectata := v_localitati_urziceni[1 + floor(random() * array_length(v_localitati_urziceni, 1))::INTEGER];
            WHEN 'vaslui' THEN v_localitate_selectata := v_localitati_vaslui[1 + floor(random() * array_length(v_localitati_vaslui, 1))::INTEGER];
            WHEN 'zalau' THEN v_localitate_selectata := v_localitati_zalau[1 + floor(random() * array_length(v_localitati_zalau, 1))::INTEGER];
            WHEN 'zarnesti' THEN v_localitate_selectata := v_localitati_zarnesti[1 + floor(random() * array_length(v_localitati_zarnesti, 1))::INTEGER];
        END CASE;
        
        v_localizare := initcap(replace(v_oras_selectat, '-', ' ')) || ', ' || v_localitate_selectata;
        
        -- Generare titlu
        v_titlu := 'Vand teren ' || round(v_suprafata_teren) || ' mp, ' || v_tip_teren || ', ' || v_localizare;
        
        -- Generare descriere
        v_descriere := 'Teren ' || v_tip_teren || ' cu suprafața de ' || round(v_suprafata_teren) || 
                      ' mp, clasificare ' || v_clasificare || ', front stradal ' || round(v_front_stradal) || 
                      ' m. Locație: ' || v_localizare || '.';
        
        v_data_publicare := CURRENT_TIMESTAMP - (random() * 30 || ' days')::INTERVAL;
        
        -- Insert anunt principal
        INSERT INTO anunturi (tip_imobil, tip_oferta, titlu, pret, comision, localizare, descriere, data_publicare)
        VALUES (v_tip_imobil, v_tip_oferta, v_titlu, v_pret, v_comision, v_localizare, v_descriere, v_data_publicare)
        RETURNING id INTO v_anunt_id;
        
        -- Insert detalii teren
        INSERT INTO terenuri (anunt_id, suprafata_teren, tip_teren, clasificare, front_stradal)
        VALUES (v_anunt_id, v_suprafata_teren, v_tip_teren, v_clasificare, v_front_stradal);
        
        -- Insert imagini (10 imagini aleatorii)
        FOR j IN 1..10 LOOP
            INSERT INTO imagini (anunt_id, url, ordine)
            VALUES (v_anunt_id, 'http://localhost:3001/images/image' || (1 + floor(random() * 10)::INTEGER) || '.jpg', j);
        END LOOP;
        
        RAISE NOTICE 'Teren % inserat cu ID %', i, v_anunt_id;
    END LOOP;
    
    -- SPATII COMERCIALE (25 bucati)
    FOR i IN 1..25 LOOP
        v_counter := v_counter + 1;
        v_tip_imobil := 'spatiu_comercial';
        v_tip_oferta := CASE WHEN random() < 0.5 THEN 'vanzare' ELSE 'inchiriat' END;
        
        -- Generare detalii spatiu comercial
        v_suprafata_utila := 30 + random() * 470; -- 30-500 mp
        v_nr_camere := 1 + floor(random() * 8)::INTEGER; -- 1-8 spatii
        v_nr_bai := 1 + floor(random() * 3)::INTEGER; -- 1-3 bai
        v_an_constructie := 1980 + floor(random() * 44)::INTEGER; -- 1980-2024
        
        -- Generare pret realistic
        IF v_tip_oferta = 'vanzare' THEN
            v_pret := (v_suprafata_utila * (1000 + random() * 2000))::NUMERIC(12,2); -- 1000-3000 eur/mp
        ELSE
            v_pret := (v_suprafata_utila * (5 + random() * 15))::NUMERIC(12,2); -- 5-20 eur/mp/luna
        END IF;
        
        v_comision := (random() * 5)::NUMERIC(5,2);
        
        -- Generare localizare
        v_oras_selectat := v_orase[1 + floor(random() * array_length(v_orase, 1))::INTEGER];
        CASE v_oras_selectat
            WHEN 'alba-iulia' THEN v_localitate_selectata := v_localitati_alba_iulia[1 + floor(random() * array_length(v_localitati_alba_iulia, 1))::INTEGER];
            WHEN 'arad' THEN v_localitate_selectata := v_localitati_arad[1 + floor(random() * array_length(v_localitati_arad, 1))::INTEGER];
            WHEN 'bacau' THEN v_localitate_selectata := v_localitati_bacau[1 + floor(random() * array_length(v_localitati_bacau, 1))::INTEGER];
            WHEN 'baia-mare' THEN v_localitate_selectata := v_localitati_baia_mare[1 + floor(random() * array_length(v_localitati_baia_mare, 1))::INTEGER];
            WHEN 'bistrita' THEN v_localitate_selectata := v_localitati_bistrita[1 + floor(random() * array_length(v_localitati_bistrita, 1))::INTEGER];
            WHEN 'botosani' THEN v_localitate_selectata := v_localitati_botosani[1 + floor(random() * array_length(v_localitati_botosani, 1))::INTEGER];
            WHEN 'braila' THEN v_localitate_selectata := v_localitati_braila[1 + floor(random() * array_length(v_localitati_braila, 1))::INTEGER];
            WHEN 'brasov' THEN v_localitate_selectata := v_localitati_brasov[1 + floor(random() * array_length(v_localitati_brasov, 1))::INTEGER];
            WHEN 'bucuresti' THEN v_localitate_selectata := v_localitati_bucuresti[1 + floor(random() * array_length(v_localitati_bucuresti, 1))::INTEGER];
            WHEN 'buzau' THEN v_localitate_selectata := v_localitati_buzau[1 + floor(random() * array_length(v_localitati_buzau, 1))::INTEGER];
            WHEN 'calafat' THEN v_localitate_selectata := v_localitati_calafat[1 + floor(random() * array_length(v_localitati_calafat, 1))::INTEGER];
            WHEN 'calarasi' THEN v_localitate_selectata := v_localitati_calarasi[1 + floor(random() * array_length(v_localitati_calarasi, 1))::INTEGER];
            WHEN 'campina' THEN v_localitate_selectata := v_localitati_campina[1 + floor(random() * array_length(v_localitati_campina, 1))::INTEGER];
            WHEN 'campulung' THEN v_localitate_selectata := v_localitati_campulung[1 + floor(random() * array_length(v_localitati_campulung, 1))::INTEGER];
            WHEN 'cluj-napoca' THEN v_localitate_selectata := v_localitati_cluj[1 + floor(random() * array_length(v_localitati_cluj, 1))::INTEGER];
            WHEN 'constanta' THEN v_localitate_selectata := v_localitati_constanta[1 + floor(random() * array_length(v_localitati_constanta, 1))::INTEGER];
            WHEN 'craiova' THEN v_localitate_selectata := v_localitati_craiova[1 + floor(random() * array_length(v_localitati_craiova, 1))::INTEGER];
            WHEN 'deva' THEN v_localitate_selectata := v_localitati_deva[1 + floor(random() * array_length(v_localitati_deva, 1))::INTEGER];
            WHEN 'drobeta-turnu-severin' THEN v_localitate_selectata := v_localitati_drobeta_turnu_severin[1 + floor(random() * array_length(v_localitati_drobeta_turnu_severin, 1))::INTEGER];
            WHEN 'focsani' THEN v_localitate_selectata := v_localitati_focsani[1 + floor(random() * array_length(v_localitati_focsani, 1))::INTEGER];
            WHEN 'galati' THEN v_localitate_selectata := v_localitati_galati[1 + floor(random() * array_length(v_localitati_galati, 1))::INTEGER];
            WHEN 'giurgiu' THEN v_localitate_selectata := v_localitati_giurgiu[1 + floor(random() * array_length(v_localitati_giurgiu, 1))::INTEGER];
            WHEN 'iasi' THEN v_localitate_selectata := v_localitati_iasi[1 + floor(random() * array_length(v_localitati_iasi, 1))::INTEGER];
            WHEN 'medias' THEN v_localitate_selectata := v_localitati_medias[1 + floor(random() * array_length(v_localitati_medias, 1))::INTEGER];
            WHEN 'miercurea-ciuc' THEN v_localitate_selectata := v_localitati_miercurea_ciuc[1 + floor(random() * array_length(v_localitati_miercurea_ciuc, 1))::INTEGER];
            WHEN 'oradea' THEN v_localitate_selectata := v_localitati_oradea[1 + floor(random() * array_length(v_localitati_oradea, 1))::INTEGER];
            WHEN 'petrosani' THEN v_localitate_selectata := v_localitati_petrosani[1 + floor(random() * array_length(v_localitati_petrosani, 1))::INTEGER];
            WHEN 'piatra-neamt' THEN v_localitate_selectata := v_localitati_piatra_neamt[1 + floor(random() * array_length(v_localitati_piatra_neamt, 1))::INTEGER];
            WHEN 'pitesti' THEN v_localitate_selectata := v_localitati_pitesti[1 + floor(random() * array_length(v_localitati_pitesti, 1))::INTEGER];
            WHEN 'ploiesti' THEN v_localitate_selectata := v_localitati_ploiesti[1 + floor(random() * array_length(v_localitati_ploiesti, 1))::INTEGER];
            WHEN 'ramnicu-valcea' THEN v_localitate_selectata := v_localitati_ramnicu_valcea[1 + floor(random() * array_length(v_localitati_ramnicu_valcea, 1))::INTEGER];
            WHEN 'ramnicu-sarat' THEN v_localitate_selectata := v_localitati_ramnicu_sarat[1 + floor(random() * array_length(v_localitati_ramnicu_sarat, 1))::INTEGER];
            WHEN 'reghin' THEN v_localitate_selectata := v_localitati_reghin[1 + floor(random() * array_length(v_localitati_reghin, 1))::INTEGER];
            WHEN 'resita' THEN v_localitate_selectata := v_localitati_resita[1 + floor(random() * array_length(v_localitati_resita, 1))::INTEGER];
            WHEN 'roman' THEN v_localitate_selectata := v_localitati_roman[1 + floor(random() * array_length(v_localitati_roman, 1))::INTEGER];
            WHEN 'rosiorii-de-vede' THEN v_localitate_selectata := v_localitati_rosiorii_de_vede[1 + floor(random() * array_length(v_localitati_rosiorii_de_vede, 1))::INTEGER];
            WHEN 'satu-mare' THEN v_localitate_selectata := v_localitati_satu_mare[1 + floor(random() * array_length(v_localitati_satu_mare, 1))::INTEGER];
            WHEN 'sibiu' THEN v_localitate_selectata := v_localitati_sibiu[1 + floor(random() * array_length(v_localitati_sibiu, 1))::INTEGER];
            WHEN 'sighetu-marmatiei' THEN v_localitate_selectata := v_localitati_sighetu_marmatiei[1 + floor(random() * array_length(v_localitati_sighetu_marmatiei, 1))::INTEGER];
            WHEN 'slatina' THEN v_localitate_selectata := v_localitati_slatina[1 + floor(random() * array_length(v_localitati_slatina, 1))::INTEGER];
            WHEN 'slobozia' THEN v_localitate_selectata := v_localitati_slobozia[1 + floor(random() * array_length(v_localitati_slobozia, 1))::INTEGER];
            WHEN 'suceava' THEN v_localitate_selectata := v_localitati_suceava[1 + floor(random() * array_length(v_localitati_suceava, 1))::INTEGER];
            WHEN 'targoviste' THEN v_localitate_selectata := v_localitati_targoviste[1 + floor(random() * array_length(v_localitati_targoviste, 1))::INTEGER];
            WHEN 'targu-jiu' THEN v_localitate_selectata := v_localitati_targu_jiu[1 + floor(random() * array_length(v_localitati_targu_jiu, 1))::INTEGER];
            WHEN 'targu-mures' THEN v_localitate_selectata := v_localitati_targu_mures[1 + floor(random() * array_length(v_localitati_targu_mures, 1))::INTEGER];
            WHEN 'targu-neamt' THEN v_localitate_selectata := v_localitati_targu_neamt[1 + floor(random() * array_length(v_localitati_targu_neamt, 1))::INTEGER];
            WHEN 'targu-secuiesc' THEN v_localitate_selectata := v_localitati_targu_secuiesc[1 + floor(random() * array_length(v_localitati_targu_secuiesc, 1))::INTEGER];
            WHEN 'timisoara' THEN v_localitate_selectata := v_localitati_timisoara[1 + floor(random() * array_length(v_localitati_timisoara, 1))::INTEGER];
            WHEN 'turda' THEN v_localitate_selectata := v_localitati_turda[1 + floor(random() * array_length(v_localitati_turda, 1))::INTEGER];
            WHEN 'turnu-magurele' THEN v_localitate_selectata := v_localitati_turnu_magurele[1 + floor(random() * array_length(v_localitati_turnu_magurele, 1))::INTEGER];
            WHEN 'urziceni' THEN v_localitate_selectata := v_localitati_urziceni[1 + floor(random() * array_length(v_localitati_urziceni, 1))::INTEGER];
            WHEN 'vaslui' THEN v_localitate_selectata := v_localitati_vaslui[1 + floor(random() * array_length(v_localitati_vaslui, 1))::INTEGER];
            WHEN 'zalau' THEN v_localitate_selectata := v_localitati_zalau[1 + floor(random() * array_length(v_localitati_zalau, 1))::INTEGER];
            WHEN 'zarnesti' THEN v_localitate_selectata := v_localitati_zarnesti[1 + floor(random() * array_length(v_localitati_zarnesti, 1))::INTEGER];
        END CASE;
        
        v_localizare := initcap(replace(v_oras_selectat, '-', ' ')) || ', ' || v_localitate_selectata;
        
        -- Generare titlu
        v_titlu := CASE v_tip_oferta 
            WHEN 'vanzare' THEN 'Vand spatiu comercial ' || round(v_suprafata_utila) || ' mp, ' || v_localizare
            ELSE 'Inchiriez spatiu comercial ' || round(v_suprafata_utila) || ' mp, ' || v_localizare
        END;
        
        -- Generare descriere
        v_descriere := 'Spațiu comercial cu suprafața utilă de ' || round(v_suprafata_utila) || 
                      ' mp, ' || v_nr_camere || ' spații și ' || v_nr_bai || ' băi. ' ||
                      'Construit în anul ' || v_an_constructie || '. Locație: ' || v_localizare || '.';
        
        v_data_publicare := CURRENT_TIMESTAMP - (random() * 30 || ' days')::INTERVAL;
        
        -- Insert anunt principal
        INSERT INTO anunturi (tip_imobil, tip_oferta, titlu, pret, comision, localizare, descriere, data_publicare)
        VALUES (v_tip_imobil, v_tip_oferta, v_titlu, v_pret, v_comision, v_localizare, v_descriere, v_data_publicare)
        RETURNING id INTO v_anunt_id;
        
        -- Insert detalii spatiu comercial
        INSERT INTO spatii_comerciale (anunt_id, suprafata_utila, nr_camere, nr_bai, an_constructie)
        VALUES (v_anunt_id, v_suprafata_utila, v_nr_camere, v_nr_bai, v_an_constructie);
        
        -- Insert imagini (10 imagini aleatorii)
        FOR j IN 1..10 LOOP
            INSERT INTO imagini (anunt_id, url, ordine)
            VALUES (v_anunt_id, 'http://localhost:3001/images/image' || (1 + floor(random() * 10)::INTEGER) || '.jpg', j);
        END LOOP;
        
        RAISE NOTICE 'Spatiu comercial % inserat cu ID %', i, v_anunt_id;
    END LOOP;
    
    -- Afisare sumar final
    RAISE NOTICE '========================================';
    RAISE NOTICE 'POPULARE FINALIZATA CU SUCCES!';
    RAISE NOTICE 'Total anunturi create: %', v_counter;
    RAISE NOTICE '- Apartamente: 25';
    RAISE NOTICE '- Case: 25'; 
    RAISE NOTICE '- Terenuri: 25';
    RAISE NOTICE '- Spatii comerciale: 25';
    RAISE NOTICE 'Total imagini create: %', v_counter * 10;
    RAISE NOTICE '========================================';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'EROARE la inserarea anuntului %: % - %', v_counter, SQLSTATE, SQLERRM;
        RAISE;
END 
$$;