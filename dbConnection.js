const { MongoClient } = require("mongodb");
const config = require('./config')

async function connectToMongoDB() {
    try {
        const client = new MongoClient(config.mongodb_url);
        await client.connect();
        return db = client.db('quantum-quarters')
    } catch (error) {
        console.log('Gagal terhubung ke MongoDB: ', error)
    }
}

module.exports = connectToMongoDB;