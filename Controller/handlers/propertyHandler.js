const { connectToMongoDB } = require('../dbConnection');
const { getTokenData, checkUserType } = require('./authenticationHandler');

const shortid = require('shortid');
const length = 8;

async function addProperty(req, res) {
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
        bedroom_count,
        bathroom_count,
        land_area,
        garage,
        floor_level
    } = req.body;

    const propertyData = {};

    propertyData.id = shortid.generate().substring(0, length);

    const { id } = getTokenData(authHeader);
    agent = id;

    // check required fields
    if (agent === undefined || title === undefined || desc === undefined || type === undefined || area === undefined || price === undefined) {
        res.status(400).json({ status: 400, message: 'Required fields are missing' });
        return;
    }

    propertyData.agent = agent;
    propertyData.title = title;
    propertyData.desc = desc;
    propertyData.type = type;
    propertyData.area = type;
    propertyData.price = price;

    // check undefined entries
    if (bedroom_count !== undefined) propertyData.bedroom_count = bedroom_count;
    if (bathroom_count !== undefined) propertyData.bathroom_count = bathroom_count;
    if (land_area !== undefined) propertyData.land_area = land_area;
    if (garage !== undefined) propertyData.garage = garage;
    if (floor_level !== undefined) propertyData.floor_level = floor_level;

    propertyData.listing_date = new Date();
    propertyData.approved_date = "";
    propertyData.status = 0;

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