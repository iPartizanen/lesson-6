const path = require('path');
const Json2csv = require('../hw-2/json2csv');
const Archiver = require('./archiver');

const fileName = '../data/comments';

new Json2csv(path.join(__dirname, fileName + '.json'), [
    'email',
    'name',
    'id',
]).transform();

new Archiver(fileName + '.csv', { algorithm: 'deflate' }).zip();

setTimeout(
    () => new Archiver(fileName + '.csv.gz', { algorithm: 'deflate' }).unzip(),
    1000
);
