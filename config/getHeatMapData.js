const getUniqueIpCount = require("../config/uniqueIpGet")
const prepareIps = require("../config/prepareIpData")
const getGeoData = require("../config/getGeoData")
const getFinalGeoData = require("../config/geoDataFinal")

async function getHeapMapData(myJson) {
    // get Unique ips with counts for heatmap
    const uniqueIp = await getUniqueIpCount(myJson);
    // prepare ip for geolocation
    const prepareIp = await prepareIps(uniqueIp);
    // get Geolocation data from api
    const geoData = await getGeoData(prepareIp);
    // finalize data
    const finalGeoData = getFinalGeoData(geoData);

    return finalGeoData
}

module.exports = getHeapMapData;