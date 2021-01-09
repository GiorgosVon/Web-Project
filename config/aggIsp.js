const Data = require("../models/Data")

async function aggIsp(distinctIsp) {
    avgPerIspArr = [];
    for (let i = 0; i < distinctIsp.length; i++) {
        let avgPerIsp = await Data.aggregate([
            {
                "$match": {
                    "userIsp": distinctIsp[i]
                }
            },
            {
                "$group": {
                    "_id": { "$hour": "$userJson.date" },
                    "perHour": { "$avg": "$userJson.timing" },
                    "count": { "$sum": 1 }
                }
            },
            {
                "$group": {
                    "_id": null,
                    "counts": {
                        "$push": { "k": { "$toString": "$_id" }, "v": { "average": "$perHour", "count": "$count" } }
                    }
                }
            },
            {
                "$replaceRoot": {
                    "newRoot": { "$arrayToObject": "$counts" }
                }
            }
        ]);
        let obj = {
            type: distinctIsp[i],
            avg: avgPerIsp[0]
        };
        avgPerIspArr.push(obj)
    }
    return avgPerIspArr;
}
module.exports = aggIsp;