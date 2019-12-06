"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  mainImage: {
    type: String
  },
  title: {
    type: String
  },
  eventDate: {
    type: Date
  },
  fromTime: String,
  toTime: String,
  registrationType: {
    type: String,

    enum: ["FREE", "PAID"],
    default: "FREE"
  },
  eventType: {
    type: String,

    enum: [
      "BUSINESS",
      "EDUCATIONAL",
      "ENTERTAINMENT",
      "HEALTh_AND_FITNESS",
      "LIFESTYLE_AND_EXHIBITION",
      "MARATHONS",
      "SPORTS",
      "TRAVEL",
      "OTHERS"
    ],
    default: "EDUCATIONAL"
  },
  eventLocation: {
    type: String
  },
  slug: {
    type: String
  }
}, {
  timestamp: true,
  autoIndex: true,
  versionKey: false
});

let Event = mongoose.model("Event", EventSchema);

module.exports = Event;