const { connectToMySQL } = require('../dbConnection');

async function addLog(req, id, status, type){
    try {
        const pool = await connectToMySQL();
        const ipAddress = req.ip;
        await pool.query('INSERT INTO log (id_employee, ip_address, datetime, status, type) VALUES (?, ?, NOW(), ?, ?);', [id, ipAddress, status, type]);
    } catch (error) {
        console.error('Error during login:', error);
    }
}

module.exports = addLog;