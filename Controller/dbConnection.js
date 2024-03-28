const { MongoClient } = require("mongodb");
const config = require('./config');
const mysql = require('mysql2/promise');
const sqlConfig = require('./sqlConfig');

let connectMDB = function () {

    let db = null;
    let instance = 0;

    async function DbConnect() {
        try {
        const client = new MongoClient(config.mongodb_url);
        await client.connect();
        return _db = client.db('quantum-quarters')
        } catch (error) {
            return error;
        }
    }

   async function Get() {
        try {
            instance++;     // this is just to count how many times our singleton is called.
            console.log(`DbConnection called ${instance} times`);

            if (db != null) {
                console.log(`db connection is already alive`);
                return db;
            } else {
                console.log(`getting new db connection`);
                db = await DbConnect();
                return db; 
            }
        } catch (error) {
            return error;
        }
    }

    return {
        Get: Get
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

module.exports = {
    connectToMongoDB : connectMDB(),
    connectToMySQL
}