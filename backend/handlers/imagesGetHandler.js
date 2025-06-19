const pool = require('../config/database');

function handleImagesGet(req, res) {
    const id = req.url.split('/').pop();
    pool.query('SELECT url FROM imagini_imobil WHERE imobil_id = $1 ORDER BY id ASC', [id], (err, result) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([]));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result.rows));
    });
}

module.exports = handleImagesGet;