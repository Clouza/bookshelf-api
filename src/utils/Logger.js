import fs from 'fs';

const enableLog = true;
const nbsp = ' ';

const logger = (type, msg) => {
    if (!enableLog) return;

    try {
        const date = new Date().toISOString().slice(0, 10); // 2024-01-14
        const fileName = `log-${date}.log`; // log-2024-01-14.log
        const log = `[${date} ${new Date().toLocaleTimeString().replace(new RegExp(nbsp, 'g'), ' ')}] [${type.toUpperCase()}] ${msg}\n`; // [2024-01-14] INFO message here

        fs.appendFile(`src/logs/${fileName}`, log, (err) => {
            if (err) {
                console.error(`Gagal menambahkan file log: ${err}`);
            }
        });
    } catch (err) {
        console.error(`logs gagal: ${err}`);
    }
};

const log = {
    info: (message) => logger('info', message),
    warn: (message) => logger('warn', message),
    error: (message) => logger('error', message)
};

export default log;
