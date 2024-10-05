var express = require("express");
var router = express.Router();

/* GET car page. */
router.get("/", function (req, res, next) {
  res.render("car", { title: "Car" });
});

module.exports = router;
