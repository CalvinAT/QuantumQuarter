const {connectToMongoDB} = require('.././dbConnection');
const { checkUserType } = require('./authenticationHandler');
const shortid = require('shortid');
const length = 8;

async function addProperty(req, res) {
    const authHeader = req.headers['authorization'];
    if(!checkUserType(authHeader, 1)){
        console.log("anjai agent");
        res.status(401).json({ status: 401, message: 'Error: Invalid credentials' });
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

module.exports = addProperty;