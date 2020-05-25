const xml2js = require('xml2js');
const colors = require('colors');
const fs = require('fs');
const {DATA_PATH} = require('./../settings/constants');
const {asyncAwait, dereferencePath} = require('./../tools/utils');

const readFile = async (path) => {
	try {
		return fs.readFileSync(path);
	} catch (e) {
		return Promise.reject('Invalid file path');
	}
};

const parseData = async (data) => {
	const parser = new xml2js.Parser();
	const [parseErr, parsedData] = await asyncAwait(parser.parseStringPromise(data));
	if(parseErr) {
		return Promise.reject('File parse error');
	}

	return parsedData;
};

const getDataFromFile = async (path) => {
	try {
		const [readDataErr, rawData] = await asyncAwait(readFile(path));
		const data = {};

		if(readDataErr) {
			throw readDataErr;
		}

		const [parseErr, parsedData] = await asyncAwait(parseData(rawData));

		if(parseErr) {
			throw parseErr;
		}

		DATA_PATH.forEach(field => {
			const fieldValue = dereferencePath(field.path.split('>>'), parsedData, field.returnsArray, field.replaceText);

			if(!fieldValue) {
				console.log(`✘ `.brightRed + `No value available for ${field.name}`);
			}

			data[field.name] = fieldValue;
		});

		console.log(`✔ `.brightGreen + `Data read successfully!`);
		return data;
	} catch (e) {
		throw new Error(e);
	}
};

module.exports = {
	getDataFromFile,
};