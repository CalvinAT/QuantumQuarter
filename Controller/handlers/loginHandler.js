const { connectToMySQL } = require('../dbConnection');
const { generateToken, getTokenData } = require('./authenticationHandler');
const bcrypt = require('bcrypt');

async function login(req, res) {
    const { email, password } = req.body;

    try {
        const pool = await connectToMySQL();

        const [results] = await pool.query('SELECT * FROM employee WHERE email = ?', [email]);

        if (results.length > 0) {
        const employee = results[0];

        const passwordMatch = await bcrypt.compare(password, employee.password);

            if (passwordMatch) {
                // creating token
                const token = generateToken(employee.id, employee.type);

                // Set token to header
                res.header('Authorization', `Bearer ${token}`);

                result = {
                    token: token,
                    id: employee.id,
                    name: employee.name,
                    email : employee.email,
                    type : employee.type,
                };

                await pool.query('UPDATE employee SET currently_login = 1 WHERE email = ?', [email]);
                addLog(req, employee.id, 1, 1);
                // success response
                res.json({ status: 200, message: 'Login successful', result });
            } else {
                // password did not match
                addLog(req, employee.id, 0, 1);
                res.status(401).json({ status: 401, message: 'Error: Invalid credentials' });
            }
        } else {
            // no email found
            addLog(req, employee.id, 0, 1);
            res.status(401).json({ status: 401, message: 'Error: Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ status: 500, message: 'Error: Internal Server Error' });
    }
    }

async function logout(req, res) {
    const pool = await connectToMySQL();
    const authHeader = req.headers['authorization'];
    if (authHeader !== undefined){ 
        const { id } = getTokenData(authHeader);
        await pool.query('UPDATE employee SET currently_login = 0 WHERE id = ?', [id]);
        addLog(req, id, 1, 0);
        res.removeHeader('Authorization');
        res.json({ message: 'Logout berhasil' });
        return;
    }
    res.json({ message: 'Can not log out, no user logged on!' });
}

async function addLog(req, id, status, type){
    try {
        const ipAddress = req.ip;
        await pool.query('INSERT INTO log (id_employee, ip_address, datetime, status, type) VALUES (?, ?, NOW(), ?, ?);', [id, ipAddress, status, type]);
    } catch (error) {
        console.error('Error during login:', error);
    }
}

module.exports = { login, logout };