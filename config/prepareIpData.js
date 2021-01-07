const axios = require("axios")

async function prepareHeatLayer(uniqueIp) {
    let ips = uniqueIp

    // remove entries with no ip
    delete ips[""]

    // count normalization
    // z = x - min(x) / max(x) - min(x)
    let arr = Object.values(ips);
    let min = Math.min(...arr);
    let max = Math.max(...arr);

    for (let ip in ips) {
        if (ips[ip] === max) {
            ips[ip] = ((ips[ip] - min) / (max - min)).toFixed(1);
        } else if (ips[ip] === min) {
            ips[ip] = 0.1;
        } else {
            ips[ip] = (parseFloat((ips[ip] - min) / (max - min)) + 0.1).toFixed(1);
        }
    }
    return ips
}

module.exports = prepareHeatLayer;