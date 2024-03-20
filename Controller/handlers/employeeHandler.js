const { connectToMySQL } = require('../dbConnection');
const bcrypt = require('bcrypt');

async function addEmployee(req, res) {
    const {
        id,
        name,
        address,
        gender,
        email,
        password,
        type,
        branch_id,
        phone_number,
        whatsapp,
        profile_path
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const pool = await connectToMySQL();

        // Insert employee
        await pool.query('INSERT INTO employee (id, name, address, gender, email, password, type, currently_login) VALUES (?, ?, ?, ?, ?, ?, ?, 0);', [id, name, address, gender, email, hashedPassword, type]);

        // Insert agent if type is 1
        if (type === '1') {
            await pool.query('INSERT INTO agent (id, branch_id, phone_number, whatsapp, profile_path) VALUES (?, ?, ?, ?, ?);', [id, branch_id, phone_number, whatsapp, profile_path]);
        }

        // Send success response
        res.status(201).json({ status: 201, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
}

module.exports = addEmployee;