const express = require('express');
const router = express.Router();

const { writeMatchupData, getMatchupsByWeek } = require('../redis');

router.get('/year/:year/week/:weekNum', function(req, res) {
  getMatchupsByWeek(req.params.year, req.params.weekNum)
    .then(matchupData => {
      res.send(matchupData);
    })
});

module.exports = router;