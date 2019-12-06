"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewsSchema = new Schema(
  {
    image: {
      type: String,
      default: null
    },
    displayImage: {
      type: String,
      default: null
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: null
    },
    isAutoFetch: {
      type: Boolean,
      default: false
    },
    masterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Master'
    },
    publishedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamp: true,
    autoIndex: true,
    versionKey: false
  }
);

let News = mongoose.model('News', NewsSchema);

module.exports = News;


