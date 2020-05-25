const mongoose = require("mongoose");
const {DB_HOST, DB_PORT, DB_COLLECTION} = require('./constants')

const primaryDb = mongoose.createConnection(`mongodb://${DB_HOST}:${DB_PORT}/${DB_COLLECTION}`, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});

module.exports = {
	primaryDb
};