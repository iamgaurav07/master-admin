let nLog = require("noogger");
var multer = require("multer");
var upload = multer({
  dest: "uploads/"
});
const fs = require("fs");

//my own depend
let _et = require("../util/emailTemplates");

// thir party services
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_EMAIL_API);

let sendEmail = (exports.sendEmail = async function (mailObj, attachments = []) {
  try {
    console.log("came in to send mail");
    let msg = {
      to: mailObj.to,
      from: mailObj.from,
      subject: mailObj.subject,
      templateId: mailObj.templateId,
      substitutions: mailObj.substitutions
    };
    if (process.env.IS_EMAILS_LOCKED == 1) {
      msg.to = "malkit@venturepact.com";
      msg.subject = msg.subject + " (for -> " + mailObj.to + ")";
    }
    if (attachments.length > 0) {
      msg.attachments = attachments;
    }

    sgMail.send(msg);
  } catch (err) {
    console.error(err);
  }
});

let testFn = (exports.testFn = async function (req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {
    respObj.IsSuccess = true;
    res.json(respObj);
  } catch (ex) {
    console.log("Server error in CommonCtrl->testFn");
    nLog.error("Server error in CommonCtrl->testFn");
    nLog.error(ex);
    console.error(ex);
    respObj.Message = "Server Error.";
    return res.json(respObj);
  }
});

let contactForm = (exports.contactForm = async function (req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {
    if (!req.body.email) {
      respObj.Message = "Email missing.";
      return res.json(respObj);
    }
    if (!req.body.name) {
      respObj.Message = "Name missing.";
      return res.json(respObj);
    }

    // to site admin
    let mailObj = {
      to: process.env.CONTACT_FORM_RECEPIENT,
      from: process.env.EMAILS_NO_REPLY,
      subject: "New contact form filled @ " + process.env.APP_NAME,
      templateId: _et.getTemplateIdFromName(
        "Contact-us-to-admin",
        process.env.ENV
      ),

      substitutions: {
        email: req.body.email,
        name: req.body.name,

        mobile: req.body.mobile || "",
        message: req.body.message || "",

        appName: process.env.APP_NAME,
        EMAILER_IMAGES_BASE_PATH: process.env.EMAILER_IMAGES_BASE_PATH
      }
    };

    sendEmail(mailObj);

    // to user
    mailObj = {
      to: req.body.email,
      from: process.env.EMAILS_NO_REPLY,
      subject: "Thanks for contacting us @ " + process.env.APP_NAME,
      templateId: _et.getTemplateIdFromName(
        "Contact-us-to-endUser",
        process.env.ENV
      ),
      substitutions: {
        name: req.body.name,
        appName: process.env.APP_NAME,
        EMAILER_IMAGES_BASE_PATH: process.env.EMAILER_IMAGES_BASE_PATH
      }
    };

    sendEmail(mailObj);

    respObj.IsSuccess = true;
    respObj.Message = "Ok.";
    res.json(respObj);
  } catch (ex) {
    console.log("Server error in CommonCtrl->testFn");
    nLog.error("Server error in CommonCtrl->testFn");
    nLog.error(ex);
    console.error(ex);
    respObj.Message = "Server Error.";
    return res.json(respObj);
  }
});


let enrollementForm = (exports.enrollementForm = async function (req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };
  try {
    if (!req.body.email) {
      respObj.Message = "Email missing.";
      return res.json(respObj);
    }
    if (!req.body.name) {
      respObj.Message = "Name missing.";
      return res.json(respObj);
    }

    // to site admin
    let mailObj = {
      to: process.env.CONTACT_FORM_RECEPIENT,
      from: process.env.EMAILS_NO_REPLY,
      subject: "New enrollement form filled @ " + process.env.APP_NAME,
      templateId: _et.getTemplateIdFromName(
        "Enrol_club_to_admin",
        process.env.ENV
      ),

      substitutions: {
        email: req.body.email,
        name: req.body.name,

        mobile: req.body.mobile || "",
        clubName: req.body.club || "",

        appName: process.env.APP_NAME,
        EMAILER_IMAGES_BASE_PATH: process.env.EMAILER_IMAGES_BASE_PATH
      }
    };

    sendEmail(mailObj);

    // to user
    mailObj = {
      to: req.body.email,
      from: process.env.EMAILS_NO_REPLY,
      subject: "Thanks for contacting us @ " + process.env.APP_NAME,
      templateId: _et.getTemplateIdFromName(
        "Enroll_club_to_end_User",
        process.env.ENV
      ),
      substitutions: {
        name: req.body.name,
        clubName: req.body.club,
        appName: process.env.APP_NAME,
        EMAILER_IMAGES_BASE_PATH: process.env.EMAILER_IMAGES_BASE_PATH
      }
    };

    sendEmail(mailObj);

    respObj.IsSuccess = true;
    respObj.Message = "Ok.";
    res.json(respObj);
  } catch (ex) {
    console.log("Server error in CommonCtrl->testFn");
    nLog.error("Server error in CommonCtrl->testFn");
    nLog.error(ex);
    console.error(ex);
    respObj.Message = "Server Error.";
    return res.json(respObj);
  }
});

