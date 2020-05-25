const xml2js = require('xml2js');
const colors = require('colors');
const fs = require('fs');
const {DATA_PATH} = require('./../settings/constants');
const {asyncAwait, dereferencePath} = require('./../tools/utils');

/**
 * Synchronous function to read the file from the path and return an error if invalid path
 * @param path
 * @returns {Promise.<*>}
 */
const readFile = async (path) => {
	try {
		return fs.readFileSync(path);
	} catch (e) {
		return Promise.reject('Invalid file path');
	}
};

/**
 * Function which will take in the data read from RDF file and will parse it
 * @param data
 * @returns {Promise.<*>}
 */
const parseData = async (data) => {
	const parser = new xml2js.Parser();
	const [parseErr, parsedData] = await asyncAwait(parser.parseStringPromise(data));
	if(parseErr) {
		return Promise.reject('File parse error');
	}

	return parsedData;
};

/**
 * Function which will take in a path to the RDF file and returns the extracted data
 * @param path -> './source/1/pg1.rdf'
 * @returns {Promise.<{}>} -> { id: 1, name: '', ....}
 */
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