const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;  
const url = process.env.MONGO_URL;

module.exports = {
    getExtras: getExtras,
    createExtra: createExtra,
    updateExtra: updateExtra,
    deleteExtra: deleteExtra
}

async function getExtras (req, res) {
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    var extras = await db.collection('Extras').find().toArray();
    console.log(`Retrieved ${extras.length} extras from the database.`);
    res.send(extras);
    client.close();
}

async function createExtra (req, res) {
    const extra = req.body;
    console.log(`Creating new extra: ${JSON.stringify(extra)}`);
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    var result = await db.collection('Extras').insertOne(extra);
    console.log(`New extra created with id ${result.insertedId}.`);
    res.status(200).send(result);
    client.close();
}

async function updateExtra (req, res) {
    const id = new ObjectId(req.params.id);
    const extra = req.body;
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    var result = await db.collection('Extras').updateOne({ _id: id }, { $set: extra});
    console.log(`Updated extra with id ${id} with new data: ${JSON.stringify(extra)}.`);
    if(result.modifiedCount == 0){
        console.log(`Extra with id ${id} not found.`);
        res.status(404).send(result);
    }else{
        console.log(`Extra with id ${id} updated successfully.`);
        res.send(result);
    }
    
    client.close();
}

async function deleteExtra (req, res) {
    const id = new ObjectId(req.params.id);
    const client = new MongoClient(url);
    const db = client.db('backpoint');
    console.log(`Deleting extra with id ${id}.`);
    var result = await db.collection('Extras').deleteOne({ _id: id });
    console.log(`Deleted extra with id ${id}.`);
    if(result.modifiedCount == 0){
        console.log(`Extra with id ${id} not found.`);
        res.status(404).send(result);
    }else{
        console.log(`Extra with id ${id} deleted successfully.`);
        res.send(result);
    }
    
    client.close();
}



