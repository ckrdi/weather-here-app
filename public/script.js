// making the map and the tiles
const mymap = L.map('mapid').setView([0, 0], 3);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
// tileLayer expects two arguments, one is the url path, 
// second is the attribution as an object
const tiles = L.tileLayer(tileURL, {
  attribution
});
tiles.addTo(mymap);
// making a marker
const marker = L.marker([0, 0]).addTo(mymap);

// checking the geolocation
// getting the current position and then display it on the webpage
if ('geolocation' in navigator) {
  console.log('geolocation available');
} else {
  console.log('geolocation not available');
}

function setup() {
  document.getElementById('postRequest').addEventListener('click', function getLocation(event) {
    // prevent the page from reloading when the button is clicked
    event.preventDefault();
    // use async keyword so we can use await
    navigator.geolocation.getCurrentPosition(async (position) => {
      // assign the latitude and longitude to variable(s)
      // add a timestamp when getLocation is called
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const timestamp = Date.now();
      // assign the value of input to a variable
      // const text = document.getElementById('mood').value;

      // display the location to the webpage
      document.getElementById('lat').textContent = lat.toFixed(2);
      document.getElementById('lon').textContent = lon.toFixed(2);
      document.getElementById('localTime').textContent = new Date(timestamp).toLocaleString();

      // setting the map according to the geolocation
      mymap.setView([lat, lon], 15);
      marker.setLatLng([lat, lon]);

      // send the data to the server using fetch()
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          lat,
          lon,
          timestamp
        })
      });
      const data = await response.json();
      // console.log(data);



      // send the lat lon data to server to be used to call weather api
      const api_url = `weather/${lat},${lon}`;
      // receive the weather data
      const weather_response = await fetch(api_url);
      const json = await weather_response.json();
      // console.log(json);
      // convert the temperature to celcius from kelvin
      const mainTemp = json.main.temp - 273.15;
      const feelsTemp = json.main.feels_like - 273.15;
      // display the data to the webpage
      document.getElementById('temperature').textContent = mainTemp.toFixed(0);
      document.getElementById('feelsLike').textContent = feelsTemp.toFixed(0);

      // fetch a random dog image
      const dog_response = await fetch('/dog');
      const dog_json = await dog_response.json();
      document.getElementById('randomDog').src = dog_json.message;
    })
  })
};
setup();