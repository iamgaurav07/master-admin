"use strict";
const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
// const config = require('../config/db');
const Schema = mongoose.Schema;

const UserSchema =mongoose.Schema({
  name: {
    type: String
  }, 
  email:{
        type:String,
        required:[true,'Email is required'],
        unique: true
    }, 
    password: {
      type: String,
      required: [true,'Password is required']
    },
    // role:{
    //     type:String,
    //     required: true
    // }, 
});
const adminUser =module.exports = mongoose.model('adminUser',UserSchema);

