module.exports = {
    port: process.env.PORT || 3000,
    mongodb_url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/quantum-quarters',
    dbName: process.env.dbName
  };