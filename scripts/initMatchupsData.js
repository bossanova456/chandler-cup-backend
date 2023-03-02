const { matchupData } = require('../data/MatchupData');
const { writeMatchupData } = require('../redis');

(async () => {
	Object.keys(matchupData).map(weekNum => {
		writeMatchupData(2022, weekNum, matchupData[weekNum])
	});
})();