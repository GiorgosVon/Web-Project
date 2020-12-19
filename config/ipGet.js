const axios = require('axios');

// whatismyipaddress api
const remoteIPv4Url = 'http://ipv4bot.whatismyipaddress.com/';
const remoteIPv6Url = 'http://ipv6bot.whatismyipaddress.com/';

// Try getting an external IPv4 address.
async function getExternalIPv4(debug = false) {
    try {
        const response = await axios.get(remoteIPv4Url);
        if (response && response.data) {
            return response.data;
        }
    } catch (error) {
        if (debug) {
            console.log(error);
        }
    }
    return undefined;
}

// Try getting an external IPv6 address.
async function getExternalIPv6(debug = false) {
    try {
        const response = await axios.get(remoteIPv6Url);
        if (response && response.data) {
            return response.data;
        }
    } catch (error) {
        if (debug) {
            console.log(error);
        }
    }
    return undefined;
}

async function getExternalIP(debug = false) {
    let address;
    // Try IPv4 and then IPv5
    address = await getExternalIPv4(debug);
    if (!address) {
        address = await getExternalIPv6(debug);
    }
    return address;
}

module.exports = { getExternalIP, getExternalIPv4, getExternalIPv6 }
