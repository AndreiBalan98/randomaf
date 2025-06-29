const pool = require('../config/database');

function handleOraseGet(req, res) {
    pool.query('SELECT id, nume FROM orase ORDER BY nume')
        .then(result => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.rows));
        })
        .catch(err => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Eroare la interogarea orașelor' }));
        });
}

module.exports = handleOraseGet;