const pool = require('../config/database');

function handleOraseAdd(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const { nume } = JSON.parse(body);
            
            if (!nume || !nume.trim()) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Numele orasului este obligatoriu' }));

                return;
            }
            
            pool.query('INSERT INTO orase (nume) VALUES ($1) RETURNING id, nume', [nume.trim()])
                .then(result => {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result.rows[0]));
                })
                .catch(err => {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Eroare la crearea orasului' }));
                });
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Date invalide' }));
        }
    });
}

module.exports = handleOraseAdd;