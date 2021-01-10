var map = L.map('adminMap').setView([39.0742, 21.8243], 6);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1IjoiZGVmZXgiLCJhIjoiY2tqMTg1eXZhMGlhdTJzbGdjMDVybmthZyJ9.Z6HlHQllZ1tohkK3pDAsLA"
}).addTo(map);

let userLatLong = JSON.parse(document.getElementById("userLatLong").value);
let userIpMarker = Object.values(userLatLong);

let ipLatLong = JSON.parse(document.getElementById("ipLatLong").value);
let ipMarker = ipLatLong;
let markers = [];
let markersInit = [];
let weights = [];
for (entry of ipMarker) {
    let weight = entry.intensity * 10;
    delete entry["intensity"];
    markersInit.push(Object.values(entry))
    let tempArr = [];
    tempArr.push(userIpMarker, Object.values(entry));
    markers.push(tempArr)
    weights.push(weight);
}

$(document).ready(function () {
    L.marker(userIpMarker).addTo(map);
    for (let marker of markersInit) {
        L.marker(marker).addTo(map);
    }


    for (let i = 0; i < markers.length; i++) {
        L.polyline(markers[i], {
            noClip: true,
            color: "blue",
            weight: weights[i],
        }).addTo(map);
    }
});

