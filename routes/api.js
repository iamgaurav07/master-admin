let express = require("express");
let router = express.Router();
require("../config/db");

var multer = require("multer");

let _commonCtrl = require("../controllers/commonCtrl");
let _master = require("../controllers/master");
let _news = require("../controllers/news");
let _eventsCtrl = require("../controllers/eventCtrl");
let _adminUser = require("../controllers/adminUser");
const fileFilter = function (req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(pdf|doc|docx)$/)) {
    // return cb(new Error("Only PDF and DOC files are allowed!"), false);
    req.body.fileError = "Only PDF and DOC files are allowed!";
    return cb(null, true);
  }
  cb(null, true);
};

const UPLOAD_PATH = "uploads";
const upload = multer({
  dest: `${UPLOAD_PATH}/`,
  fileFilter: fileFilter
});

// Get Home route
router.get("/", function (req, res) {
  res.json({
    API: "1.0"
  });
});

router.get("/test", _commonCtrl.testFn);
router.post("/contact-us", _commonCtrl.contactForm);
router.post("/enrollementForm", _commonCtrl.enrollementForm);

router.post("/become-master", _commonCtrl.becomeMaster);
router.post(
  "/apply",
  upload.array("attachments", 2),
  _commonCtrl.applyForJob,
  function (err) {
    if (err) {
      // An error occurred when uploading
      console.log("came in error here");
      console.log(err);

      return;
    }

    // Everything went fine
    console.log("came in ok");
  }
);

router.post("/savenews", _news.saveNews);
router.get("/news", _news.getNews);
router.get("/getNewsforMaster", _news.getNewsforMaster);


router.post("/master", _master.saveMaster);
router.post("/event", _eventsCtrl.saveEvent);

router.post("/saveEventLocation", _eventsCtrl.saveEventLocations);


router.post("/registerForEvent", _eventsCtrl.registerForEvent);
router.get("/event/:id", _eventsCtrl.getEvent);
router.get("/events", _eventsCtrl.getAllEvents);
router.get("/getEventLocations", _eventsCtrl.getEventLocations);
router.get("/eventsForHomepage", _eventsCtrl.getAllEventsForHomePage);
router.get("/masters", _master.getAllMasters);
router.get("/masterBySlug/:slug", _master.getMasterBySlug);

router.get("/generateMastersSlug", _master.generateMastersSlug);

router.get("/master/:id", _master.getMaster);
router.get("/generateEventsSlug", _eventsCtrl.generateEventsSlug);
router.get("/eventbyslug/:id", _eventsCtrl.getEventbyslug);

router.post("/autofetchnews", _news.autoFetchNews);
router.post("/saveautofetchquery", _news.saveAutoFetchQuery);

router.patch("/master/:id", _master.updateMaster);
router.post("/deletenews", _news.deleteNews);
router.post("/editnews", _news.editNews);
router.post("/updatenews", _news.updateNews);

router.post("/adduser",_adminUser.addUser);
router.post("/authenticate",_adminUser.authenticateUser);
router.get("/getallusers", _adminUser.getUsers);
router.patch("/edituser/:id", _adminUser.editUser);

router.post("/editmaster", _master.editMaster)

module.exports = router;
