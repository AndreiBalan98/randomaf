const pool = require('../config/database');

function handleLocalitatiGet(req, res) {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const orasId = urlObj.searchParams.get('oras_id');

    if (!orasId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Parametrul oras_id este obligatoriu' }));
        
        return;
    }

    pool.query('SELECT id, nume FROM localitati WHERE oras_id = $1 ORDER BY nume', [orasId])
        .then(result => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        })
        .catch(err => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Eroare la interogarea localitatilor' }));
        });
}

module.exports = handleLocalitatiGet;