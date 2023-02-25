const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({
    title: "index",
    other: "stuff"
  })
});

router.post('/', function(req, res) {
  res.send({
    title: "index",
    other: "post"
  })
});

module.exports = router;
