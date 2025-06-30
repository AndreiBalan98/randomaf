const pool = require('../config/database');

function handleLocalitatiAdd(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const { nume, oras_id } = JSON.parse(body);
            
            if (!nume || !nume.trim() || !oras_id) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Numele localitatii si oras_id sunt obligatorii' }));

                return;
            }
            
            pool.query('INSERT INTO localitati (nume, oras_id) VALUES ($1, $2) RETURNING id, nume, oras_id', 
                      [nume.trim(), oras_id])
                .then(result => {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result.rows[0]));
                })
                .catch(err => {
                    if (err.code === '23505') { 
                        res.writeHead(409, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Localitatea exista deja in acest oras' }));
                    } else if (err.code === '23503') {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Orasul specificat nu exista' }));
                    } else {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Eroare la crearea localitatii' }));
                    }
                });
        } catch (err) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Date invalide' }));
        }
    });
}

module.exports = handleLocalitatiAdd;