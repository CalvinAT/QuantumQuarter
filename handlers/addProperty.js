const {connectToMongoDB} = require('.././dbConnection');
const shortid = require('shortid');
const length = 8;

async function addProperty(req, res) {
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