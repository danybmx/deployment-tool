var express = require('express');
var deployables = require('./deployables.json');
var app = express();

app.post('/', (req, res, next) => {
  if (req.headers['x-github-event']) {
    switch (req.headers['x-github-event']) {
      case 'ping':
        res.send("ping");
        break;
      default:
        const error = 'unrecognized event: ' + req.headers['x-github-event'];
        console.error(error);
        res.status(404).send(error);
        break;
    }
  } else {
    res.status(400).send('Bad request');
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
