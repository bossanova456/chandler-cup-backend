const { writePickData } = require('../src/redis');
const { picksData } = require('../src/data/PickData');

(async () => {
	console.log(JSON.stringify(picksData));

	Object.keys(picksData).map(year => {
		console.log("Year: " + year);

		Object.keys(picksData[year]).map(user => {
			console.log("User: " + user);

			Object.keys(picksData[year][user]).map(week => {
				console.log("Week: " + week);

				Object.keys(picksData[year][user][week]).map(matchup => {
					console.log("Matchup: " + matchup);
					console.log("Data: " + JSON.stringify(picksData[year][user][week][matchup]));
					
					writePickData(year, week, matchup, user, picksData[year][user][week][matchup]);

					console.log("======================");
				})
			});
		});
	});
})();