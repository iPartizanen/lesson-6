const fs = require('fs');
const path = require('path');

let currentFiles = [];
const filesDirName = path.join(__dirname, 'files');
const bundleFileName = path.join(__dirname, 'build', 'bundle.js');

const bundleAppend = async fileName => {
    await fs.readFile(path.join(filesDirName, fileName), (err, data) => {
        if (err) {
            console.error(err.message);
            return;
        }
        fs.appendFile(bundleFileName, data, err => {
            if (err) {
                console.error(err.message);
                return;
            }
        });
    });
};

const bundleRebuild = async () => {
    await fs.exists(bundleFileName, exists => {
        if (exists) {
            fs.unlink(bundleFileName, err => {
                if (err) {
                    console.error(err.message);
                    return;
                }
            });
        }
    });
    console.log('Rebuilding bundle: ', bundleFileName);
    await fs.writeFile(bundleFileName, '', err => {
        if (err) {
            console.error(err);
            return;
        }
    });

    currentFiles.forEach(fileName => bundleAppend(fileName));
    console.log('Current bundle: ', currentFiles);
};

const allFiles = fs.readdirSync(filesDirName);
allFiles.forEach(fileName => {
    if (fileName.substring(fileName.length - 3) === '.js') {
        currentFiles.push(fileName);
    }
});
bundleRebuild();

const watcher = fs
    .watch(filesDirName, async (eventType, fileName) => {
        if (fileName.substring(fileName.length - 3) === '.js') {
            if (eventType === 'rename') {
                const index = currentFiles.indexOf(fileName);

                if (index >= 0) {
                    currentFiles.splice(index, 1);
                    console.log(`${fileName} was removed`);
                    await bundleRebuild();
                    return;
                }

                currentFiles.push(fileName);
                console.log(`${fileName} was added, append to bundle!`);
                await bundleAppend(fileName);
                return;
            } else if (eventType === 'change') {
                console.log(`${fileName} was changed, rebuild bundle!`);
                await bundleRebuild();
                return;
            }
        }
    })
    .on('close', () => console.log('Watcher closed!'));

setTimeout(() => {
    watcher.close();
}, 10000);
