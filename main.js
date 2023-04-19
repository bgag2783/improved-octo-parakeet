const apiKey = 'your_metlink_api_key';
const favStops = document.getElementById('fav-stops-list');
const addStopBtn = document.getElementById('add-stop');
const busStopPage = document.getElementById('bus-stop-page');
const busStopName = document.getElementById('bus-stop-name');
const upcomingBuses = document.getElementById('upcoming-buses');
const backToHomeBtn = document.getElementById('back-to-home');

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Load Favourite Bus Stops
function loadFavStops() {
  const stops = JSON.parse(localStorage.getItem('favStops')) || [];
  favStops.innerHTML = stops.map(stop => `<li data-id="${stop.id}">${stop.name}</li>`).join('');
}

// Add Favourite Bus Stop
function addFavStop(id, name) {
  const stops = JSON.parse(localStorage.getItem('favStops')) || [];
  stops.push({ id, name });
  localStorage.setItem('favStops', JSON.stringify(stops));
  loadFavStops();
}

// Fetch Bus Stop Data
async function fetchBusStopData(stopId) {
  const response = await fetch(`https://api.metlink.org.nz/v2/stop/${stopId}/departures`, {
    headers: {
      'x-api-key': apiKey
    }
  });
  return response.json();
}

// Show Bus Stop Page
async function showBusStopPage(stopId, stopName) {
  busStopName.textContent = stopName;
  favStops.parentElement.hidden = true;
  busStopPage.hidden = false;

  const data = await fetchBusStopData(stopId);
  upcomingBuses.innerHTML = data.map(bus => `<li>${bus.service_id}: ${bus.departure_seconds / 60} minutes</li>`).join('');
}

// Handle Bus Stop Selection
favStops.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    const stopId = event.target.getAttribute('data-id');
    const stopName = event.target.textContent;
    showBusStopPage(stopId, stopName);
  }
});

// Handle Add Bus Stop Button Click
addStopBtn.addEventListener('click', () => {
  const stopId = prompt('Enter Bus Stop ID:');
  const stopName = prompt('Enter Bus Stop Name:');
  addFavStop(stopId, stopName);
});

// Handle Back to Home Button Click
backToHomeBtn.addEventListener('click', () => {
  busStopPage.hidden = true;
  favStops.parentElement.hidden = false;
});

loadFavStops();
