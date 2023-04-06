const express = require('express');
const router = express.Router();

const { writeMatchupDataByWeekAndId, getMatchupsByWeek } = require('../redis');

router.get('/year/:year/week/:weekNum', function(req, res) {
  getMatchupsByWeek(req.params.year, req.params.weekNum)
    .then(matchupData => {
      res.send(matchupData);
    })
});

router.post('/year/:year/week/:weekNum/matchup/:matchupId', function(req, res) {
  writeMatchupDataByWeekAndId(req.params.year, req.params.weekNum, req.params.matchupId, req.body)
    .then(data => {
      res.send(data);
    })
})

module.exports = router;