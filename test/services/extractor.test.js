const {assert, expect, should} = require('chai');
const mongoose = require("mongoose");
const colors = require('colors');
const {getDirectories, getRdfFile} = require('./../../tools/utils');
const {DB_HOST, DB_PORT, DB_COLLECTION} = require('./../../settings/constants');
const SOURCE = './test/source';
const {getDataFromFile} = require('./../../services/extractor');
const {createRecord, deleteData} = require('./../../services/modelService');


// Test data to compare
const directoriesInSource = [ 'test/source/1', 'test/source/10', 'test/source/11', 'test/source/12', 'test/source/13', 'test/source/14', 'test/source/2', 'test/source/3', 'test/source/4', 'test/source/5', 'test/source/6', 'test/source/7', 'test/source/8', 'test/source/9' ];
const rdfFilesInSource = ['pg1.rdf'];
const pg1Data = {
	id: '00000',
	title: 'The Declaration of Independence of the United States of America',
	authors: [ 'Jefferson, Thomas' ],
	publisher: 'Project Gutenberg',
	publication_date: '1971-12-01',
	language: 'en',
	subjects: [
		'United States -- History -- Revolution, 1775-1783 -- Sources',
		'JK',
		'E201',
		'United States. Declaration of Independence'
	],
	license_rights: 'Public domain in the USA.'
};
const wrongFilePath = 'test/source/1/pg01.rdf';
const invalidRDFfile = 'test/source/error.rdf';
const createErrorData = {
	title: 'The Declaration of Independence of the United States of America',
	authors: [ 'Jefferson, Thomas' ],
	publisher: 'Project Gutenberg',
	publication_date: '1971-12-01',
	language: 'en',
	subjects: [
		'United States -- History -- Revolution, 1775-1783 -- Sources',
		'JK',
		'E201',
		'United States. Declaration of Independence'
	],
	license_rights: 'Public domain in the USA.'
};

describe('App', () => {
	const directories = getDirectories(SOURCE);
	let dbConn;
	let fileData, getData, createRecordTest, deleteRecordTest;

	before('Promises', function() {
		getData = (path) => getDataFromFile(path);
		createRecordTest = (data) => createRecord(data);
		deleteRecordTest = (id) => deleteData(id)
	});

	after('Delete test records', function() {
		deleteRecordTest(fileData.id);
	});

	describe('Testing getDirectories', () => {
		it('getDirectories should return an array', () => {
			assert.isArray(directories);
		});
		it('getDirectories should return 14 items', () => {
			assert.equal(directories.length, 14);
		});
		it('Does the list match with directories in source?', () =>{
			expect(directories).to.eql(directoriesInSource);
		});
	});

	const sourceRdfFileFolder = directories[0];
	const rdfFilesInFolder = getRdfFile(sourceRdfFileFolder);

	describe('Testing getRdfFile', () => {
		it('getRdfFile should return an array', () => {
			assert.isArray(rdfFilesInFolder);
		});
		it('getRdfFile should return 1 item', () => {
			assert.equal(rdfFilesInFolder.length, 1);
		});
		it('rdf file name should match pg1.rdf', () => {
			expect(rdfFilesInFolder).to.eql(rdfFilesInSource);
		});
	});

	describe('Testing getDataFromFile', () => {
		const fileSource = `${sourceRdfFileFolder}/${rdfFilesInFolder[0]}`;
		it(`Data from ${fileSource} should match the object`, (done) => {
			getData(fileSource)
				.then(result => {
					fileData = result;
					it('getDataFromFile should return and object', () => {
						assert.isObject(fileData);
					});
					it('getDataFromFile should return and object', () => {
						expect(fileData).to.eql(pg1Data);
					});
					done()
				})
				.catch(done);
		});
		it(`Test invalid file path`, (done) => {
			getData(wrongFilePath)
				.catch(e => {
					assert.equal(e.message, 'Invalid file path');
					done();
				});
		});
		it(`Test invalid RDF file`, (done) => {
			getData(invalidRDFfile)
				.catch(e => {
					assert.equal(e.message, 'File parse error');
					done();
				});
		});
	});

	describe('Test DB Connection', () => {
		it('#success', () => {
			dbConn = mongoose.createConnection(`mongodb://${DB_HOST}:${DB_PORT}/${DB_COLLECTION}`, {
				useNewUrlParser: true,
				useUnifiedTopology: true
			});
		});
	});

	describe('Database operations', () => {
		it('Data from the file should be able to save', (done) => {
			createRecordTest(fileData)
				.then(result => {
					done();
				})
				.catch(done);
		});
		it('Test invalid object', (done) => {
			createRecordTest(createErrorData)
				.catch(e => {
					assert.equal(e.message, 'book validation failed: id: Path `id` is required.');
					done();
				});
		});
		it('Delete record fail test', (done) => {
			deleteRecordTest()
				.catch(e => {
					assert.equal(e.message, 'Invalid id');
					done();
				})
		});
	});
});