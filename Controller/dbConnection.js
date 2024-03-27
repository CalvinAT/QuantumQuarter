const { MongoClient } = require("mongodb");
const config = require('./config');
const mysql = require('mysql2/promise');
const sqlConfig = require('./sqlConfig');

async function connectToMongoDB() {
    try {
        const client = new MongoClient(config.mongodb_url);
        await client.connect();
        return db = client.db('quantum-quarters')
    } catch (error) {
        console.log('Error connecting to MongoDB: ', error)
    }
}

async function connectToMySQL() {
    try {
        pool = mysql.createPool(sqlConfig);
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
        throw error;
    }
    return pool;
}

module.exports = {connectToMongoDB, connectToMySQL};