'use strict';
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const { MongoClient } = require("mongodb");
 
const url = "mongodb+srv://Heroku:UlR9kZ7N9G4jWHio@cluster0.ejxsb.mongodb.net/database?retryWrites=true&w=majority";
const client = new MongoClient(url);
async function start(){
    await client.connect();
}
start();
app.use(express.json({type: ['application/json', 'text/plain']})); 
app.use(express.static('client'));
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
      res.send('Success');
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

app.post('/gameScore', bodyParser.json(), async (req, res) => {
        const gameScore = {
            name: req.body.name,
            score: req.body.score
        };
        try {
            console.log("Connected correctly to server");
            const db = client.db(dbName);

            const col = db.collection("gameScores");
             
            const p = await col.insertOne(gameScore);
            } catch (err) {
            console.log(err.stack);
        }
        res.send('Posted');
});

app.post('/wordScore', bodyParser.json(), async (req, res) => {
        const wordScore = {
            name: req.body.name,
            word: req.body.word,
            score: req.body.score
        };
       
        try {
            console.log("Connected correctly to server");
            const db = client.db(dbName);
            const col = db.collection("wordScores");
             
            const p = await col.insertOne(wordScore);
            } catch (err) {
            console.log(err.stack);
        }
        res.send('Posted');
});

app.get('/highestGameScores', (req, res) => {
    const db = client.db(dbName);
    db.collection("gameScores").find({}).sort({score: -1}).limit(10).toArray(function(err, result) {
            if (err) throw err;
            res.send(JSON.stringify(result));
    });
    console.log('Connected to server');
});

app.get('/highestWordScores', (req, res) => {
    const db = client.db(dbName);
    db.collection("wordScores").find({}).sort({score: -1}).limit(10).toArray(function(err, result) {
            if (err) throw err;
            res.send(JSON.stringify(result));
    });
    console.log('Connected to server');
});
 const dbName = "database";
