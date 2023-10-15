const { expect, test } =  require('@jest/globals');
const redisMock = require('redis-mock');

const { getMatchupsByWeek, getMatchupWeeks, writeMatchupData, addNewWeek } = require('../src/redis');

const { getKeys, executeQuery } = require('../util/redisUtil');
jest.mock('../util/redisUtil');

describe('Matchup data tests', () => {
	let matchupData;
	const mockClient = redisMock.createClient();

	executeQuery.mockImplementation(async (fxn, client = null) => {
		return fxn(client);
	}, mockClient);

	getKeys.mockImplementation(async (keyPattern, client) => {
		return Promise.resolve(Object.keys(matchupData));
	});

	beforeEach(() => {
		mockClient.json = {
			get: async (key) => {
				return Promise.resolve(matchupData[key]);
			}
		};

		matchupData = {
			"seasonYear:2022:week:01:matchup" : {
				"0102": {
				  "favoredTeamId": "01",
				  "underdogTeamId": "02",
				  "line": 3,
				  "game_start_ts": "01/01/2022 00:00:00",
				  "favoredScore": "4",
				  "underdogScore": "4",
				  "isFinal": false
				},
				"0304": {
				  "favoredTeamId": "03",
				  "underdogTeamId": "04",
				  "line": 3,
				  "game_start_ts": "01/01/2022 00:00:00",
				  "favoredScore": 0,
				  "underdogScore": 0,
				  "isFinal": false
				}
			},
			"seasonYear:2022:week:02:matchup": {
				"0304": {
				  "favoredTeamId": "03",
				  "underdogTeamId": "04",
				  "line": 3,
				  "game_start_ts": "01/02/2022 16:20:00",
				  "favoredScore": "4",
				  "underdogScore": "0",
				  "isFinal": false
				}
			}
		};
	});

	test('Should return JSON matchup data for a given year & week', async () => {
		const matchups1 = await getMatchupsByWeek('2022', '01', mockClient);

		expect(matchups1).not.toBeNull();
		expect(matchups1).not.toBeUndefined();
		expect(matchups1).toEqual({
			"0102": {
			  "favoredTeamId": "01",
			  "underdogTeamId": "02",
			  "line": 3,
			  "game_start_ts": "01/01/2022 00:00:00",
			  "favoredScore": "4",
			  "underdogScore": "4",
			  "isFinal": false
			},
			"0304": {
			  "favoredTeamId": "03",
			  "underdogTeamId": "04",
			  "line": 3,
			  "game_start_ts": "01/01/2022 00:00:00",
			  "favoredScore": 0,
			  "underdogScore": 0,
			  "isFinal": false
			}
		})

		const matchups2 = await getMatchupsByWeek('2022', '02', mockClient);

		expect(matchups2).not.toBeNull();
		expect(matchups2).not.toBeUndefined();
		expect(matchups2).toEqual({
			"0304": {
				"favoredTeamId": "03",
				"underdogTeamId": "04",
				"line": 3,
				"game_start_ts": "01/02/2022 16:20:00",
				"favoredScore": "4",
				"underdogScore": "0",
				"isFinal": false
			}
		})
	})

	test('Should return list of weeks with saved matchups', async () => {
		const matchupWeeks = await getMatchupWeeks('2022', mockClient);

		expect(matchupWeeks).not.toBeNull();
		expect(matchupWeeks).not.toBeUndefined();
		expect(matchupWeeks).toEqual(["01", "02"])
	})

	test('Should write new matchup data', async () => {
		mockClient.json.set = async (key, path, data) => {
			matchupData[key] = data;
			return Promise.resolve(matchupData);
		};

		// Test initial data
		const initData = { ...matchupData["seasonYear:2022:week:02:matchup"] };
		const newData = {
			"0506": {
				"favoredTeamId": "05",
				"underdogTeamId": "06",
				"line": 3,
				"game_start_ts": "01/01/2022 00:00:00",
				"favoredScore": 0,
				"underdogScore": 0,
				"isFinal": false
			}
		};

		let matchups = await getMatchupsByWeek('2022', '02', mockClient);
		expect(matchups).not.toBeNull();
		expect(matchups).not.toBeUndefined();
		expect(matchups).toEqual(initData);

		// Write data for week 3
		await writeMatchupData('2022', '02', newData, mockClient);

		matchups = await getMatchupsByWeek('2022', '02', mockClient);
		expect(matchups).not.toBeNull();
		expect(matchups).not.toBeUndefined();
		expect(matchups).not.toEqual(initData);
		expect(matchups["0506"]).toEqual(newData["0506"]);
	});

	test('Should add a new week of empty matchup data', async () => {
		mockClient.json.set = async (key, path, data) => {
			matchupData[key] = data;
			return Promise.resolve(matchupData);
		};

		const initWeeks = await getMatchupWeeks('2022', mockClient);
		expect(initWeeks).not.toBeNull();
		expect(initWeeks).not.toBeUndefined();
		expect(initWeeks).toEqual(['01', '02']);

		await addNewWeek('2022', '03', mockClient);

		const newWeeks = await getMatchupWeeks('2022', mockClient);
		expect(newWeeks).not.toBeNull();
		expect(newWeeks).not.toBeUndefined();
		expect(newWeeks).toEqual(['01', '02', '03']);
	})
})