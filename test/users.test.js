const { expect, test } =  require('@jest/globals');
const redisMock = require('redis-mock');

const { getUsers, addUser } = require('../src/redis');

const { getKeys, executeQuery } = require('../util/redisUtil');
jest.mock('../util/redisUtil');

describe('Users', () => {
	let usersData;
	const mockClient = redisMock.createClient();

	executeQuery.mockImplementation(async (fxn, client = null) => {
		return fxn(client);
	}, mockClient);

	getKeys.mockImplementation(async (keyPattern, client) => {
		return Promise.resolve(Object.keys(usersData));
	});

	beforeEach(() => {
		mockClient.json = {
			get: async (key) => {
				return Promise.resolve(usersData[key]);
			},
			set: async (key, path, data) => {
				usersData[key] = data;
				return Promise.resolve(usersData);
			}
		};

		usersData = {
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

	test('Should return list of users', async () => {
		const pickData = await getPickData('2022', '01', '0102', 'sharon', mockClient);

		expect(pickData).not.toBeNull();
		expect(pickData).not.toBeUndefined();
		expect(pickData).toEqual({
			"pick": "underdog",
			"last_upd_ts": "01-01-1970 01:00:00.000"
		});
	})

	test('Should add new user', async () => {
		// Pick data for this matchup doesn't exist, so it should throw an exception
		expect(await getPickData('2022', '01', '0708', 'sharon', mockClient)).toBeUndefined();

		const writeData = {
			"pick": "underdog",
			"last_upd_ts": "01-01-1970 01:00:00.000"
		};

		await writePickData('2022', '01', 'sharon', '0708', writeData, mockClient);

		const picks = await getPickData('2022', '01', '0708', 'sharon', mockClient);

		expect(picks).not.toBeNull();
		expect(picks).not.toBeUndefined();
		expect(picks).toEqual(writeData);
	})
});