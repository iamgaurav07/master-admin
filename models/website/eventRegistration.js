"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventRegistraionSchema = new Schema(
  {
    event_Id: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    name: String,
    email: String,
    mobile: String,
    registeredOn: { type: Date, default: new Date() }
  },
  {
    timestamp: true,
    autoIndex: true,
    versionKey: false
  }
);

let EventRegistraion = mongoose.model(
  "EventRegistraion",
  EventRegistraionSchema
);

module.exports = EventRegistraion;
