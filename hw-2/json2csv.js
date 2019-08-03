const fs = require('fs').promises;
const path = require('path');

class Json2csv {
    constructor(fileFrom, fields = [], fileTo = '', delimiter = ';') {
        this._fileFrom = fileFrom;
        this._fields = fields;
        if (fileTo) {
            this._fileTo = fileTo;
        } else {
            this._fileTo = path.join(
                path.dirname(fileFrom),
                path.basename(fileFrom, path.extname(fileFrom)) + '.csv'
            );
        }
        this._delimiter = delimiter;
        this._jsonData = [];
        this._csvData = '';
    }

    csvQuotedValue(str) {
        return (
            '"' +
            str
                .toString()
                .replace(new RegExp('"', 'g'), '""')
                .replace(new RegExp('\n', 'g'), '\\n') +
            '"'
        );
    }

    _convert() {
        if (this._jsonData.length == 0) {
            console.error(`File ${this._fileFrom} is empty!`);
        } else {
            let csvKeys = [];
            if (!this._fields.length) {
                const firstLine = this._jsonData[0];

                for (let key in firstLine) {
                    csvKeys.push(key);
                }
            } else {
                csvKeys = this._fields.slice();
            }

            this._csvData = csvKeys.join(this._delimiter) + '\n';

            this._jsonData.forEach(line => {
                let s = this.csvQuotedValue(line[csvKeys[0]]);
                for (let i = 1; i < csvKeys.length; i++) {
                    s +=
                        this._delimiter + this.csvQuotedValue(line[csvKeys[i]]);
                }
                this._csvData += s + '\n';
            });
        }
    }

    async transform() {
        await fs
            .readFile(this._fileFrom, {
                encoding: 'utf-8',
            })
            .then(data => {
                this._jsonData = JSON.parse(data);
            })
            .catch(error => {
                console.log(error);
            });
        await this._convert();
        await fs
            .writeFile(this._fileTo, this._csvData, {
                encoding: 'utf-8',
            })
            .catch(error => {
                console.log(error);
            });
    }
}

module.exports = Json2csv;
