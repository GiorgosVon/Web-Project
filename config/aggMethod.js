const Data = require("../models/Data")

async function aggMethod(distinctMethod) {
    avgPerMethodArr = [];
    for (let i = 0; i < distinctMethod.length; i++) {
        let avgPerMethod = await Data.aggregate([
            {
                "$match": {
                    "userJson.method": distinctMethod[i]
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
            type: distinctMethod[i],
            avg: avgPerMethod[0]
        };
        avgPerMethodArr.push(obj)
    }
    return avgPerMethodArr;
}
module.exports = aggMethod;