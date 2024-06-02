
let map_token = "pk.eyJ1IjoiZG9uYmFzdHktMTUiLCJhIjoiY2x3dzAxczI5MGtiMDJqc2FzMmkyZHQyZiJ9.7vsRSvWwovZg6FGPeeuh5w";
   
mapboxgl.accessToken = map_token;
 const map = new mapboxgl.Map({
     container: 'map', // container ID
     center: listing.geometry.coordinates, //cordinates
     style: "mapbox://styles/mapbox/streets-v12",// starting position [lng, lat]
     zoom: 9 // starting zoom
 });

// Create a new marker.
// Create a new marker.
const marker = new mapboxgl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${listing.title}</h4><p>${listing.location}</p>`))
    .addTo(map);

