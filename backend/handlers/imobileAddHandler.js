const pool = require('../config/database');
const { getActiveSession } = require('../auth/sessions');
const { parseCookies } = require('../utils/helperFunctions');

async function handleImobileAdd(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', async () => {
        try {
            const anunt = JSON.parse(body);
            
            const cookies = parseCookies(req.headers.cookie || '');
            const sessionToken = cookies.session_token;
            const userSession = getActiveSession(sessionToken);
            
            if (!userSession || !userSession.id) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', mesaj: 'Utilizator neautentificat!' }));
                
                return;
            }
            
            const anuntSql = `
                INSERT INTO anunturi (id_user, tip_imobil, tip_oferta, titlu, pret, comision, 
                                    oras_id, localitate_id, strada, latitudine, longitudine, 
                                    descriere, data_publicare)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP)
                RETURNING id
            `;
            
            const anuntParams = [
                userSession.id,
                anunt.tip_imobil,
                anunt.tip_oferta,
                anunt.titlu,
                anunt.pret,
                anunt.comision || null,
                anunt.oras_id || null,
                anunt.localitate_id || null,
                anunt.strada || null,
                anunt.latitudine || null,
                anunt.longitudine || null,
                anunt.descriere || null
            ];
            
            const anuntResult = await pool.query(anuntSql, anuntParams);
            const anuntId = anuntResult.rows[0].id;
            
            if (anunt.detalii_specifice) {
                await insertDetaliiSpecifice(anunt.tip_imobil, anuntId, anunt.detalii_specifice);
            }
            
            if (anunt.imagini && anunt.imagini.length > 0) {
                await insertImages(anuntId, anunt.imagini);
            }
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'success',
                mesaj: 'Anunt adaugat cu succes!',
                id: anuntId
            }));
            
        } catch (error) {
            console.error('Eroare:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', mesaj: error.message }));
        }
    });
}

async function insertDetaliiSpecifice(tipImobil, anuntId, detalii) {
    let sql, params;
    
    switch (tipImobil) {
        case 'apartament':
            sql = `
                INSERT INTO apartamente (anunt_id, nr_camere, nr_bai, compartimentare, 
                                       confort, etaj, an_constructie, suprafata_utila)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `;
            params = [
                anuntId,
                detalii.nr_camere || null,
                detalii.nr_bai || null,
                detalii.compartimentare || null,
                detalii.confort || null,
                detalii.etaj || null,
                detalii.an_constructie || null,
                detalii.suprafata_utila || null
            ];
            break;
            
        case 'casa':
            sql = `
                INSERT INTO casee (anunt_id, nr_camere, nr_bai, an_constructie, 
                                  suprafata_utila, suprafata_teren)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            params = [
                anuntId,
                detalii.nr_camere || null,
                detalii.nr_bai || null,
                detalii.an_constructie || null,
                detalii.suprafata_utila || null,
                detalii.suprafata_teren || null
            ];
            break;
            
        case 'teren':
            sql = `
                INSERT INTO terenuri (anunt_id, suprafata_teren, tip_teren, 
                                     clasificare, front_stradal)
                VALUES ($1, $2, $3, $4, $5)
            `;
            params = [
                anuntId,
                detalii.suprafata_teren || null,
                detalii.tip_teren || null,
                detalii.clasificare || null,
                detalii.front_stradal || null
            ];
            break;
            
        case 'spatiu_comercial':
            sql = `
                INSERT INTO spatii_comerciale (anunt_id, suprafata_utila, nr_camere, 
                                              nr_bai, an_constructie)
                VALUES ($1, $2, $3, $4, $5)
            `;
            params = [
                anuntId,
                detalii.suprafata_utila || null,
                detalii.nr_camere || null,
                detalii.nr_bai || null,
                detalii.an_constructie || null
            ];
            break;
            
        default:
            return;
    }
    
    await pool.query(sql, params);
}

async function insertImages(anuntId, imagini) {
    const promises = imagini.map((img, index) => {
        const sql = `INSERT INTO imagini (anunt_id, url, ordine) VALUES ($1, $2, $3)`;
        const params = [anuntId, img.url, img.ordine];
        
        return pool.query(sql, params);
    });
    
    await Promise.all(promises);
}

module.exports = handleImobileAdd;