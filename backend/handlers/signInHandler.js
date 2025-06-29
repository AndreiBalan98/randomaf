const bcrypt = require('bcrypt');
const crypto = require('crypto');
const pool = require('../config/database');
const { addSession } = require('../auth/sessions');

async function handleSignIn(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', async () => {
        try {
            const { username, password } = JSON.parse(body);
            
            if (!username || !password) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Username si parola sunt obligatorii!' 
                }));

                return;
            }
            
            const result = await pool.query(
                'SELECT id, username, email, password_hash, data_inregistrare FROM users WHERE username = $1',
                [username]
            );
            
            if (result.rows.length === 0) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Username sau parola incorecta!' 
                }));

                return;
            }
            
            const user = result.rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            
            if (!isPasswordValid) {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Username sau parola incorecta!' 
                }));

                return;
            }
            
            const sessionToken = crypto.randomBytes(32).toString('hex');
            
            const userSession = {
                id: user.id,
                username: user.username,
                email: user.email,
                data_inregistrare: user.data_inregistrare,
                loginTime: new Date()
            };
            
            addSession(sessionToken, userSession);
            
            const cookieOptions = [
                `session_token=${sessionToken}`,
                'HttpOnly',
                'Path=/',
                'Max-Age=86400',
                'SameSite=Strict'
            ];
            
            res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Set-Cookie': cookieOptions.join('; ')
            });
            
            res.end(JSON.stringify({ 
                success: true, 
                message: 'Conectare reusita!',
                user: userSession
            }));
            
        } catch (error) {
            console.error('Eroare sign in:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                success: false, 
                message: 'Date invalide!' 
            }));
        }
    });
}

module.exports = handleSignIn;