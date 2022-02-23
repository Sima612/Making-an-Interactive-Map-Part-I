// What events will your application need?
// What APIs will you need and in what order?
// How will you obtain the user's location?
// How will you add the user's location to the map?
// How will you get the selected location from the user?
// How will you add that information to the map?

const myMap = L.map('map', {
    center: [42.272249937341535, -71.80258979314445],
    zoom: 15,
});
// Add OpenStreetMap tiles:
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2ltYTEwMTUzMSIsImEiOiJja3p5ZHV0em0wYWVuMm9yMm5qMHRpYnU2In0.QE6NK5tozUgVhLYnN4XuRg'
}).addTo(myMap);

// Create and add a geolocation marker:
const marker = L.marker([42.272249937341535, -71.80258979314445])
marker.addTo(myMap).bindPopup('<p1><b>You Are Here.</b></p1>').openPopup()

// Get user location
function userLocation() {
    const successCall = (position) => {
        console.log(position)
    }
    const errorCall = (error) => {
        console.error(error)
    }
    navigator.geolocation.getCurrentPosition(successCall, errorCall)
}
userLocation()

//Business marker
const business = []
function businessMarker() {
    for(let i=0;i<business.length;i++) {
        let markers = L.marker([
            business[i].myMap,
            business[i].myMap
        ])
        .openPopup(`<p1>${markers[i].name}</p>`).addTo(myMap)
    }
}

//Foursquare API
async function fourSquare(business) {
    const options = {
        method: 'GET',
        headers: {
        Accept: 'application/json',
        Authorization: 'fsq3sAUI906SYbVf3+iVSEPWWGs9mUElQI2U4wm76GOMx8w='
        }
    };
    let limit;
    let response = await fetch(`https://api.foursquare.com/v3/places/nearby?ll=42.272249937341535%2C-71.80258979314445&query=business&${limit=5}`, options)
    let data = await response.text()
	let parsedData = JSON.parse(data)
	let businesses = parsedData.results
        // .then(response => response.json())
        // .then(response => console.log(response))
        // .catch(err => console.error(err));

    return businesses
}
fourSquare()

//forSquare array
function processBusinesses(data) {
    let businesses = data.map((element) => {
        let location = {
            name: element.name,
            lat: element.geocodes.main.latitude,
            long: element.geocodes.main.longtitude
        }
        return location
    })
    return businesses
}

//Event Listener
const submitBtn = document.getElementById('submit')
submitBtn.addEventListener('click', async (event) => {
    event.preventDefault()
    let business = document.getElementById('business').value
    let data = await fourSquare(business)
    let businessData = processBusinesses(data) + business
    console.log(businessData)
    businessMarker(myMap)
})

//Windowload
window.onload = () => {
	const coords = userLocation()
	const myMap = coords
	console.log(myMap)
}