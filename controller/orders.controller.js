const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;	
const { socket } = require('../index');
const url = process.env.MONGO_URL;

var orderCounter = 0;

module.exports = {
    createOrder: createOrder,
    getOpenOrders: getOpenOrders,
    updateOrder: updateOrder,
    getOrderHistory: getOrderHistory
}

async function createOrder(req, res, next) {
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    
    try {
        req.body.orderNumber = orderCounter;
        orderCounter>99?orderCounter=1:orderCounter++;

        req.body.createdAt = Date.now();

        var result = await db.collection('Orders').insertOne(req.body);

        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating order');
    } finally {
        client.close();
        next();
    }
}

async function getOpenOrders(req, res) {
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    
    try {
        var result = await db.collection('Orders').find({status: "Created"}).toArray();
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error getting created orders');
    } finally {
        client.close();
    }
}

async function updateOrder(req, res, next) {
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    console.log(req.body);
    try {
        const orderId = new ObjectId(req.params.id);
        const result = await db.collection('Orders').updateOne({_id: orderId}, {$set: req.body});
        console.log(result);
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating order');
    } finally {
        client.close();
        next();
    }
}
async function getOrderHistory(req, res) {
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    const pageSize = 10; // number of orders per page
    const page = parseInt(req.query.page) || 1; // default to page 1 if no page parameter is provided
    
    try {
        const skip = (page - 1) * pageSize;
        const result = await db.collection('Orders').find({status: "Done"}).skip(skip).limit(pageSize).toArray();
        res.status(200).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error getting created orders');
    } finally {
        client.close();
    }
}


