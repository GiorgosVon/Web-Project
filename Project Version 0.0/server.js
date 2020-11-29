const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'test';
let db;
const port = 3000;

app.use(express.static("views"));

app.listen(port, function () {
    console.log('listening on port 3000')
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.post('/quotes', (req, res) => {
    console.log(req.body)
});

MongoClient.connect(url, {useNewUrlParser: true}, (err, client) =>{
    if (err) return console.log(err);

    db = client.db(dbName);
    console.log(`Connected MongoDB: ${url}`);
    console.log(`Database: ${dbName}`);
})
