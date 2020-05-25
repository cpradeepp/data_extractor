const {readdirSync, lstatSync} = require('fs');
const xml2js = require('xml2js');
const {join} = require('path');

/**
 * Utility function useful to handle the error when using async and await
 * @param promise
 * @returns {Promise.<T>}
 */
const asyncAwait = (promise) => {
	return promise.then(data=>{
		return [null, data];
	}).catch(err=>{
		return [err];
	});
};

/**
 * Helper function which will return true if the source is directory, false otherwise
 * @param source
 */
const isDirectory = source => lstatSync(source).isDirectory();

/**
 * Utility function which will get a source and return all the folders inside it
 * @param source -> ./source
 * @returns {Array.<T>} -> ['1', '2', '3']
 */
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory);

const getRdfFile = source => {
	return readdirSync(source);
};

/**
 * Recursive function that will go through the array and the object simultaneously to dereference the path
 * @param pathArray -> ['rdf:RDF', 'pgterms:ebook', '0']
 * @param data -> Parsed RDF object
 * @param returnsArray -> true if the the value will be an object
 * @param replaceText -> Text to be replaced in the final value
 * @returns {*}
 */
const dereferencePath = (pathArray, data, returnsArray = false, replaceText) => {
	try {
		let returnArray = [];
		if(returnsArray) {
			const key = pathArray.shift();
			if(key === '_ARRAY_') {
				data.forEach(oneObj => {
					const nestedPathArray = JSON.parse(JSON.stringify(pathArray));
					const nestedKey = nestedPathArray.shift();
					returnArray.push(dereferencePath(nestedPathArray, oneObj[nestedKey]));
				});
				return returnArray;
			}
			return dereferencePath(pathArray, data[key], returnsArray);
		} else if (pathArray && pathArray.length > 1) {
			const key = pathArray.shift();
			return dereferencePath(pathArray, data[key], false, replaceText);
		}

		if(replaceText) {
			return data[pathArray[0]].replace('ebooks/', '');
		}

		return data[pathArray[0]];
	} catch (e) {
		return null
	}
};

module.exports = {
	asyncAwait,
	dereferencePath,
	getDirectories,
	getRdfFile
};