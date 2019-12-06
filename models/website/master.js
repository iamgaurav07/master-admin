"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MasterSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  info: {
    title: String,
    description: String
  },
  teaching_area: {
    type: String
  },
  alma_mater: {
    type: String
  },

  current_position: {
    title: {
      type: String
    },
    description: {
      type: String
    }
  },
  contact: {
    email: String,
    mobile: String,
    address: String,
    publications:String,
    website:String
  },
  about: {
    type: String,
    default: null
  },
  recentConsulting: {
    heading: String,
    sub_heading: String,
    description: [String]
  },
  education: [String],
  positions: [
    {
      type: {
        type: String,
        enum: ["ACADEMIC", "OTHERS"],
        default: "ACADEMIC"
      },
      title: String,
      description: String
    }
  ],
  teaching: [
    {
      institute: String,
      curriculum: [{
        subject: String,
        course: String
      }]
    }
  ],
  awards: [String],
  research: [{ heading: String, sub_heading: String, description: [String] }],
  publications: [String],
  type: {
    type: String,
    enum: ["PRACTITIONER", "PROFESSOR"],
    default: "PROFESSOR"
  },
  frequency: {
    type: Number,
    default: 0
  },

  slug: {
    type: String,

  },
}, {
  timestamp: true,
  autoIndex: true,
  versionKey: false
});



let Master = mongoose.model('Master', MasterSchema);

module.exports = Master;