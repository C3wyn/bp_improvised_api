const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;	
const url = process.env.MONGO_URL;


module.exports = {
    getProducts: getProducts,
    createProduct: createProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct
}

async function getProducts(req, res) {
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    var products = await db.collection('Products').find().toArray();
    console.log(`Retrieved ${products.length} products from the database.`);
    res.send(products);
    client.close();
}

async function createProduct(req, res) {
    const product = req.body;
    console.log(`Creating new product: ${JSON.stringify(product)}`);
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    var result = await db.collection('Products').insertOne(product);
    console.log(`New product created with id ${result.insertedId}.`);
    res.status(200).send(result);
    client.close();
}

async function updateProduct(req, res) {
    const id = new ObjectId(req.params.id);
    const product = req.body;
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    var result = await db.collection('Products').updateOne({ _id: id }, { $set: product });
    console.log(result);
    var testresult = await db.collection('Products').findOne({ _id: id });  
    console.log(testresult);
    
    console.log(`Updated product with id ${id} with new data: ${JSON.stringify(product)}.`);
    if (result.modifiedCount == 0) {
        console.log(`Product with id ${id} not found.`);
        result.msg = `Product with id ${id} not found.`;
        res.status(404).send(result);
    } else {
        console.log(`Product with id ${id} updated successfully.`);
        res.send(result);
    }

    client.close();
}

async function deleteProduct(req, res) {
    const id = new ObjectId(req.params.id);
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    console.log(`Deleting product with id ${id}.`);
    var result = await db.collection('Products').deleteOne({ _id: id });
    console.log(`Deleted product with id ${id}.`);
    if (result.modifiedCount == 0) {
        console.log(`Product with id ${id} not found.`);
        res.status(404).send(result);
    } else {
        console.log(`Product with id ${id} deleted successfully.`);
        res.send(result);
    }
    client.close();
}