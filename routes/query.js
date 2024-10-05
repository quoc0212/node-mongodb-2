var express = require("express");
var router = express.Router();

/* GET driver page. */
router.get("/", function (req, res, next) {
  res.render("query", { title: "Query" });
});

module.exports = router;
