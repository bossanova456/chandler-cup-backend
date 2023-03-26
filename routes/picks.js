const express = require('express');
const { getPickData, getPicksByMatchup, getPicksByYearAndWeek } = require('../redis');
const router = express.Router();

router.get('/year/:year/week/:week/matchup/:matchup', function(req, res) {
	getPicksByMatchup(req.params.year, req.params.week, req.params.matchup)
		.then(picks => {
			if (Object.keys(picks).length > 0) {
				res.send(picks);
			} else {
				res.sendStatus(404);
			}
		});
});
  
router.get('/year/:year/week/:week/matchup/:matchup/user/:user', function(req, res) {
	getPickData(req.params.year, req.params.week, req.params.matchup, req.params.user)
		.then(pickData => {
			if (pickData) res.send(pickData);
			else res.sendStatus(404);
		});
});

// Get picks by week for all users & matchups
router.get('/year/:year/week/:week', function(req, res) {
	getPicksByYearAndWeek(req.params.year, req.params.week)
		.then(pickData => {
			if (pickData) res.send(pickData);
			else res.sendStatus(404);
		});
})

module.exports = router;