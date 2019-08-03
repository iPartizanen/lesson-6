const path = require('path');
const Json2csv = require('../hw-2/json2csv');
const Archiver = require('./archiver');

const fileName = '../data/comments';

new Json2csv(path.join(__dirname, fileName + '.json'), [
    'email',
    'name',
    'id',
]).transform();

new Archiver(fileName + '.csv').zip();

setTimeout(() => new Archiver(fileName + '.csv.gz').unzip(), 1000);
