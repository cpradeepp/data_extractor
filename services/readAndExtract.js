const colors = require('colors');
const {asyncAwait, getDirectories, getRdfFile} = require('./../tools/utils');
const {createRecord} = require('./../services/modelService');
const {getDataFromFile} = require('./../services/extractor');

const startExtraction = async (source) => {
	try {
		const directories = getDirectories(source);
		console.log(`Total available folders: ${directories.length}`.brightGreen);

		for(let i=0; i<directories.length; i++) {
			const fileName = getRdfFile(directories[i]);
			const fileSource = `${directories[i]}/${fileName}`;
			console.log(`♦♦♦`.brightBlue + `Reading data from ${fileSource}` + `♦♦♦`.brightBlue);
			const [getDataErr,fileData] = await asyncAwait(getDataFromFile(fileSource));

			if (getDataErr) {
				throw getDataErr;
			}

			const [createRecordErr, createRecordSucc] = await asyncAwait(createRecord(fileData));

			if (createRecordErr) {
				throw createRecordErr;
			}

			console.log(`✔ `.brightGreen + `Data saved successfully!`);
		}

		return 'extraction successful';
	} catch(e) {
		throw new Error(e);
	}
};

module.exports = {
	startExtraction
};