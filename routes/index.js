const express = require('express');
const router = express.Router();
const { getCurrentSeasonYear } = require('../redis');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendStatus(418);
});

router.get('/year', function( req, res) {
  getCurrentSeasonYear()
    .then(year => {
      if (year) res.send(year);
      else res.sendStatus(404);
    })
})

module.exports = router;