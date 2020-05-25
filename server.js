const express = require('express');
const app = express();
const readline = require('readline');
const colors = require('colors');
const {APP_PORT} = require('./settings/constants');
const db = require('./settings/db');
const {startExtraction} = require('./services/readAndExtract');

app.use(() => {
	db.primaryDb();
});

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

app.listen(APP_PORT, async () => {
	console.log(`Server running on http://localhost:${APP_PORT}`.brightGreen);
	rl.question('Do you want to begin the extraction process now(y or n)?', function(answer) {
		const a = answer.toLowerCase();

		if(a === 'y' || a === 'yes') {
			console.log(`Beginning extraction process`.brightBlue);
			startExtraction('./source');
		} else {
			console.log(`Please try again later. Thanks!`.brightRed);
			rl.close();
		}
	});
});