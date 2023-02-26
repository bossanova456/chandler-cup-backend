const { teamData } = require('../data/TeamData');
const { writeTeamData } = require('../redis');

(async () => {
	Object.keys(teamData).map(teamId => {
		writeTeamData(teamId, teamData[teamId]);
	});
})();