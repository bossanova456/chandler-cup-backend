const { createClient } = require('redis');

const executeQuery = async (fxn) => {
	const client = createClient({
		url: 'redis://default:@192.168.1.50:6379'
	});

	client.on('error', err => console.log('Redis client error', err));

	await client.connect();
	const ret = await fxn(client);
	await client.quit();

	return ret;
}

const createIndex = async (key, schema) => {
	return executeQuery(client => {
		try {
			return client.ft.create('idx:' + key, schema)
		} catch(e) {
			if (e.message === 'Index already exists') {
				console.log('Index exists already, skipped creation.');
			} else {
				console.error(e);
			}
		}
	});
}

const getKeys = async (keyPattern) => {
	return executeQuery(client => {
		return client.keys(keyPattern);
	});
}

const getCurrentSeasonYear = async () => {
	return executeQuery(client => {
		return client.get('seasonYear');
	});
}

// const getTeams = async () => {
// 	return executeQuery(client => {
// 		return client.json.get()
// 	})
// }

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

// const addNewWeek = async() => {
// 	await executeQuery(client => {
// 		const totalWeeks = client.keys()
// 	})
// }

const writeMatchupData = async (seasonYear, weekNum, matchupData) => {
	await executeQuery(client => {
		return client.json.set('seasonYear:' + seasonYear + ":week:" + weekNum + ':matchup', '$', matchupData);
	});
}

const getMatchupsByWeek = async (weekNum) => {
	const seasonYear = await getCurrentSeasonYear();

	return executeQuery(client => {
		return client.json.get('seasonYear:' + seasonYear + ':week:' + (weekNum.length < 2 ? '0' + weekNum : weekNum) + ':matchup');
	});
}

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

const getPickData = async (seasonYear, week, matchup, user) => {
	return executeQuery(client => {
		return client.json.get('seasonYear:' + seasonYear + ':week:' + week + ':matchup:' + matchup + ':user:' + user + ':pick');
	})
}

const getPicksByMatchup = async (seasonYear, week, matchup) => {
	const keys = await getKeys('seasonYear:' + seasonYear + ':week:' + week + ':matchup:' + matchup + ':user:*:pick');

	return executeQuery(client => {
		const picks = {};
		keys.map(key => {
			const user = key.split(':')[7];
			client.json.get(key)
				.then(pick => {
					picks[user] = pick;
				});
		});

		return picks;
	});
}

const writePickData = async (seasonYear, week, matchup, user, pick) => {
	return executeQuery(client => {
		return client.json.set('seasonYear:' + seasonYear + ':week:' + week + ':matchup:' + matchup + ':user:' + user + ':pick', '$', pick);
	});
}

module.exports = {
	getCurrentSeasonYear,
	getTeamById,
	writeTeamData,
	getMatchupsByWeek,
	writeMatchupData,
	addUser,
	getUsers,
	writePickData,
	getPickData,
	getPicksByMatchup
}