const mongoose = require("mongoose");

const HeatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lat: {
        type: Number
    },
    lon: {
        type: Number
    },
    intensity: {
        type: Number
    }
});

const Heat = mongoose.model("Heat", HeatSchema);

module.exports = Heat;