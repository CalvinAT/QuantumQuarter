const { connectToMongoDB }  = require('../dbConnection');
const { getTokenData, checkUserType } = require('./authenticationHandler');
const propertyBuilder = require('../../Model/property');
const path = require('path');

const {Storage} = require('@google-cloud/storage');

const shortid = require('shortid');
const length = 8;

async function addPropertyHandler(req, res) {
    const authHeader = req.headers['authorization'];
    if(!checkUserType(authHeader, 1)){
        res.status(401).json({ status: 401, message: 'Error: Invalid credentials' });
        return;
    }

    const projectId = 'quantumquarters';
    const keyFilename = path.resolve(__dirname, 'quantumquarters-storage.json');

    const storage = new Storage({
        projectId,
        keyFilename
    });

    const bucketName = 'quantum-quarters-property';

    const {
        title,
        desc,
        type,
        area,
        price,
        bedroomCount,
        bathroomCount,
        landArea,
        garage,
        floorLevel
    } = req.body;

    const files = req.files;
    const uploadedFiles = [];

    const propertyId = shortid.generate().substring(0, length);

    const { id } = getTokenData(authHeader);
    const agent = id;

    // check required fields
    if (agent === undefined || title === undefined || desc === undefined || type === undefined || area === undefined || price === undefined) {
        res.status(400).json({ status: 400, message: 'Required fields are missing' });
        return;
    }

    const currentDate = new Date();
    const date = ("0" + currentDate.getDate()).slice(-2);
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const year = currentDate.getFullYear();
    const listingDate = `${date}-${month}-${year}`

    const approvedDate = "";
    const stat = 0;
    const builder = new propertyBuilder(propertyId, agent, title, type, desc, area, price, listingDate, approvedDate, stat);

    // check undefined entries
    if (bedroomCount !== undefined) builder.addBedroom(bedroomCount);
    if (bathroomCount !== undefined) builder.addBathroom(bathroomCount);
    if (landArea !== undefined) builder.addLandArea(landArea);
    if (garage !== undefined) builder.addGarage(garage);
    if (floorLevel !== undefined) builder.addFloorLevel(floorLevel);

    const propertyData = builder.build()

    try {
        const db = await connectToMongoDB.Get();
        const uniqueFolderName = `${type}/${propertyId}/`;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = file.path;
            const fileName = file.originalname;
      
            console.log(filePath)
            if(filePath){
                await storage.bucket(bucketName).upload(filePath, {
                    destination: `${uniqueFolderName}${fileName}`,
                    metadata: {
                        contentType: file.mimetype,
                        defaultObjectAcl: 'publicRead',
                    },
                })
            } else {
                console.log('File path error')
            }
            uploadedFiles.push(
                `https://storage.googleapis.com/${bucketName}/${uniqueFolderName}${fileName}`,
            );
        }
     
        const result = await db.collection('property').insertOne(propertyData);
        console.log(propertyData);
        res.status(201).json({ 
            status: 201, 
            message: 'Successfully add property listing request', 
            uploadedFiles
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function getPropertyHandler(req, res) {
    const { type } = req.body;
    let query = {};
    try {
        const db = await connectToMongoDB.Get();
        if (type) {
            query = { type : type };
        }
        const data = await db.collection('property').find(query).toArray();
        res.status(200).json({ status: 200, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function setStatusPropertyHandler(req, res) {
    const authHeader = req.headers['authorization'];
    if(!checkUserType(authHeader, 1)){
        res.status(401).json({ status: 401, message: 'Error: Invalid credentials' });
        return;
    }
    const { id } = req.body;
    const method = req.method;
    let updateDoc;
    const currentDate = new Date(); 
    const date = ("0" + currentDate.getDate()).slice(-2);
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const year = currentDate.getFullYear();
    try {
        const db = await connectToMongoDB.Get();
        const filter = { id: id };
        if (method === 'PUT') {
            updateDoc = {
                $set: {
                  approved_date: year + "-" + month + "-" + date,
                  status: 1
                },
            };
            const result = await db.collection('property').updateOne(filter, updateDoc);
            res.status(200).json({ status: 200, message: 'Property berhasil diapprove' });
        } else {
            updateDoc = {
                $set: {
                  status: 2
                },
            };
            const result = await db.collection('property').updateOne(filter, updateDoc);
            res.status(200).json({ status: 200, message: 'Property sold' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { addPropertyHandler, getPropertyHandler, setStatusPropertyHandler };