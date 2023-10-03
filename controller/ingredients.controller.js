const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;  
const url = process.env.MONGO_URL;

async function getIngredients (req, res) {
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    var ingredients = await db.collection('Ingredients').find().toArray();
    console.log(`Retrieved ${ingredients.length} ingredients from the database.`);
    res.send(ingredients);
    client.close();
}

async function createIngredient (req, res) {
    const ingredient = req.body;
    console.log(`Creating ingredient: ${JSON.stringify(ingredient)}`);
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    var ingredients = await db.collection('Ingredients').insertOne(ingredient);
    console.log(`Created ingredient with id ${ingredients.insertedId}.`);
    res.status(200).send(ingredients);
    client.close();
}

async function updateIngredient (req, res) {
    const id = new ObjectId(req.params.id);
    const ingredient = req.body;
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    var ingredients = await db.collection('Ingredients').updateOne({ _id: id }, { $set: ingredient});
    console.log(`Updated ingredient with id ${id}.`);
    if(ingredients.modifiedCount == 0){
        res.status(404).send(ingredients);
    }else{
        res.send(ingredients);
    }
    
    client.close();
}

async function deleteIngredient (req, res) {
    const id = new ObjectId(req.params.id);
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    console.log(`Deleting ingredient with id ${id}.`);
    var ingredients = await db.collection('Ingredients').deleteOne({ _id: id });
    console.log(`Deleted ingredient with id ${id}.`);
    if(ingredients.modifiedCount == 0){
        res.status(404).send(ingredients);
    }else{
        res.send(ingredients);
    }
    
    client.close();
}

module.exports = {
    getIngredients,
    createIngredient,
    updateIngredient,
    deleteIngredient
};

