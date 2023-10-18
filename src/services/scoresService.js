const { getKeys, executeQueryGlobalClient } = require('../../util/redisUtil');

const getScoresForPlayer = async (playerId, seasonYear, client = null) => {
    // TODO: Use player IDs instead of names
    const pickKeys = await getKeys('seasonYear:' + seasonYear + ':week:*:matchup:*:user:' + playerId + ':pick', client);

    const picks = {};
    const matchups = {};
    pickKeys.map(key => {
        picks[key.split(':')[3]] = {};
        matchups[key.split(':')[3]] = {};
    });

    await Promise.all(
        [
            ...pickKeys.map(key => {
                const weekNum = key.split(':')[3];
                const matchupId = key.split(':')[5];
                return executeQueryGlobalClient(client => client.json.get(key).then(data => {
                    picks[weekNum][matchupId] = data;
                }));
            }),
            ...Object.keys(matchups).map(async weekNum => {
                return executeQueryGlobalClient(client => client.json.get('seasonYear:' + seasonYear + ':week:' + weekNum + ':matchup')).then(data => {
                    matchups[weekNum] = data;
                })
            })
        ]
    );

    let score = 0;

    Object.keys(picks).map(weekNum => {
        Object.keys(picks[weekNum]).map(matchupId => {
            const pickData = picks[weekNum][matchupId];
            const matchupData = matchups[weekNum][matchupId];
            const line = parseFloat(matchupData.line);
            const favoredScore = parseInt(matchupData.favoredScore);
            const underdogScore = parseInt(matchupData.underdogScore);

            if (pickData.pick === "favored" && favoredScore - underdogScore > line ||
                    pickData.pick === "underdog" && favoredScore - underdogScore <= line)
                score++;
        });
    });

    return Promise.resolve("" + score);
}

module.exports = {
    getScoresForPlayer
}