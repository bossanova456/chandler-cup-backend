const express = require('express');
const router = express.Router();
const { getCurrentSeason } = require('../redis');

/* GET home page. */
router.get('/', function(req, res) {
  res.sendStatus(418);
});

router.get('/currentSeason', function(req, res) {
  getCurrentSeason()
    .then(seasonData => {
      if (seasonData) res.send(seasonData);
      else res.sendStatus(404);
    })
});

module.exports = router;