const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/backpoint';

const MongoConnection = new MongoClient(url).connect();

function isMongoConnectionTimedOut() {
    return MongoConnection.then((client) => {
        return !client.isConnected();
    });
}

