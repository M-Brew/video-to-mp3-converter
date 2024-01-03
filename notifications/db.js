const { MongoClient } = require("mongodb");

let dbConnection;

const connectToDB = async (url, callback) => {
  try {
    const client = await MongoClient.connect(url);
    dbConnection = client.db();
    return callback();
  } catch (error) {
    console.log(error);
    return callback(error);
  }
};

const getDB = () => dbConnection;

module.exports = { connectToDB, getDB };
