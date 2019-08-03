const path = require('path');
const Json2csv = require('./json2csv');

const json2csv = new Json2csv(path.join(__dirname, '/../data/comments.json'));

json2csv.transform();
