const booksModel = require('./../models/books');
const {asyncAwait} = require('./../tools/utils');

const createRecord = async (data) => {
	const newRecord = new booksModel(data);

	const [saveErr, saveSuccess] = await asyncAwait(newRecord.save());

	if(saveErr) {
		return Promise.reject(saveErr);
	}

	return 'success';
};

const deleteData = async (id) => {
	if(!id) {
		throw new Error('Invalid id');
	}

	return await asyncAwait(booksModel.deleteOne({id}));
};

module.exports = {
	createRecord,
	deleteData
};