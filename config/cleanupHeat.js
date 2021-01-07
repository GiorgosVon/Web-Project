function cleanupHeatData(data) {
    heatData = data;
    for (let i = 0; i < data.length; i++) {
        delete data[i]['_id'];
        delete data[i]['user'];
        delete data[i]['__v'];
    }

    return heatData;
}

module.exports = cleanupHeatData;