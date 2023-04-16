const { executeQuery, getKeys } = require('../util/redisUtil');

const getCurrentSeason = async () => {
	return executeQuery(client => {
		return client.json.get('currentSeason');
	});
}

const getSchedule = async (year) => {
	return executeQuery(client => {
		return client.json.get('seasonYear:' + year + ':schedule');
	});
}

/////////////////////
// Teams
/////////////////////

const getTeams = async (client = null) => {
	const keys = await getKeys('teams:*', client);

	return executeQuery(client => {
		const teams = {};
		keys.map(key => {
			const teamId = key.split(':')[1];
			client.json.get(key)
				.then(team => {
					teams[teamId] = team;
					teams[teamId].teamId = teamId;
				});
		});

		return teams;
	}, client);
}

const getTeamById = async (teamId) => {
	return executeQuery(client => {
		return client.json.get('teams:' + (teamId.length < 2 ? '0' + teamId : teamId));
	});
}

const writeTeamData = async (teamId, teamData) => {
	await executeQuery(client => {
		client.json.set('teams:' + teamId, '$', teamData);
	});
}

/////////////////////
// Matchups
/////////////////////

const writeMatchupData = async (seasonYear, weekNum, matchupData, client = null) => {
	await executeQuery(client => {
		return client.json.set('seasonYear:' + seasonYear + ":week:" + weekNum + ':matchup', '$', matchupData);
	}, client);
}

const writeMatchupDataByWeekAndId = async (seasonYear, weekNum, matchupId, matchupData, client = null) => {
	await executeQuery(client => {
		return client.json.set('seasonYear:' + seasonYear + ':week:' + weekNum + ':matchup', '$.' + matchupId, matchupData)
	}, client)
}

const getMatchupsByWeek = async (seasonYear, weekNum, client = null) => {
	return executeQuery(client => {
		return client.json.get('seasonYear:' + seasonYear + ':week:' + (weekNum.length < 2 ? '0' + weekNum : weekNum) + ':matchup');
	}, client);
}

const getMatchupWeeks = async (seasonYear, client = null) => {
	const keys = await getKeys('seasonYear:' + seasonYear + ':week:*:matchup', client);
	return keys.map(key => key.split(':')[3]);
}

const addNewWeek = async(seasonYear, newWeek, client = null) => {
	await executeQuery(client => {
		return client.json.set('seasonYear:' + seasonYear + ':week:' + newWeek + ':matchup', '$', {});
	}, client);
}

/////////////////////
// Users
/////////////////////

const getUsers = async (seasonYear) => {
	return executeQuery(client => {
		return client.json.get('users', {
			path: '$.' + seasonYear
		});
	});
}

const addUser = async (seasonYear, userName) => {
	const users = (await getUsers(seasonYear))[0];

	return executeQuery(client => {
		// Check if user already exists
		if (users.filter(user => user.name === userName.name).length !== 0) {
			return "User " + userName + " already exists";
		}

		return client.json.arrAppend('users', '$.' + seasonYear, userName);
	});
}

/////////////////////
// Picks
/////////////////////

const getPickData = async (seasonYear, week, matchup, user) => {
	return executeQuery(client => {
		return client.json.get('seasonYear:' + seasonYear + ':week:' + week + ':matchup:' + matchup + ':user:' + user + ':pick');
	})
}

const writePickData = async (seasonYear, week, user, matchup, pick) => {
	return executeQuery(client => {
		return client.json.set('seasonYear:' + seasonYear + ':week:' + week + ':matchup:' + matchup + ':user:' + user + ':pick', '$', pick);
	});
}

const getPicksByKeyPattern = async(keyPattern) => {
	const keys = await getKeys(keyPattern);
	
	return executeQuery(client => {
		const picks = {};
		keys.map(key => {
			const user = key.split(':')[7];
			const matchup = key.split(':')[5];
			if (!picks[user]) picks[user] = {};
			client.json.get(key)
				.then(pick => {
					picks[user][matchup] = pick;
				});
		});

		return picks;
	});
}

const getPicksByMatchup = async (seasonYear, week, matchup) => {
	return getPicksByKeyPattern('seasonYear:' + seasonYear + ':week:' + week + ':matchup:' + matchup + ':user:*:pick');
}

const getPicksByYearAndWeek = async (seasonYear, week) => {
	return getPicksByKeyPattern('seasonYear:' + seasonYear + ':week:' + week + ':matchup:*:user:*:pick');
}

module.exports = {
	executeQuery,
	getCurrentSeason,
	getSchedule,
	getTeams,
	getTeamById,
	writeTeamData,
	getMatchupsByWeek,
	getMatchupWeeks,
	addNewWeek,
	writeMatchupData,
	writeMatchupDataByWeekAndId,
	addUser,
	getUsers,
	writePickData,
	getPickData,
	getPicksByMatchup,
	getPicksByYearAndWeek
}