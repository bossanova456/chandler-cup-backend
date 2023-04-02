const { matchupData } = require('../src/data/MatchupData');
const { writeMatchupData } = require('../src/redis');

(async () => {
	Object.keys(matchupData).map(weekNum => {
		writeMatchupData(2022, weekNum, matchupData[weekNum])
	});
})();