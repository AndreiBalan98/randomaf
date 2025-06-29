const bcrypt = require('bcrypt');
const pool = require('../config/database');

async function handleSignUp(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', async () => {
        try {
            const { username, email, password } = JSON.parse(body);
            
            if (!username || !email || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Toate campurile sunt obligatorii!' 
                }));

                return;
            }
            
            if (username.length < 3) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Username-ul trebuie sa aiba minim 3 caractere!' 
                }));

                return;
            }
            
            if (password.length < 6) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Parola trebuie sa aiba minim 6 caractere!' 
                }));

                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Format email invalid!' 
                }));

                return;
            }
            
            const checkResult = await pool.query(
                'SELECT id FROM users WHERE username = $1 OR email = $2',
                [username, email]
            );
            
            if (checkResult.rows.length > 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Username-ul sau email-ul exista deja!' 
                }));

                return;
            }
            
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            
            const insertResult = await pool.query(
                `INSERT INTO users (username, email, password_hash)
                 VALUES ($1, $2, $3)
                 RETURNING id, username, email, data_inregistrare`,
                [username, email, passwordHash]
            );
            
            const newUser = insertResult.rows[0];
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: true, 
                message: 'Cont creat cu succes!',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    data_inregistrare: newUser.data_inregistrare
                }
            }));
            
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                message: 'Eroare la crearea contului!' 
            }));
        }
    });
}

module.exports = handleSignUp;