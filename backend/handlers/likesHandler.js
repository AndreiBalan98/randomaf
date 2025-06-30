const pool = require('../config/database');
const { getActiveSession } = require('../auth/sessions');
const { parseCookies } = require('../utils/helperFunctions');

async function handleLikeToggle(req, res) {
    try {
        const url = new URL(req.url, `http://${req.headers.host}`);
        let anuntId;
        
        const pathParts = url.pathname.split('/');
        const likesIndex = pathParts.indexOf('likes');

        if (likesIndex !== -1 && pathParts[likesIndex + 1]) {
            anuntId = parseInt(pathParts[likesIndex + 1]);
        } else {
            anuntId = parseInt(url.searchParams.get('anuntId'));
        }
        
        if (!anuntId || isNaN(anuntId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'ID anunt invalid' }));
            return;
        }
        
        const cookies = parseCookies(req.headers.cookie || '');
        const sessionToken = cookies.session_token;
        const userSession = getActiveSession(sessionToken);
        
        if (!userSession || !userSession.id) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Neautentificat' }));
            return;
        }
        
        if (req.method === 'POST') {
            const checkResult = await pool.query(
                'SELECT * FROM likes WHERE user_id = $1 AND anunt_id = $2',
                [userSession.id, anuntId]
            );
            
            let liked;

            if (checkResult.rows.length > 0) {
                await pool.query(
                    'DELETE FROM likes WHERE user_id = $1 AND anunt_id = $2',
                    [userSession.id, anuntId]
                );
                liked = false;
            } else {
                await pool.query(
                    'INSERT INTO likes (user_id, anunt_id) VALUES ($1, $2)',
                    [userSession.id, anuntId]
                );
                liked = true;
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ liked }));
            
        } else if (req.method === 'GET') {
            const result = await pool.query(
                'SELECT * FROM likes WHERE user_id = $1 AND anunt_id = $2',
                [userSession.id, anuntId]
            );
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ liked: result.rows.length > 0 }));
        }
        
    } catch (error) {
        console.error('Eroare likes:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Eroare server' }));
    }
}

async function handleGetFavorites(req, res) {
    try {
        const cookies = parseCookies(req.headers.cookie || '');
        const sessionToken = cookies.session_token;
        const userSession = getActiveSession(sessionToken);
        
        if (!userSession || !userSession.id) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Neautentificat' }));
            return;
        }
        
        const sql = `
            SELECT 
                a.*,
                l.data_adaugare as liked_at,
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
            FROM likes l
            JOIN anunturi a ON l.anunt_id = a.id
            LEFT JOIN apartamente ap ON a.id = ap.anunt_id
            LEFT JOIN casee c ON a.id = c.anunt_id
            LEFT JOIN terenuri t ON a.id = t.anunt_id
            LEFT JOIN spatii_comerciale sc ON a.id = sc.anunt_id
            WHERE l.user_id = $1
            ORDER BY l.data_adaugare DESC
        `;
        
        const result = await pool.query(sql, [userSession.id]);
        
        if (result.rows.length === 0) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([]));
            return;
        }
        
        const anuntIds = result.rows.map(row => row.id);
        const imaginiResult = await pool.query(
            'SELECT anunt_id, url, ordine FROM imagini WHERE anunt_id = ANY($1) ORDER BY anunt_id, ordine',
            [anuntIds]
        );
        
        const imaginiMap = {};
        imaginiResult.rows.forEach(img => {
            if (!imaginiMap[img.anunt_id]) {
                imaginiMap[img.anunt_id] = [];
            }
            imaginiMap[img.anunt_id].push({
                url: img.url,
                ordine: img.ordine
            });
        });
        
        const anunturi = result.rows.map(row => {
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
                data_publicare: row.data_publicare,
                liked_at: row.liked_at
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
        
    } catch (error) {
        console.error('Eroare favorites:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Eroare server' }));
    }
}

module.exports = { handleLikeToggle, handleGetFavorites };