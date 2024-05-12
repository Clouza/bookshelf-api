import fs from 'fs';
import path from 'path';

const logger = (type, msg) => {
    try {
        const date = new Date().toISOString().slice(0, 10); // 2024-01-14
        const fileName = `log-${date}.log`; // log-2024-01-14.log
        const log = `[${date}] [${type.toUpperCase()}] ${msg}\n`; // [2024-01-14] INFO message here

        fs.appendFile(path.join(__dirname, 'log', fileName), log, (err) => {
            if (err) {
                console.error(`Gagal menambahkan file log: ${err}`);
            } else {
                console.log(`Berhasil menambahkan file log: ${fileName}`);
            }
        });
    } catch (err) {
        console.error(`Gagal menambahkan file log: ${err}`);
    }
};

const log = {
    info: (message) => logger('info', message),
    warn: (message) => logger('warn', message),
    error: (message) => logger('error', message)
};

export default log;
