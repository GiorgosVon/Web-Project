const { response } = require("express");

function geoDataFinal(geoData) {
    let myGeoData = geoData
    myGeoData.forEach(function (data) { delete data.query });

    return myGeoData;
}

module.exports = geoDataFinal;