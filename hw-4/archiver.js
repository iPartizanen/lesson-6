const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream');

class Archiver {
    constructor(fileFrom, options = {}) {
        this.fileFrom = fileFrom;
        this.algorithm = this._checkAlgorithm(options);
        this.fileExt = this.algorithm === 'gzip' ? '.gz' : '.zip';
    }

    _checkAlgorithm(options) {
        for (let key in options) {
            if (key !== 'algorithm') {
                throw new Error('Unallowed option: ' + key);
            }
        }

        const { algorithm } = options;

        if (!algorithm) throw new Error('Option "algorithm" is absent!');

        if (algorithm !== 'gzip' && algorithm !== 'deflate') {
            throw new Error(
                `Unallowed Algorithm: ${algorithm}. Must be "gzip" or "deflate"`
            );
        }

        return algorithm;
    }

    async zip() {
        await pipeline(
            fs.createReadStream(this.fileFrom),
            this.algorithm === 'gzip'
                ? zlib.createGzip()
                : zlib.createDeflate(),
            fs.createWriteStream(this.fileFrom + '.gz'),
            err => {
                if (err) {
                    console.error(
                        `Archeiving '${this.fileFrom}' failed: `,
                        err
                    );
                } else {
                    console.log(
                        `File ${this.fileFrom} has been archeived (${
                            this.algorithm
                        })`
                    );
                }
            }
        );
    }

    async unzip() {
        await pipeline(
            fs.createReadStream(this.fileFrom),
            this.algorithm === 'gzip'
                ? zlib.createGunzip()
                : zlib.createInflate(),
            fs.createWriteStream(this.fileFrom + '.unzipped'),
            err => {
                if (err) {
                    console.error(`Unzipping '${this.fileFrom}' failed: `, err);
                } else {
                    console.log(`File ${this.fileFrom} has been unzipped`);
                }
            }
        );
    }
}

module.exports = Archiver;
