const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;  
const url = process.env.MONGO_URL;

async function getCategories(req, res) {
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    const categories = await db.collection('Categories').find().toArray();
    console.log(`Retrieved ${categories.length} categories from the database.`);
    res.send(categories);
    client.close();
}

async function createCategory(req, res) {
    const category = req.body;
    console.log(`Creating category: ${JSON.stringify(category)}`);
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    const result = await db.collection('Categories').insertOne(category);
    console.log(`Created category with id ${result.insertedId}.`);
    res.status(200).send(result);
    client.close();
}

async function updateCategory(req, res) {
    const id = new ObjectId(req.params.id);
    const category = req.body;
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    const result = await db.collection('Categories').updateOne({ _id: id }, { $set: category });
    console.log(`Updated category with id ${id}.`);
    if (result.modifiedCount == 0) {
        res.status(404).send(result);
    } else {
        res.send(result);
    }
    client.close();
}

async function deleteCategory(req, res) {
    const id = new ObjectId(req.params.id);
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    console.log(`Deleting category with id ${id}.`);
    const result = await db.collection('Categories').deleteOne({ _id: id });
    console.log(`Deleted category with id ${id}.`);
    if (result.modifiedCount == 0) {
        res.status(404).send(result);
    } else {
        res.send(result);
    }
    client.close();
}

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};

