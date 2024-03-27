const { connectToMongoDB } = require('../dbConnection');
const { checkUserType } = require('./authenticationHandler');
const shortid = require('shortid');
const length = 8;

async function addPropertyHandler(req, res) {
    const authHeader = req.headers['authorization'];
    if(!checkUserType(authHeader, 1)){
        res.status(401).json({ status: 401, message: 'Error: Invalid credentials' });
        return;
    }

    const {
        agent,
        title,
        desc,
        type,
        area,
        price,
        bedroom_count,
        bathroom_count,
        land_area,
        garage,
        floor_level,
        listing_date,
        approved_date,
        status
    } = req.body;
    try {
        const db = await connectToMongoDB();
        const result = await db.collection('property').insertOne({
            id : shortid.generate().substring(0, length),
            agent,
            title,
            desc,
            type,
            area,
            price,
            bedroom_count,
            bathroom_count,
            land_area,
            garage,
            floor_level,
            listing_date,
            approved_date,
            status
        });
        res.status(201).json({ status: 201, message: 'Property baru berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getPropertyHandler(req, res) {
    const authHeader = req.headers['authorization'];
    if(!checkUserType(authHeader, 1)){
        res.status(401).json({ status: 401, message: 'Error: Invalid credentials' });
        return;
    }
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
        const db = await connectToMongoDB();
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