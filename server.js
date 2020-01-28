const express = require('express');
const app = express();
const db = require('./db');
const accountBlogsRoutes = require('./routes/accountBlogsRoutes');
var bodyParser = require('body-parser')
const port = 5000;

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World! This is the future pretty UI :)'));
app.use('/accounts', accountBlogsRoutes);

db.initDb((err, db) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  }
});