var ObjectId = require('mongodb').ObjectID;
const Data = require("../models/Data")

async function getUniqueIpCount(myJson) {
    obj = {};
    for (let i = 0; i < myJson.length; i++) {
        if (!obj[myJson[i].ip]) {
            obj[myJson[i].ip] = 1;
        } else if (obj[myJson[i].ip]) {
            obj[myJson[i].ip] += 1;
        }
    }
    return obj;
}
module.exports = getUniqueIpCount;