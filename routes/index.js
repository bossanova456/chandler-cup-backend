const express = require('express');
const { getTeamById, getMatchupData, writeMatchupData, getUsers, addUser } = require('../redis');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.sendStatus(418);
});

router.get('/:teamId', function(req, res) {
  getTeamById(req.params.teamId)
    .then(teamData => {
      res.send(teamData);
    });
});

router.get('/users', function(req, res) {
  getUsers("2022")
    .then(usersData => {
      res.send(usersData);
    });
});

router.post('/addUser/:userName', function(req, res) {
  addUser("2022", req.params.userName)
    .then(() => {
      res.send("User added: " + req.params.userName);
    });
});

module.exports = router;
