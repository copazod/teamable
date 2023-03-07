const express = require ('express');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const {isInvalidEmail,isEmptyPayload} = require('./validator')

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'Company_db';
const collName = 'employees'

app.use(bodyParser.json())
app.use('/', express.static(__dirname +'/dist'))

app.get('/get-profile', async function(req, res) {
   
    // connect to DB
    await client.connect();
    console.log('Connected successfully to server');

    // create or iniciate the DB & collection
    const db = client.db(dbName);
    const collection = db.collection(collName);
    
    // get date from DB 
    const result = await collection.findOne({id: 1});
    console.log(result)
    client.close()

    response = {}

    if (result !== null) {
        // we send a backend empty object. 
        // otra manera:
        // if (result=== null) res.send({}) Todo vacio para completar por primera vez
    

        // aca response no es const pq va a variar c/v q se update o llene algun dato
        response = {
        name: result.name,
        email: result.email,
        interest: result.interest
        }

        res.send(response)
    }
    
})

app.post('/update-profile', async function (req,res){
    const payload = req.body
    console.log(payload);

    if (isEmptyPayload(payload) || isInvalidEmail(payload)) {
        res.send({error: "empty payload. Couldnt update data"})
    } else {
        // connect to DB
        await client.connect();
        console.log('Connected successfully to server');

        // create or iniciate the DB & collection
        const db = client.db(dbName);
        const collection = db.collection(collName);
        
        // save payload data to the DB
        payload['id'] = 1;
        const updatedValues = {$set: payload};
        await collection.updateOne({id:1}, updatedValues, {upsert: true});
        client.close()

        res.send({info:"User data profile updated successfull"})
    }
})


const server = app.listen(3000, function() {
    console.log("app listening on port 3000")
})

module.exports = {
    app,
    server
} 