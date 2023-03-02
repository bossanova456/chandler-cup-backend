const express = require('express');
const router = express.Router();

const { getTeams, getTeamById } = require('../redis');

// router.get('/', function(req, res) {
// 	getTeamById(req.params.teamId)
// 	  .then(teamData => {
// 		res.send(teamData);
// 	  });
//   });

router.get('/:teamId', function(req, res) {
	getTeamById(req.params.teamId)
	  	.then(teamData => {
			res.send(teamData);
	  	});
  	});

module.exports = router;