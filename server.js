var express = require('express');
var bodyParser = require('body-parser');
var deployables = require('./deployables.json');
var exec = require('child_process').exec;
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', (req, res, next) => {
  if (req.headers['x-github-event']) {
    switch (req.headers['x-github-event']) {
      case 'ping':
        res.send("ping");
        break;
      case 'push':
        if (deployables[req.body.repository.name]) {
          const deployable = deployables[req.body.repository.name];
          if (req.body.ref === 'refs/heads/' + deployable.branch) {
            // Reply github
            res.json({
              success: true,
              deployable: deployable,
            });

            // Run script
            exec(deployable.script, {
              cwd: deployable.path,
            }, (err) => {
              if (err) console.error(err);
            });
          } else {
            return res.status(200).send('Nothing to do here');
          }
        } else {
          const error = 'unrecognized repository ' + req.body.repository.name;
          console.error(error);
          return res.status(404).send(error);
        }
        break;
      default:
        const error = 'unrecognized event: ' + req.headers['x-github-event'];
        console.error(error);
        return res.status(404).send(error);
        break;
    }
  } else {
    return res.status(400).send('Bad request');
  }
});

app.listen(8888, () => {
  console.log('Server listening on port 8888');
});
