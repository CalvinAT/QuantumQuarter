const { connectToMySQL } = require('../dbConnection');
const { checkUserType } = require('./authenticationHandler');
const bcrypt = require('bcrypt');
const path = require('path');

const {Storage} = require('@google-cloud/storage');

async function addEmployee(req, res) {
    const authHeader = req.headers['authorization'];
    if(!checkUserType(authHeader, 0)){
        res.status(401).json({ status: 401, message: 'Error: Invalid credentials' });
        return;
    }

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
    } = req.body;

    const profile = req.file;

    const projectId = 'quantumquarters';
    const keyFilename = path.resolve(__dirname, 'quantumquarters-storage.json');

    const storage = new Storage({
        projectId,
        keyFilename
    });

    const bucketName = 'quantum-quarters-employee';
    const uniqueFolderName = `${id}/`;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const pool = await connectToMySQL();

        const filePath = profile.path;
        const fileName = profile.originalname;

        if(filePath){
            await storage.bucket(bucketName).upload(filePath, {
                destination: `${uniqueFolderName}${fileName}`,
                metadata: {
                    contentType: profile.mimetype,
                    defaultObjectAcl: 'publicRead',
                },
            })
        } else {
            console.log('File path error')
        }
        const profilePath = `https://storage.googleapis.com/${bucketName}/${uniqueFolderName}${fileName}`
        // Insert employee
        await pool.query('INSERT INTO employee (id, name, address, gender, email, password, type, currently_login) VALUES (?, ?, ?, ?, ?, ?, ?, 0);', [id, name, address, gender, email, hashedPassword, type]);

        // Insert agent if type is 1
        if (type === '1') {
            await pool.query('INSERT INTO agent (id, branch_id, phone_number, whatsapp, profile_path) VALUES (?, ?, ?, ?, ?);', [id, branch_id, phone_number, whatsapp, profilePath]);
        }

        // Send success response
        res.status(201).json({ status: 201, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
}

module.exports = addEmployee;