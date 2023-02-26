const express = require('express');
const router = express.Router();

const { writeMatchupData, getMatchupsByWeek } = require('../redis');

router.get('/:weekNum', function(req, res, next) {
  getMatchupsByWeek(req.params.weekNum)
    .then(matchupData => {
      res.send(matchupData);
    })
});

module.exports = router;