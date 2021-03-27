// making the map and the tiles
const mymap = L.map('mapid').setView([0, 0], 1);
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
// tileLayer expects two arguments, one is the url path, 
// second is the attribution as an object
const tiles = L.tileLayer(tileURL, {
  attribution
});
tiles.addTo(mymap);

async function getData() {
  const response = await fetch('/api');
  const data = await response.json();

  // iterate the array from data
  for (let i = 0; i < data.length; i++) {
    // set the marker to the map
    const marker = L.marker([data[i].lat, data[i].lon]).addTo(mymap);
    // insert a text to the marker
    const txt = `the weather here at ${data[i].lat.toFixed(2)}, ${data[i].lon.toFixed(2)}, as of ${new Date(data[i].timestamp).toLocaleString()} is ${data[i].weatherMain}, ${data[i].weatherDesc} with temperature of ${data[i].mainTemp.toFixed(0)} degree Celcius.`;
    marker.bindPopup(txt);
  }
};

// listen the click event button
document.getElementById('getRequest').addEventListener('click', getData);