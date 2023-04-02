const express = require('express');
const { getUsers, addUser, getCurrentSeasonYear } = require('../redis');
const router = express.Router();

router.get('/', function(req, res) {
	getCurrentSeasonYear()
		.then(seasonYear => {
			getUsers(seasonYear)
				.then(usersData => {
				res.send(usersData[0]);
				});
			}
		);
	});
	
router.get('/:seasonYear', function(req, res) {
	getUsers(req.params.seasonYear)
		.then(userData => {
			if (userData[0]) res.send(userData[0]);
			else res.sendStatus(404);
		});
});
	
router.post('/addUser/:userName', function(req, res) {
	addUser("2022", {
		name: req.params.userName
	})
	.then(() => {
		res.send("User added: " + req.params.userName);
	});
});

module.exports = router;