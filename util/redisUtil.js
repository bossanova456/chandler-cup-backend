const { createClient } = require('redis');

let globalClient;

const getClient = async () => {
	if (!globalClient) {
		globalClient = createClient({
			url: 'redis://default:@192.168.1.50:6379'
		});
		
		globalClient.on('error', err => {
			console.log('Redis client error', err);
		});

		await globalClient.connect();
	}

	return globalClient;
}

const executeQueryGlobalClient = async(fxn) => {
	const client = await getClient();
	return await fxn(client);
}

const executeQuery = async (fxn, client = null) => {
	if (!client) {
		client = createClient({
			url: 'redis://default:@192.168.1.50:6379'
		});
	}

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

const getKeys = async (keyPattern, client = null) => {
	return executeQuery(client => {
		return client.keys(keyPattern);
	}, client);
}

module.exports = {
	executeQuery,
	executeQueryGlobalClient,
	getKeys
}