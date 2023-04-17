const { expect, test } =  require('@jest/globals');
const redisMock = require('redis-mock');

const { getPicksByMatchup, getPicksByYearAndWeek, getPickData, writePickData } = require('../src/redis');

const { getKeys, executeQuery } = require('../util/redisUtil');
jest.mock('../util/redisUtil');

describe('Pick data tests', () => {
	let pickData, matchupData;
	const mockClient = redisMock.createClient();

	executeQuery.mockImplementation(async (fxn, client = null) => {
		return fxn(client);
	}, mockClient);

	getKeys.mockImplementation(async (keyPattern, client) => {
		return Promise.resolve(Object.keys(pickData));
	});

	beforeEach(() => {
		mockClient.json = {
			get: async (key) => {
				return Promise.resolve(pickData[key]);
			}
		};

		pickData = {
			"seasonYear:2022:week:01:matchup:0102:user:sharon:pick" : {
				"pick": "underdog",
				"last_upd_ts": "01-01-1970 01:00:00.000"
			},
			"seasonYear:2022:week:01:matchup:0304:user:sharon:pick": {
				"pick": "underdog",
				"last_upd_ts": "01-01-1970 01:00:00.000"
			},
			"seasonYear:2022:week:01:matchup:0506:user:sharon:pick": {
				"pick": "favored",
				"last_upd_ts": "01-01-1970 01:00:00.000"
			}
		};
	});

	test('Should return pick data for a given user, year, week, and matchup', async () => {
		const pickData = await getPickData('2022', '01', '0102', 'sharon', mockClient);

		expect(pickData).not.toBeNull();
		expect(pickData).not.toBeUndefined();
		expect(pickData).toEqual({
			"pick": "underdog",
			"last_upd_ts": "01-01-1970 01:00:00.000"
		});
	})

	test('Should return pick data for a given year and week', async () => {
		const picks = await getPicksByYearAndWeek('2022', '01', mockClient);

		expect(picks).not.toBeNull();
		expect(picks).not.toBeUndefined();
		expect(picks).toEqual({
			"sharon": {
				"0102" : {
					"pick": "underdog",
					"last_upd_ts": "01-01-1970 01:00:00.000"
				},
				"0304": {
					"pick": "underdog",
					"last_upd_ts": "01-01-1970 01:00:00.000"
				},
				"0506": {
					"pick": "favored",
					"last_upd_ts": "01-01-1970 01:00:00.000"
				}
			}
		});
	})

	test('Should return pick data for all users for a given year, week, and matchup', async () => {
		const picks = await getPicksByMatchup('2022', '01', '0102', mockClient);

		expect(picks).not.toBeNull();
		expect(picks).not.toBeUndefined();
		expect(picks).toEqual({
			"sharon": {
				"0102" : {
					"pick": "underdog",
					"last_upd_ts": "01-01-1970 01:00:00.000"
				},
				"0304": {
					"pick": "underdog",
					"last_upd_ts": "01-01-1970 01:00:00.000"
				},
				"0506": {
					"pick": "favored",
					"last_upd_ts": "01-01-1970 01:00:00.000"
				}
			}
		})
	})

	// test('Should write new pick data', async () => {
	// 	mockClient.json.set = async (key, path, data) => {
	// 		pickData[key] = data;
	// 		return Promise.resolve(pickData);
	// 	};

	// 	// Pick data for this matchup doesn't exist, so it should throw an exception
	// 	await expect(async () => await getPickData('2022', '01', '0708', mockClient)).rejects.toThrow(TypeError);

	// 	await writePickData('2022', '01', 'sharon', '0708', {
	// 		"pick": "underdog",
	// 		"last_upd_ts": "01-01-1970 01:00:00.000"
	// 	}, mockClient);

	// 	const picks = await getPickData('2022', '01', '0708', mockClient);

	// 	expect(picks).not.toBeNull();
	// 	expect(picks).not.toBeUndefined();
	// 	expect(picks['sharon']['0708']).not.toBeNull();
	// })
});