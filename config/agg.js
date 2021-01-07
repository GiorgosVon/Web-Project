const Data = require("../models/Data")

async function agg(distinctContentType) {
    avgPerContentTypeArr = [];
    for (let i = 0; i < distinctContentType.length; i++) {
        let avgPerContentType = await Data.aggregate([
            {
                "$match": {
                    "userJson.Content-Type": distinctContentType[i]
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
            type: distinctContentType[i],
            avg: avgPerContentType[0]
        };
        avgPerContentTypeArr.push(obj)
    }
    return avgPerContentTypeArr;
}
module.exports = agg;