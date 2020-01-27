const Router = require('express').Router;
const db = require('../db');

const router = Router();

router.get('/all', (req, res, next) => {
  const accounts = [];
  db.getDb()
    .db()
    .collection('accounts')
    .find()
    //.sort({creation_date: -1})
    .forEach(account => {
      accounts.push(account);
    })
    .then(result => {
      res.status(200).json(accounts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'An error occurred.' });
    });
});

router.post('/create', (req, res, next) => {
  const new_account = {
    creation_date: Date.now(),
    blogs: [],
    creator: {
      name: req.body.creator_name,
      name: req.body.creator_email
    }, 
    users: []
  };
  db.getDb()
    .db()
    .collection('accounts')
    .insertOne(new_account)
    .then(result => {
      console.log(result.insertedId);
      res
        .status(201)
        .json({ message: 'Account created', accountId: result.insertedId});
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: 'An error occurred.' });
    });
});

module.exports = router;
