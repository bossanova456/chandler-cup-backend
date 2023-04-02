const { teamData } = require('../src/data/TeamData');
const { writeTeamData } = require('../src/redis');

(async () => {
	Object.keys(teamData).map(teamId => {
		writeTeamData(teamId, teamData[teamId]);
	});
})();