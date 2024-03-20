const dbConnect = require('../dbConnection')

async function getPropertyHandler(req, res) {
    const { type } = req.body;
    let query = {};
    try {
        const db = await dbConnect();
        if (type) {
            query = { type : type };
        }
        const data = await db.collection('property').find(query).toArray();
        res.status(200).json({ status: 200, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = getPropertyHandler;