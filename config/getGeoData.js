const axios = require('axios')

async function getGeoData(preparedData) {
    IPs = [];
    for (ip in preparedData) {
        IPs.push(ip);
    }

    let myData = JSON.stringify(IPs)
    var endpoint = "http://ip-api.com/batch?fields=lat,lon,query";

    try {
        const response = await axios({
            method: 'post',
            url: endpoint,
            data: myData
        })
        if (response && response.data) {

            for (let i = 0; i < response.data.length; i++) {
                for (ip in preparedData) {
                    if (ip == response.data[i].query) {
                        response.data[i]["intensity"] = parseFloat(preparedData[ip]);
                    }
                }
            }
            return response.data;
        }
    } catch (error) {
        console.log(error);
    }
    return undefined
}

module.exports = getGeoData;