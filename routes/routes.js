var express = require('express');
var router = express.Router();

/* GET route page. */
router.get('/', function(req, res, next) {
  res.render('route', {title: 'Driver'});
});

module.exports = router;
