const express = require('express');
const { getUsers, addUser, getCurrentSeasonYear } = require('../redis');
const router = express.Router();
	
router.get('/:seasonYear', function(req, res) {
	getUsers(req.params.seasonYear)
		.then(userData => {
			if (userData[0]) res.send(userData[0]);
			else res.sendStatus(404);
		});
});
	
router.post('/:seasonYear/addUser/:userName', function(req, res) {
	addUser(req.params.seasonYear, {
		name: req.params.userName
	})
	.then(() => {
		res.send("User added: " + req.params.userName);
	});
});

module.exports = router;