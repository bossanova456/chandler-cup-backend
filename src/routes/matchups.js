const express = require('express');
const router = express.Router();

const { writeMatchupDataByWeekAndId, getMatchupsByWeek, getMatchupWeeks, addNewWeek } = require('../redis');

router.get('/year/:year/weeks', function(req, res) {
  getMatchupWeeks(req.params.year)
    .then(weekData => {
      res.send(weekData);
    })
})

router.post('/year/:year/addWeek/:newWeek', function(req, res) {
  addNewWeek(req.params.year, req.params.newWeek)
    .then(response => {
      res.send(response);
    })
})

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