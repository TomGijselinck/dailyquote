const express = require('express');
const app = express();
const shuffle = require('shuffle-array');

const host = '127.0.0.1';
const port = 3000;

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/dailyquote';

MongoClient.connect(url, (err, database) => {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
    res.send("db error")
  } else {
    console.log('Connection established to', url);
    db = database;

    app.listen(port);
    console.log("Listening on port 3000");
  }
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

/**
 * Return a random quote.
 */
app.get('/quote', (req, res) => {
  db.collection('quotes').find({}).toArray(function(err, result) {
    if (err) {
      console.log(err);
      res.send("db error")
    } else if (result.length) {
      console.log('Select random quote');
      res.send(shuffle.pick(result));
    } else {
      console.log('No documents found')
      res.send("Empty set");
    }
  });
})
