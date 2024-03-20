const dbConnect = require('../dbConnection')

async function approvePropertyHandler(req, res) {
    const { id } = req.body;
    const currentDate = new Date(); 
    const date = ("0" + currentDate.getDate()).slice(-2);
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const year = currentDate.getFullYear();
    try {
        const db = await dbConnect();
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

module.exports = approvePropertyHandler;