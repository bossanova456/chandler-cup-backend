const express = require('express');
const { getScoresForPlayer } = require('../services/scoresService');
const router = express.Router();

router.get('/year/:year/player/:playerId', function(req, res) {
    getScoresForPlayer(req.params.playerId, req.params.year)
        .then(scores => {
            if (scores) res.send(scores);
            else res.sendStatus(404);
        });
    }
);

module.exports = router;