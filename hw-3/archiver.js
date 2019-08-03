const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream');

class Archiver {
    constructor(fileFrom) {
        this.fileFrom = fileFrom;
    }

    async zip() {
        await pipeline(
            fs.createReadStream(this.fileFrom),
            zlib.createGzip(),
            fs.createWriteStream(this.fileFrom + '.gz'),
            err => {
                if (err) {
                    console.error(
                        `Archeiving '${this.fileFrom}' failed: `,
                        err
                    );
                } else {
                    console.log(`File ${this.fileFrom} has been archeived`);
                }
            }
        );
    }

    async unzip() {
        await pipeline(
            fs.createReadStream(this.fileFrom),
            zlib.createGunzip(),
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
