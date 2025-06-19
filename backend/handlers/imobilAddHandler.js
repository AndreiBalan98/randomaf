async function handleImobilAdd(req, res) {
    const pool = require('../config/database');

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
        const data = JSON.parse(body);
        const mainQuery = `
            INSERT INTO imobile (titlu, pret, locatie, descriere, tip, tranzactie)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;
        const mainValues = [
            data.titlu, data.pret, data.locatie, data.descriere, data.tip, data.tranzactie
        ];
        const client = await pool.connect();
        try {
            const mainResult = await client.query(mainQuery, mainValues);
            const imobilId = mainResult.rows[0].id;

            if (data.tip === 'apartament') {
                await client.query(
                    `INSERT INTO apartamente (imobil_id, suprafata_utila, nr_camere, nr_bai, compartimentare, confort, etaj, an_constructie)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
                    [
                    imobilId, data.suprafataUtila, data.nrCamere, data.nrBai,
                    data.compartimentare, data.confort, data.etaj, data.anConstructie
                    ]
                );
            } else if (data.tip === 'casee' || data.tip === 'casa') {
                await client.query(
                    `INSERT INTO casee (imobil_id, suprafata_utila, suprafata_teren, nr_camere, nr_bai, an_constructie, alte_dotari)
                    VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                    [
                    imobilId, data.suprafataUtila, data.suprafataTeren, data.nrCamere,
                    data.nrBai, data.anConstructie, data.alteDotari
                    ]
                );
            } else if (data.tip === 'teren') {
                await client.query(
                    `INSERT INTO terenuri (imobil_id, suprafata_teren, tip_teren, clasificare, front_stradal)
                    VALUES ($1,$2,$3,$4,$5)`,
                    [
                    imobilId, data.suprafataTeren, data.tipTeren, data.clasificare, data.frontStradal
                    ]
                );
            } else if (data.tip === 'spatiu-comercial') {
                await client.query(
                    `INSERT INTO spatii_comerciale (imobil_id, suprafata_utila, alte_dotari)
                    VALUES ($1,$2,$3)`,
                    [
                    imobilId, data.suprafataUtila, data.alteDotari
                    ]
                );
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok', mesaj: 'Anunț salvat!', id: imobilId }));
        } catch (err) {
            console.error('Eroare la inserare:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', mesaj: 'Eroare la salvare în baza de date!' }));
        } finally {
            client.release();
        }
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', mesaj: 'Date invalide!' }));
        }
    });
}

module.exports = handleImobilAdd;