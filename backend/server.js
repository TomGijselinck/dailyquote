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
  db.collection('current_quote').find({}).toArray(function(err, result) {
    if (err) {
      console.log(err);
    } else {
      var d = new Date();
      if (result[0].weekday === d.getDay()) {
        res.send(result[0].quote);
      } else {
        getNewQuote(function(response) {
          res.send(response);
          console.log(response);
        }, result[0].quote);
      }
    }
  });
})

function getNewQuote(callback, currentQuote) {
  db.collection('quotes')
    .find({useCount: {$eq: currentQuote.useCount}})
    .toArray(function(err, result) {
    if (err) {
      callback("db error");
      console.log(err);
    } else if (result.length) {
      var newQuote = shuffle.pick(result);
      var d = new Date();
      db.collection('current_quote').update({}, {$set: {quote: newQuote}});
      db.collection('current_quote').update({}, {$set: {weekday: d.getDay()}});
      db.collection('quotes').update(
        {_id: newQuote._id},
        {$set: {useCount: newQuote.useCount + 1}}
      );
      callback(newQuote);
      console.log('Select new random quote');
    } else {
      currentQuote.useCount = currentQuote.useCount + 1;
      getNewQuote(callback, currentQuote);
      console.log('No documents found');
    }
  });
}
