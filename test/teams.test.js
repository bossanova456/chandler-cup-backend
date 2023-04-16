const { expect, test } =  require('@jest/globals');
const redisMock = require('redis-mock');

const { getTeams } = require('../src/redis');

const { getKeys, executeQuery } = require('../util/redisUtil');
jest.mock('../util/redisUtil');

describe('Team data tests', () => {

	const mockClient = redisMock.createClient();

	test('Should return JSON object containing team data', async () => {
		mockClient.json = {
			get: async (key) => {
				return Promise.resolve({
					"teams:01": {
						"teamRegion": "Atlanta",
						"teamName": "Falcons",
						"teamRegionCode": "ATL"
					},
					"teams:02": {
						"teamRegion": "Tampa Bay",
						"teamName": "Buccaneers",
						"teamRegionCode": "TB"
					}
				}[key]);
			}
		};

		getKeys.mockImplementation(async (keyPattern, client) => {
			return Promise.resolve(['teams:01', 'teams:02']);
		});

		executeQuery.mockImplementation(async (fxn, client = null) => {
			return fxn(client);
		}, mockClient);

		const teams = await getTeams(mockClient);
		expect(teams).not.toBeNull();
		expect(teams).not.toBeUndefined();
		expect(teams).toEqual({
			"01": {
				"teamId": "01",
				"teamName": "Falcons",
				"teamRegion": "Atlanta",
				"teamRegionCode": "ATL"
			},
			"02": {
				"teamId": "02",
				"teamName": "Buccaneers",
				"teamRegion": "Tampa Bay",
				"teamRegionCode": "TB"
			}
		})
	})
})