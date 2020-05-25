const APP_PORT = 3001;
const DB_HOST = 'localhost';
const DB_PORT = 27017;
const DB_COLLECTION = 'bibliu';
const ROOT = 'rdf:RDF>>pgterms:ebook>>0>>';
const DATA_PATH = [
	{
		name: 'id',
		path: `${ROOT}$>>rdf:about`,
		replaceText: 'ebooks/'
	},
	{
		name: 'title',
		path: `${ROOT}dcterms:title>>0`
	},
	{
		name: 'authors',
		path: `${ROOT}dcterms:creator>>0>>pgterms:agent>>_ARRAY_>>pgterms:name>>0`,
		returnsArray: true
	},
	{
		name: 'publisher',
		path: `${ROOT}dcterms:publisher>>0`
	},
	{
		name: 'publication_date',
		path: `${ROOT}dcterms:issued>>0>>_`
	},
	{
		name: 'language',
		path: `${ROOT}dcterms:language>>0>>rdf:Description>>0>>rdf:value>>0>>_`
	},
	{
		name: 'subjects',
		path: `${ROOT}dcterms:subject>>_ARRAY_>>rdf:Description>>0>>rdf:value>>0`,
		returnsArray: true
	},
	{
		name: 'license_rights',
		path: `${ROOT}dcterms:rights>>0`
	},
];

module.exports = {
	DB_HOST,
	DB_PORT,
	DB_COLLECTION,
	DATA_PATH,
	APP_PORT
};