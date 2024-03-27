const { connectToMongoDB } = require('../dbConnection');
const { getTokenData, checkUserType } = require('./authenticationHandler');
const propertyBuilder = require('../../Model/property');

const shortid = require('shortid');
const length = 8;

async function addPropertyHandler(req, res) {
    const authHeader = req.headers['authorization'];
    if(!checkUserType(authHeader, 1)){
        res.status(401).json({ status: 401, message: 'Error: Invalid credentials' });
        return;
    }
    
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


    propertyId = shortid.generate().substring(0, length);

    const { id } = getTokenData(authHeader);
    agent = id;

    // check required fields
    if (agent === undefined || title === undefined || desc === undefined || type === undefined || area === undefined || price === undefined) {
        res.status(400).json({ status: 400, message: 'Required fields are missing' });
        return;
    }

    listing_date = new Date();
    approved_date = "";
    stat = 0;

    builder = new propertyBuilder(propertyId, agent, title, desc, type, area, price, listing_date, approved_date, stat);

    // check undefined entries
    if (bedroomCount !== undefined) builder.addBedroom(bedroomCount);
    if (bathroomCount !== undefined) builder.addBathroom(bathroomCount);
    if (landArea !== undefined) builder.addLandArea(landArea);
    if (garage !== undefined) builder.addGarage(garage);
    if (floorLevel !== undefined) builder.addFloorLevel(floorLevel);

    propertyData = builder.build()

    try {
        const db = await connectToMongoDB();
        const result = await db.collection('property').insertOne(propertyData);
        console.log(propertyData);
        res.status(201).json({ status: 201, message: 'Successfully add property listing request' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function getPropertyHandler(req, res) {
    const { type } = req.body;
    let query = {};
    try {
        const db = await connectToMongoDB();
        if (type) {
            query = { type : type };
        }
        const data = await db.collection('property').find(query).toArray();
        res.status(200).json({ status: 200, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function approvePropertyHandler(req, res) {
    const authHeader = req.headers['authorization'];
    if(!checkUserType(authHeader, 0)){
        res.status(401).json({ status: 401, message: 'Error: Invalid credentials' });
        return;
    }
    const { id } = req.body;
    const currentDate = new Date(); 
    const date = ("0" + currentDate.getDate()).slice(-2);
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const year = currentDate.getFullYear();
    try {
        const db = await connectToMongoDB();
        const filter = { id: id };
        const updateDoc = {
            $set: {
              approved_date: year + "-" + month + "-" + date,
              status: 1
            },
        };
        const result = await db.collection('property').updateOne(filter, updateDoc);
        res.status(200).json({ status: 200, message: 'Property berhasil diapprove' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { addPropertyHandler, getPropertyHandler, approvePropertyHandler };