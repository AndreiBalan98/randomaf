function handleImobileAdd(req, res) {
    const pool = require('../config/database');
    
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            
            // Validare date obligatorii
            if (!data.tip_imobil || !data.tip_oferta || !data.titlu || !data.pret) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', mesaj: 'Date obligatorii lipsesc!' }));
                return;
            }
            
            // 1. Inserare în tabela anunturi
            const anuntSql = `
                INSERT INTO anunturi (tip_imobil, tip_oferta, titlu, pret, comision, localizare, descriere)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            `;
            
            const anuntParams = [
                data.tip_imobil,
                data.tip_oferta,
                data.titlu,
                data.pret,
                data.comision || null,
                data.localizare || null,
                data.descriere || null
            ];
            
            pool.query(anuntSql, anuntParams, (err, result) => {
                if (err) {
                    console.error('Eroare inserare anunt:', err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'error', mesaj: 'Eroare la salvarea anuntului!' }));
                    return;
                }
                
                const anuntId = result.rows[0].id;
                console.log('Anunt ID creat:', anuntId);
                
                // 2. Inserare date specifice în funcție de tip
                insertSpecificData(pool, data.tip_imobil, anuntId, data.detalii_specifice, (err) => {
                    if (err) {
                        console.error('Eroare inserare detalii specifice:', err);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ status: 'error', mesaj: 'Eroare la salvarea detaliilor!' }));
                        return;
                    }
                    
                    // 3. Inserare imagini (dacă există)
                    if (data.imagini && data.imagini.length > 0) {
                        console.log('Inserez imagini pentru anuntId:', anuntId);
                        insertImages(pool, anuntId, data.imagini, (err) => {
                            if (err) {
                                console.error('Eroare inserare imagini:', err);
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ status: 'error', mesaj: 'Eroare la salvarea imaginilor!' }));
                                return;
                            }
                            
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ 
                                status: 'success', 
                                mesaj: 'Anunt adăugat cu succes!',
                                id: anuntId 
                            }));
                        });
                    } else {
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ 
                            status: 'success', 
                            mesaj: 'Anunt adăugat cu succes!',
                            id: anuntId 
                        }));
                    }
                });
            });
            
        } catch (error) {
            console.error('Eroare JSON parse:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', mesaj: 'Date JSON invalide!' }));
        }
    });
}

function insertSpecificData(pool, tipImobil, anuntId, detalii, callback) {
    if (!detalii) {
        callback(null);
        return;
    }
    
    let sql, params;
    
    switch (tipImobil) {
        case 'apartament':
            sql = `
                INSERT INTO apartamente (anunt_id, nr_camere, nr_bai, compartimentare, confort, etaj, an_constructie, suprafata_utila)
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
                INSERT INTO casee (anunt_id, nr_camere, nr_bai, an_constructie, suprafata_utila, suprafata_teren)
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
                INSERT INTO terenuri (anunt_id, suprafata_teren, tip_teren, clasificare, front_stradal)
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
                INSERT INTO spatii_comerciale (anunt_id, suprafata_utila, nr_camere, nr_bai, an_constructie)
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
            callback(null);
            return;
    }
    
    pool.query(sql, params, callback);
}

function insertImages(pool, anuntId, imagini, callback) {
    if (!imagini || imagini.length === 0) {
        callback(null);
        return;
    }
    
    let completed = 0;
    let hasError = false;
    
    imagini.forEach((img, index) => {
        if (hasError) return;
        
        const sql = `INSERT INTO imagini (anunt_id, url, ordine) VALUES ($1, $2, $3)`;
        const params = [anuntId, img.url, img.ordine || (index + 1)];
        
        pool.query(sql, params, (err) => {
            if (err && !hasError) {
                hasError = true;
                callback(err);
                return;
            }
            
            completed++;
            if (completed === imagini.length && !hasError) {
                callback(null);
            }
        });
    });
}

module.exports = handleImobileAdd;