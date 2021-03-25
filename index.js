// import the express package
const { request, response } = require('express');
const express = require('express');
const app = express();
const port = 3000;

// import the NeDB package
const Datastore = require('nedb');

// manually loading the database
const database = new Datastore({
  filename: 'database.db'
});
database.loadDatabase();

// import the node-fetch
const fetch = require('node-fetch');

// have the app listen to request(s)
app.listen(port, () => {
  console.log('listening at http://localhost:' + port)
});

// use express middleware to serve static page
// and display anything that is in the public folder
app.use(express.static('public'));

// use express middleware to parse json from request(s)
// because the request payload are too large, we define the payload limit
app.use(express.json({limit: '1mb'}));

// POST handler method
app.post('/api', (request, response) => {
  console.log('I got a request!');
  const data = request.body

  // insert the data to database
  database.insert(data);

  // echo back the request to the client to tell
  // the message was received
  response.send(data);
});

// GET handler method
app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.send('ERROR');
      return;
    }
    response.send(data);
  })
});

// node-fetch to fetch weather
// and send the data to the client
app.get('/weather/:latlon', async (request, response) => {
  console.log(request.params);
  const latlon = request.params.latlon.split(',');
  console.log(latlon);
  const lat = latlon[0];
  const lon = latlon[1];
  console.log(lat, lon);
  const api_key = '';
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
  const fetchResponse = await fetch(weatherUrl);
  const weather = await fetchResponse.json();
  response.json(weather);
})
