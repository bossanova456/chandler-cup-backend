const { createClient } = require('redis');

const executeQuery = async (fxn) => {
	const client = createClient({
		url: ''
	});

	client.on('error', err => console.log('Redis client error', err));

	await client.connect();
	const ret = await fxn(client);
	await client.quit();

	return ret;
}

const getCurrentSeasonYear = async () => {
	return executeQuery(client => {
		return client.get('seasonYear');
	});
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

// const addNewWeek = async() => {
// 	await executeQuery(client => {
// 		const totalWeeks = client.keys()
// 	})
// }

const writeMatchupData = async (seasonYear, weekNum, matchupData) => {
	await executeQuery(client => {
		return client.json.set('seasonYear:' + seasonYear + ":week:" + weekNum, '$', matchupData);
	});
}

const getMatchupsByWeek = async (weekNum) => {
	const seasonYear = await getCurrentSeasonYear();

	return executeQuery(client => {
		return client.json.get('seasonYear:' + seasonYear + ':week:' + (weekNum.length < 2 ? '0' + weekNum : weekNum));
	});
}

const setNewPick = async (user, weekNum, pickData) => {
	const currentSeasonYear = await getCurrentSeasonYear();

	executeQuery(client => {
		client.json.set('user:' + user + ':seasonYear:' + currentSeasonYear + ':week:' + weekNum + ':picks:', '$', pickData)
	})
}

const addUser = async (seasonYear, userName) => {
	executeQuery(client => {
		client.json.arrAppend('seasonYear:' + seasonYear + ':users', '$', userName);
	});
}

const getUsers = async (seasonYear) => {
	return executeQuery(client => {
		return client.json.get('seasonYear:' + seasonYear + ':users');
	});
}

module.exports = {
	getCurrentSeasonYear,
	getTeamById,
	writeTeamData,
	getMatchupsByWeek,
	writeMatchupData,
	setNewPick,
	addUser,
	getUsers
}