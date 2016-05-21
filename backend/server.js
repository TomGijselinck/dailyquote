const express = require('express');
const app = express();
const fs = require("fs");

const host = '127.0.0.1';
const port = 3000;



app.get('/', function (req, res) {
  res.send('Hello World!');
});


const server = app.listen(port, function () {

  console.log("Quotes app listening at http://%s:%s", host, port)

})
