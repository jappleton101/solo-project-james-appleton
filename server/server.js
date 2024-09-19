const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const bikeRidesController = require('./bikeRidesController');
const mapboxController = require('./mapboxController');

app.use(bodyparser.json());

app.get('/server', (req, res) => {
  res.status(200);
  return res.send({ data: 'Test nodemon' });
});

app.use('/build', express.static(path.join(__dirname, '../build')));

app.get('/', (req, res) => {
  return res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/rides', bikeRidesController.getAllRides, (req, res) => {
  res.status(200);
  return res.send(res.locals.geometry);
});

app.post('/rides', bikeRidesController.createNewRide, (req, res) => {
  res.status(200);
  return res.send({ data: 'ride created successfully' });
});

app.post('/findroute', mapboxController.findroute, (req, res) => {
  res.status(200);
  return res.send(res.locals.geometry);
});

app.use((req, res) =>
  res.status(404).send('Wrong turn, looks like you reached a dead end.')
);

app.use((err, req, res, next) => {
  res.status(500);
  return res.send(err);
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
