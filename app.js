/* eslint-disable no-console */

const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');


const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('tiny'));
// The static files are under /public/...
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { list: ['a', 'b', 'c'], title: 'Library' });
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/views/', '/index.html'));
});

app.listen(port, () => {
  console.log(`Server start: listening on port ${chalk.green(port)}`);
  debug(`listening on port ${chalk.green(port)}`);
});
