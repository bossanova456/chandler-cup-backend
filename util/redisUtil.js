const { createClient } = require('redis');

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
	getKeys
}