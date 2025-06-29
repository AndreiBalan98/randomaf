const pool = require('../config/database');

function handleImobileGet(req, res) {
    let sql = `
        SELECT 
            a.id,
            a.id_user,
            a.tip_imobil,
            a.tip_oferta,
            a.titlu,
            a.pret,
            a.comision,
            a.oras_id,
            a.localitate_id,
            a.strada,
            a.latitudine,
            a.longitudine,
            a.descriere,
            a.data_publicare,
            -- Apartamente
            ap.nr_camere as ap_nr_camere,
            ap.nr_bai as ap_nr_bai,
            ap.compartimentare,
            ap.confort,
            ap.etaj,
            ap.an_constructie as ap_an_constructie,
            ap.suprafata_utila as ap_suprafata_utila,
            -- Case
            c.nr_camere as c_nr_camere,
            c.nr_bai as c_nr_bai,
            c.an_constructie as c_an_constructie,
            c.suprafata_utila as c_suprafata_utila,
            c.suprafata_teren as c_suprafata_teren,
            -- Terenuri
            t.suprafata_teren as t_suprafata_teren,
            t.tip_teren,
            t.clasificare,
            t.front_stradal,
            -- Spatii comerciale
            sc.suprafata_utila as sc_suprafata_utila,
            sc.nr_camere as sc_nr_camere,
            sc.nr_bai as sc_nr_bai,
            sc.an_constructie as sc_an_constructie
        FROM anunturi a
        LEFT JOIN apartamente ap ON a.id = ap.anunt_id
        LEFT JOIN casee c ON a.id = c.anunt_id
        LEFT JOIN terenuri t ON a.id = t.anunt_id
        LEFT JOIN spatii_comerciale sc ON a.id = sc.anunt_id
        WHERE 1=1
    `;
    
    const query = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const params = [];
    let paramIndex = 1;

    if (query.get('minPrice')) {
        sql += ` AND a.pret >= $${paramIndex}`;
        params.push(parseFloat(query.get('minPrice')));
        paramIndex++;
    }

    if (query.get('maxPrice')) {
        sql += ` AND a.pret <= $${paramIndex}`;
        params.push(parseFloat(query.get('maxPrice')));
        paramIndex++;
    }

    if (query.get('tip')) {
        sql += ` AND a.tip_imobil = $${paramIndex}`;
        params.push(query.get('tip'));
        paramIndex++;
    }

    if (query.get('oferta')) {
        sql += ` AND a.tip_oferta = $${paramIndex}`;
        params.push(query.get('oferta'));
        paramIndex++;
    }

    if (query.get('oras')) {
        sql += ` AND a.oras_id = $${paramIndex}`;
        params.push(parseInt(query.get('oras')));
        paramIndex++;
    }

    if (query.get('localitate')) {
        sql += ` AND a.localitate_id = $${paramIndex}`;
        params.push(parseInt(query.get('localitate')));
        paramIndex++;
    }

    if (query.get('userId')) {
        sql += ` AND a.id_user = $${paramIndex}`;
        params.push(parseInt(query.get('userId')));
        paramIndex++;
    }

    pool.query(sql, params).then(result => {
        if (result.rows.length === 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([]));
            return;
        }

        let filteredRows = result.rows;
        if (query.get('search')) {
            const searchTerms = query.get('search').split(',').map(term => term.trim().toLowerCase()).filter(term => term.length > 0);
            if (searchTerms.length > 0) {
                filteredRows = result.rows.filter(row => {
                    const descriere = row.descriere ? row.descriere.toLowerCase() : '';
                    return searchTerms.some(term => descriere.includes(term));
                });
            }
        }

        if (filteredRows.length === 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([]));
            return;
        }

        const anuntIds = filteredRows.map(row => row.id);
        const imaginiSql = `SELECT anunt_id, url, ordine FROM imagini WHERE anunt_id = ANY($1) ORDER BY anunt_id, ordine`;

        pool.query(imaginiSql, [anuntIds]).then(resultImagini => {
            const imaginiMap = {};
            resultImagini.rows.forEach(img => {
                if (!imaginiMap[img.anunt_id]) {
                    imaginiMap[img.anunt_id] = [];
                }

                imaginiMap[img.anunt_id].push(
                    {
                        url: img.url,
                        ordine: img.ordine
                    }
                );
            });

            const anunturi = filteredRows.map(row => {
                const anunt = {
                    id: row.id,
                    id_user: row.id_user,
                    tip_imobil: row.tip_imobil,
                    tip_oferta: row.tip_oferta,
                    titlu: row.titlu,
                    pret: parseFloat(row.pret),
                    comision: row.comision ? parseFloat(row.comision) : null,
                    oras_id: row.oras_id,
                    localitate_id: row.localitate_id,
                    strada: row.strada,
                    latitudine: row.latitudine,
                    longitudine: row.longitudine,
                    descriere: row.descriere,
                    data_publicare: row.data_publicare
                };

                switch (row.tip_imobil) {
                    case 'apartament':
                        anunt.detalii_specifice = {
                            nr_camere: row.ap_nr_camere,
                            nr_bai: row.ap_nr_bai,
                            compartimentare: row.compartimentare,
                            confort: row.confort,
                            etaj: row.etaj,
                            an_constructie: row.ap_an_constructie,
                            suprafata_utila: row.ap_suprafata_utila ? parseFloat(row.ap_suprafata_utila) : null
                        };
                        break;
                    case 'casa':
                        anunt.detalii_specifice = {
                            nr_camere: row.c_nr_camere,
                            nr_bai: row.c_nr_bai,
                            an_constructie: row.c_an_constructie,
                            suprafata_utila: row.c_suprafata_utila ? parseFloat(row.c_suprafata_utila) : null,
                            suprafata_teren: row.c_suprafata_teren ? parseFloat(row.c_suprafata_teren) : null
                        };
                        break;
                    case 'teren':
                        anunt.detalii_specifice = {
                            suprafata_teren: row.t_suprafata_teren ? parseFloat(row.t_suprafata_teren) : null,
                            tip_teren: row.tip_teren,
                            clasificare: row.clasificare,
                            front_stradal: row.front_stradal ? parseFloat(row.front_stradal) : null
                        };
                        break;
                    case 'spatiu_comercial':
                        anunt.detalii_specifice = {
                            suprafata_utila: row.sc_suprafata_utila ? parseFloat(row.sc_suprafata_utila) : null,
                            nr_camere: row.sc_nr_camere,
                            nr_bai: row.sc_nr_bai,
                            an_constructie: row.sc_an_constructie
                        };
                        break;
                    default:
                        anunt.detalii_specifice = {};
                }

                anunt.imagini = imaginiMap[row.id] || [];
                
                return anunt;
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(anunturi));
        });
    });
}

module.exports = handleImobileGet;