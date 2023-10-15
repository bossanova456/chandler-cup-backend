const { executeQuery } = require('../util/redisUtil');

const getScoresForPlayer = (playerId) => {
    return executeQuery(client => {
        return client.json.get('playerScores:' + playerId);
    });
}

module.exports = {
    getScoresForPlayer
}