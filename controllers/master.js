"use strict";
const mongoose = require("mongoose");
const Master = require("../models/website/master");

async function getAllMasters(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };

  try {
    let masters = await Master.aggregate([
      {
        $lookup:
        {
          from: "news",
          localField: "_id",
          foreignField: "masterId",
          as: "in_news"
        }
      }
    ])
    respObj.IsSuccess = true;
    respObj.Data = masters;
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
      res.status(500).json(respObj);
  }
}
async function saveMaster(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };

  try {
    if (!req.body.name)
      res.status(400).json({
        err: "BAD_REQUEST",
        message: "Name is required"
      });
    let master = await new Master(req.body).save();
    respObj.IsSuccess = true;
    respObj.Data = master;
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
      res.status(500).json(respObj);
  }
}
async function getMaster(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {
    let master = await Master.aggregate([{
      $match: {
        _id: req.params.id
      }
    },
    {
      $lookup: {
        from: "news",
        localField: "_id",
        foreignField: "masterId",
        as: "in_news"
      }
    }
    ])
    respObj.IsSuccess = true;
    respObj.Data = master[0] || {};
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
      res.status(500).json(respObj);
  }
}
async function updateMaster(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {
    let master = await Master.findOneAndUpdate({
      _id: req.params.id
    },
      req.body, {
        new: true
      }
    );
    respObj.IsSuccess = true;
    respObj.Data = master;
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
      res.status(500).json(respObj);
  }
}

async function getMasterBySlug(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {

    let master = await Master.aggregate([{
      $match: {
        slug: req.params.slug
      }
    },
    {
      $lookup: {
        from: "news",
        localField: "_id",
        foreignField: "masterId",
        as: "in_news"
      }
    }
    ])
    if (master) {
      respObj.IsSuccess = true;
      respObj.Data = master[0] || {};
    } else {
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


async function getSlug(element) {

  let slug = element.name.replace(/(\s|\W)+/g, '-').toLowerCase();
  let mastr = await Master.findOne({
    slug: slug,
  });
  if (mastr != null) {
    let newSlug = slug + "_" + (mastr.frequency + 1);

    mastr.frequency = mastr.frequency + 1;

    await mastr.save();

    return newSlug
  } else {
    return (slug);
  }
}



async function generateMastersSlug(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };

  try {

    let masters = await Master.find({});


    masters.forEach(async element => {
      let slug = await getSlug(element)
      element.slug = slug;

      await element.save();



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

async function editMaster(req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {
    let master = await Master.findOne({
      _id: mongoose.Types.ObjectId(req.body.id)
    })
    respObj.IsSuccess = true;
    respObj.Data = master || {};
    res.status(200).json(respObj);
  } catch (err) {
    respObj.error = err;
    (respObj.message = err.message || "Error while processing db query"),
      res.status(500).json(respObj);
  }

}

module.exports = {
  getAllMasters,
  saveMaster,
  getMaster,
  generateMastersSlug,
  getMasterBySlug,

  updateMaster,
  editMaster
};