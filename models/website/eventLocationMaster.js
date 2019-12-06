"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventLocationMasterSchema = new Schema({
    location: {
        type: String,
    }
}, {
    timestamp: true,
    autoIndex: true,
    versionKey: false
});

let EventLocationMaster = mongoose.model("EventLocationMaster", EventLocationMasterSchema);

module.exports = EventLocationMaster;