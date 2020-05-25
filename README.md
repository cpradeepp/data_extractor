# Data Extractor
A simple app built on node.js to extract data from RDF files and store them in the database.
The app assumes there is only one RDF file per folder and one book per file.

## Tech stack
- node.js > v8.10.0
- MongoDB Community Edition 4.2

## Installation
Please refer the below link to install MongoDB and start the service

https://docs.mongodb.com/manual/administration/install-community/

https://docs.mongodb.com/manual/mongo/#start-the-mongo-shell-and-connect-to-mongodb

```
clone repo
npm install
```

### To run test
```
npm run test
npm run coverage (for a report)
```

### Source files
Create a directory named **source** and dump all the extracted content from the zip.

### To start the server
```
npm start
```

On starting the server the command line asks the question **Do you want to begin the extraction process now(y or n)?**
Press y or yes to start the extraction process.
