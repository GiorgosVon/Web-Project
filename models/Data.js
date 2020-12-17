const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
    userJson: {
        "Host": {
            "type": "String"
        },
        "pragma": {
            "type": "String"
        },
        "Content-Type": {
            "type": "String"
        },
        "cache-control": {
            "type": "String"
        },
        "age": {
            "type": "String"
        },
        "Last-Modified": {
            "type": "String"
        },
        "ip": {
            "type": "String"
        },
        "url": {
            "type": "String"
        },
        "timing": {
            "type": "Number"
        },
        "date": {
            "type": "Date"
        },
        "method": {
            "type": "String"
        },
        "status": {
            "type": "Number"
        },
        "statusText": {
            "type": "String"
        }
    }
});

const Data = mongoose.model("Data", DataSchema);

module.exports = Data;