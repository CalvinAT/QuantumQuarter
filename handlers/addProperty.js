const dbConnect = require('.././dbConnection')

async function addProperty(req, res) {
    try {
        const db = await dbConnect();
        const result = await db.collection('property').insertOne(req.body);
        res.status(201).json({ status: 201, message: 'Property baru berhasil ditambahkan' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = addProperty;