const axios = require('axios')

async function getUserIsp(publicIp) {
    try {
        const qUrl = "http://ip-api.com/json/" + publicIp + "?fields=isp";
        const response = await axios.get(qUrl);
        if (response && response.data) {
            return response.data.isp;
        }

    } catch (error) {
        console.log(error);
    }
    return undefined
}

module.exports = getUserIsp;