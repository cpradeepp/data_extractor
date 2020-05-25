const express = require('express');
const app = express();
const readline = require('readline');
const colors = require('colors');
const {APP_PORT} = require('./settings/constants');
const db = require('./settings/db');
const {startExtraction} = require('./services/readAndExtract');

// Creating the database connection
app.use(() => {
	db.primaryDb();
});

// Creating commandline interface
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

app.listen(APP_PORT, async () => {
	console.log(`Server running on http://localhost:${APP_PORT}`.brightGreen);

	// Expects y or yes to start the extraction process
	rl.question('Do you want to begin the extraction process now(y or n)?', async (answer) => {
		const a = answer.toLowerCase();

		if(a === 'y' || a === 'yes') {
			console.log(`Beginning extraction process`.brightBlue);
			await startExtraction('./source');
			console.log('Data extract successful and stored in the database!!!'.brightGreen);
		} else {
			console.log(`Please try again later. Thanks!`.brightRed);
			rl.close();
		}
	});
});