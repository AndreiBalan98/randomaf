const url = require('url');
const pool = require('../config/database');

function handleImagesGet(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const anuntId = parsedUrl.query.idAnunt;
    
    if (!anuntId || isNaN(anuntId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'ID anunt invalid' }));
        
        return;
    }
    
    const parsedId = parseInt(anuntId);
    const query = 'SELECT id, url, ordine FROM imagini WHERE anunt_id = $1 ORDER BY ordine ASC';
    
    pool.query(query, [parsedId])
        .then(result => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        })
        .catch(err => {
            console.error('Eroare la interogarea bazei de date:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Eroare server', details: err.message }));
        });
}

module.exports = handleImagesGet;