const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');
const mongoDbUrl = require('../../mongoDbUrl');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  });
  bookRouter.route('/')
    .get((req, res) => {
      const url = mongoDbUrl;
      const dbName = 'libraryApp';
      debug('Before invoke IIFE function.');
      (async function mongo() {
        let client;
        try {
          debug('Before Connected correctly to server');
          client = await MongoClient.connect(url);
          debug('After connected correctly to server');

          const db = client.db(dbName);

          debug('Before open collection books');
          const col = await db.collection('books');
          debug('After open collection  books');

          debug('Before get all books');
          const books = await col.find().toArray();
          debug('After get all books');

          res.render(
            'bookListView',
            {
              nav,
              title: 'Library',
              books
            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
      debug('After invoke IIFE function.');
    });

  bookRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      const url = mongoDbUrl;
      const dbName = 'libraryApp';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = await db.collection('books');

          const book = await col.findOne({ _id: new ObjectID(id) });
          debug(book);
          res.render(
            'bookView',
            {
              nav,
              title: 'Library',
              book
            }
          );
        } catch (err) {
          debug(err.stack);
        }
      }());
    });
  return bookRouter;
}

module.exports = router;
