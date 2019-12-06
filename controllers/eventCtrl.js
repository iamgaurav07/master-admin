"use strict";

const _CommonCtrl = require("../controllers/commonCtrl");
let _et = require("../util/emailTemplates");

//models
const Event = require("../models/website/event");

const EventRegistration = require("../models/website/eventRegistration");
const EventLocation = require("../models/website/eventLocationMaster");




async function getAllEvents(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };

  try {
    let masters = await Event.find({}).sort({
      "eventDate": 1
    });
    respObj.IsSuccess = true;
    respObj.Data = masters;
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
    res.status(500).json(respObj);
  }
}

async function generateEventsSlug(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };

  try {
    let masters = await Event.find({}).sort({
      "eventDate": 1
    });
    masters.forEach(async element => {
      element.slug = element.title.replace(/(\s|\W)+/g, '-').toLowerCase();
      await element.save()
    });
    respObj.IsSuccess = true;
    respObj.Data = masters;
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
    res.status(500).json(respObj);
  }
}






async function saveEvent(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {
    if (!req.body.title)
      res
      .status(400)
      .json({
        err: "BAD_REQUEST",
        message: "Event title is required"
      });
    let master = await new Event(req.body).save();
    respObj.IsSuccess = true;
    respObj.Data = master;
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
    res.status(500).json(respObj);
  }
}



async function saveEventLocations(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {
    if (!req.body.location)
      res
      .status(400)
      .json({
        err: "BAD_REQUEST",
        message: "Event location is required"
      });
    let master = await new EventLocation({
      location: req.body.location
    }).save();
    respObj.IsSuccess = true;
    respObj.Data = master;
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
    res.status(500).json(respObj);
  }
}

async function getEvent(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {
    let master = await Event.findOne({
      _id: req.params.id
    });
    respObj.IsSuccess = true;
    respObj.Data = master;
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
    res.status(500).json(respObj);
  }
}

async function getEventLocations(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {
    let masterLocations = await EventLocation.find({

    });
    respObj.IsSuccess = true;
    respObj.Data = masterLocations;
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
    res.status(500).json(respObj);
  }
}

async function getEventbyslug(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {
    let master = await Event.findOne({
      slug: req.params.id
    });
    if(master){
    respObj.IsSuccess = true;
    respObj.Data = master;
    res.status(200).json(respObj);
    }
else{
  respObj.IsSuccess = false;
  respObj.Data = null;
}
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
    res.status(500).json(respObj);
  }
}
async function registerForEvent(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {
    if (!req.body.name)
      res.status(400).json({
        err: "BAD_REQUEST",
        message: "Event attendee name is required"
      });
    if (!req.body.email)
      res.status(400).json({
        err: "BAD_REQUEST",
        message: "Event attendee email is required"
      });
    if (!req.body.mobile)
      res.status(400).json({
        err: "BAD_REQUEST",
        message: "Event attendee mobile number is required"
      });
    if (!req.body.event_Id)
      res
      .status(400)
      .json({
        err: "BAD_REQUEST",
        message: "Event id is required"
      });
    let master = await new EventRegistration(req.body).save();
    respObj.IsSuccess = true;

    // email to organizer regarding new registration
    let mailObj = {
      to: process.env.CONTACT_FORM_RECEPIENT,
      from: process.env.EMAILS_NO_REPLY,
      subject: "New event registion @ " + process.env.APP_NAME,
      templateId: _et.getTemplateIdFromName(
        "New_event_registration_to_admin",
        process.env.ENV
      ),
      substitutions: {
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        appName: process.env.APP_NAME,
        eventName: req.body.eventName,
        EMAILER_IMAGES_BASE_PATH: process.env.EMAILER_IMAGES_BASE_PATH
      }
    };

    _CommonCtrl.sendEmail(mailObj);

    //confirmatino email to attendee
    mailObj = {
      to: req.body.email,
      from: process.env.EMAILS_NO_REPLY,
      subject: "Your event registion confirmation @ " + process.env.APP_NAME,
      templateId: _et.getTemplateIdFromName(
        "Event_registration_confirmation_to_attendee",
        process.env.ENV
      ),
      substitutions: {
        name: req.body.name,
        eventName: req.body.eventName,
        appName: process.env.APP_NAME,
        EMAILER_IMAGES_BASE_PATH: process.env.EMAILER_IMAGES_BASE_PATH
      }
    };

    _CommonCtrl.sendEmail(mailObj);
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
    res.status(500).json(respObj);
  }
}
async function getAllEventsForHomePage(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };

  try {
    let d = new Date();
    let masters = await Event.find({
      "eventDate": {
        $gt: d
      }
    }).sort({
      "eventDate": 1
    }).limit(10);
    respObj.IsSuccess = true;
    respObj.Data = masters;
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
    res.status(500).json(respObj);
  }
}
module.exports = {
  generateEventsSlug,
  getAllEvents,
  saveEvent,
  getEvent,
  registerForEvent,
  getAllEventsForHomePage,
  getEventbyslug,
  saveEventLocations,

  getEventLocations

};