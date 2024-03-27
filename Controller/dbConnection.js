const { MongoClient } = require("mongodb");
const config = require('./config');
const mysql = require('mysql2/promise');
const sqlConfig = require('./sqlConfig');

// Singleton class for managing database connections
class DatabaseManager {
    constructor() {
        if (!DatabaseManager.instance) {
            this.mongoClient = null;
            this.mysqlPool = null;
            DatabaseManager.instance = this;
        }
        return DatabaseManager.instance;
    }

    async connectToMongoDB() {
        try {
            if (!this.mongoClient) {
                this.mongoClient = new MongoClient(config.mongodb_url);
                await this.mongoClient.connect();
            }
            return this.mongoClient.db('quantum-quarters');
        } catch (error) {
            console.log('Error connecting to MongoDB: ', error);
            throw error;
        }
    }

    async connectToMySQL() {
        try {
            if (!this.mysqlPool) {
                this.mysqlPool = mysql.createPool(sqlConfig);
            }
            return this.mysqlPool;
        } catch (error) {
            console.error('Error connecting to MySQL:', error);
            throw error;
        }
    }
}

const databaseManager = new DatabaseManager();

module.exports = databaseManager;
