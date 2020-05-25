const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const primaryDb = require("../settings/db").primaryDb;

const book = Schema({
	id: {
		type: Number,
		unique: true,
		index: true,
		required: true
	},
	title: {
		type: String,
		index: true
	},
	authors: {
		type: Array,
		index: true
	},
	publisher: {
		type: String
	},
	publication_date: {
		type: Date,
		index: true
	},
	language: {
		type: String
	},
	subjects: {
		type: Array
	},
	license_rights: {
		type: String
	}
});

module.exports = primaryDb.model('book', book);
