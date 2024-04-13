const { connectToMySQL } = require('../dbConnection');
const { checkUserType, getTokenData } = require('./authenticationHandler');
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
        branchId,
        phoneNumber,
        whatsapp,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const pool = await connectToMySQL();

        // Insert employee
        await pool.query('INSERT INTO employee (id, name, address, gender, email, password, type, currently_login) VALUES (?, ?, ?, ?, ?, ?, ?, 0);', [id, name, address, gender, email, hashedPassword, type]);

        // Insert agent if type is 1
        if (type === '1') {
            const profile = req.file;

            const projectId = 'quantumquarters';
            const keyFilename = path.resolve(__dirname, 'quantumquarters-storage.json');

            const storage = new Storage({
                projectId,
                keyFilename
            });

            const bucketName = 'quantum-quarters-employee';
            const uniqueFolderName = `${id}/`;
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
            await pool.query('INSERT INTO agent (id, branch_id, phone_number, whatsapp, profile_path) VALUES (?, ?, ?, ?, ?);', [id, branchId, phoneNumber, whatsapp, profilePath]);
        }

        // Send success response
        res.status(201).json({ status: 201, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
}

async function updateAgentProfile(req, res){
    const {
        phoneNumber,
        whatsapp,
    } = req.body;

    try {
        const authHeader = req.headers['authorization'];
        if(authHeader === undefined || !checkUserType(authHeader, 1)){
            throw new Error("Invalid Credentials.");
        }

        const { id } = getTokenData(authHeader);
        let query = 'UPDATE agent SET ';

        // check phone number input
        if(phoneNumber !== undefined){
            query += `phone_number = '${phoneNumber}'`;
        }

        // check whatsapp input
        if(whatsapp !== undefined){
            if(phoneNumber !== undefined){
                query+= ', ';
            }
            query += `whatsapp = '${whatsapp}'`;
        }

        query += ` WHERE id = '${id}'`;
        const pool = await connectToMySQL();
        await pool.query(query);

        res.status(201).json({ status: 201, message: 'Agent data successfully updated' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {addEmployee, updateAgentProfile};