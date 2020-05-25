const {readdirSync, lstatSync} = require('fs');
const {join} = require('path');

const asyncAwait = (promise) => {
	return promise.then(data=>{
		return [null, data];
	}).catch(err=>{
		return [err];
	});
};

const isDirectory = source => lstatSync(source).isDirectory();

const getDirectories = source => {
	return readdirSync(source).map(name => join(source, name)).filter(isDirectory)
};

const getRdfFile = source => {
	return readdirSync(source);
};

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