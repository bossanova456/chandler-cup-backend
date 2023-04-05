const express = require('express');
const router = express.Router();
const { getCurrentSeason, getTeams, getSchedule } = require('../redis');

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

router.get('/teams', function(req, res) {
  getTeams()
    .then(teamsData => {
      if (teamsData) res.send(teamsData);
      else res.sendStatus(404);
    });
});

router.get('/schedule/year/:year', function(req, res) {
  getSchedule(req.params.year)
    .then(scheduleData => {
      if (scheduleData) res.send(scheduleData);
      else res.sendStatus(404);
    });
})

module.exports = router;