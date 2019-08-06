// Is this one of the few you times you really
// require an agent?
const Agent = require('./src/Agent.js');

const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.use('/output', express.static(path.join(__dirname, 'output')))
app.use('/static', express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => {
  const artists = fs.readdirSync(`${__dirname}/Artists`).filter(f => f.indexOf('.js') >= 0).map(f => f.replace(/\.js/, ''));
  res.render('list', {
    artists
  });
});

app.get('/viewer/:artist', (req, res) => {
  Agent.overShoulder(req.params.artist)
    .then(url => {
      res.render('main');
    });
});

app.listen(port, () => {
  console.log(`View the output at ${port}!`)
});