function base64_encode(file) {
  var bitmap = fs.readFileSync(file);
  fs.unlinkSync(file);
  return new Buffer(bitmap).toString("base64");
}

let applyForJob = (exports.applyForJob = async function (req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };


  if (req.body.fileError) {
    respObj.Message = req.body.fileError;
    return res.json(respObj);
  }

  try {
    if (!req.body.email) {
      respObj.Message = "Email missing.";
      return res.json(respObj);
    }
    if (!req.body.name) {
      respObj.Message = "Name missing.";
      return res.json(respObj);
    }

    if (!req.body.mobile) {
      respObj.Message = "Mobile number missing.";
      return res.json(respObj);
    }

    var attachmentsArray = [];

    if (req.files && req.files.length > 0) {
      for (var i = 0; i < req.files.length; i++) {
        var attItem = {
          content: base64_encode(req.files[i].path),
          filename: req.files[i].originalname,
          type: req.files[i].mimetype,
          disposition: "attachment"
        };

        attachmentsArray.push(attItem);
      }
    }

    // to site admin
    let mailObj = {
      to: process.env.CONTACT_FORM_RECEPIENT,
      from: process.env.EMAILS_NO_REPLY,
      subject: "New job application @ " + process.env.APP_NAME,
      templateId: _et.getTemplateIdFromName(
        "Job_apply_to_admin",
        process.env.ENV
      ),

      substitutions: {
        email: req.body.email,
        name: req.body.name,
        slug: req.body.slug,

        mobile: req.body.mobile || "",
        coverLetter: req.body.message,
        appName: process.env.APP_NAME,
        EMAILER_IMAGES_BASE_PATH: process.env.EMAILER_IMAGES_BASE_PATH
      }
    };

    sendEmail(mailObj, attachmentsArray);

    // to user
    mailObj = {
      to: req.body.email,
      from: process.env.EMAILS_NO_REPLY,
      subject: "We have got your job application @ " + process.env.APP_NAME,
      templateId: _et.getTemplateIdFromName(
        "Job_apply_to_end_user",
        process.env.ENV
      ),
      substitutions: {
        name: req.body.name,
        appName: process.env.APP_NAME,
        EMAILER_IMAGES_BASE_PATH: process.env.EMAILER_IMAGES_BASE_PATH
      }
    };

    sendEmail(mailObj);

    respObj.IsSuccess = true;
    respObj.Message = "Ok.";
    res.json(respObj);
  } catch (ex) {
    console.log("Server error in CommonCtrl->applyForJob");
    nLog.error("Server error in CommonCtrl->applyForJob");
    nLog.error(ex);
    console.error(ex);
    respObj.Message = "Server Error.";
    return res.json(respObj);
  }
});


let becomeMaster = (exports.becomeMaster = async function (req, res) {
  let respObj = {
    IsSuccess: false,
    Message: "OK.",
    Data: null
  };



  try {
    if (!req.body.email) {
      respObj.Message = "Email missing.";
      return res.json(respObj);
    }
    if (!req.body.name) {
      respObj.Message = "Name missing.";
      return res.json(respObj);
    }

    if (!req.body.mobile) {
      respObj.Message = "Mobile number missing.";
      return res.json(respObj);
    }

    if (!req.body.why) {
      respObj.Message = "You should mention why you want to join.";
      return res.json(respObj);
    }



    // to site admin
    let mailObj = {
      to: process.env.CONTACT_FORM_RECEPIENT,
      from: process.env.EMAILS_NO_REPLY,
      subject: "New application to become a master @ " + process.env.APP_NAME,
      templateId: _et.getTemplateIdFromName(
        "Become_master_to_admin",
        process.env.ENV
      ),

      substitutions: {
        email: req.body.email,
        name: req.body.name,

        mobile: req.body.mobile || "",
        acheivements: req.body.acheivements || "",
        positions: req.body.positions || "",
        why: req.body.why || "",

        appName: process.env.APP_NAME,
        EMAILER_IMAGES_BASE_PATH: process.env.EMAILER_IMAGES_BASE_PATH
      }
    };

    sendEmail(mailObj);

    // to user
    mailObj = {
      to: req.body.email,
      from: process.env.EMAILS_NO_REPLY,
      subject: "We have got your application to become master @ " + process.env.APP_NAME,
      templateId: _et.getTemplateIdFromName(
        "Become_master_to_end_user",
        process.env.ENV
      ),
      substitutions: {
        name: req.body.name,
        appName: process.env.APP_NAME,
        EMAILER_IMAGES_BASE_PATH: process.env.EMAILER_IMAGES_BASE_PATH
      }
    };

    sendEmail(mailObj);

    respObj.IsSuccess = true;
    respObj.Message = "Ok.";
    res.json(respObj);
  } catch (ex) {
    console.log("Server error in CommonCtrl->becomeMaster");
    nLog.error("Server error in CommonCtrl->becomeMaster");
    nLog.error(ex);
    console.error(ex);
    respObj.Message = "Server Error.";
    return res.json(respObj);
  }
});