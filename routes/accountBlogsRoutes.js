const Router = require('express').Router;
const db = require('../db');

const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

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
    creation_date: new Date(Date.now()).toISOString(),
    blogs: [],
    creator: {
      name: req.body.creator_name,
      email: req.body.creator_email
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
        .status(500).json({ message: 'An error occurred.' });
    });
});

router.post('/:id/create-user', (req, res, next) => {
  console.log(req.body)
  const new_user = {
    name: req.body.name,
    email: req.body.mail
  };
  db.getDb()
    .db()
    .collection('users')
    .insertOne(new_user)
    .then(result => {
      console.log('new user id: ' + result.insertedId);
      db.getDb()
        .db()
        .collection('accounts')
        .updateOne(
          { _id: new ObjectId(req.params.id) },
          { $push: { users: result.insertedId } }
        )
        .then(result => {
          console.log('new user added');
          res
            .status(201)
            .json({ message: 'User created', accountId: result.insertedId});
        })
        .catch(err => {
          console.log(err);
          res
            .status(500).json({ message: 'An error occurred.' });
        });
    })
    .catch(err => {
      console.log(err);
      res
        .status(500).json({ message: 'An error occurred.' });
    });
});

module.exports = router;
