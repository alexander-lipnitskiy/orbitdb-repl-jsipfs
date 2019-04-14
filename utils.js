const Identities = require('orbit-db-identity-provider');
const moment = require('moment');

const config = require('./config');

async function createIdentity(name) {
    const options = { id: name };
    return await Identities.createIdentity(options)
}

async function createDB(orbitdb, name) {
    const db = await orbitdb.create(name, 'docstore', {accessController: { write: ['*']}});
    console.log(`Database created.\naddress: ${db.address.toString()}`);
    return db;
}

function listenOrbitdbEvents(db) {
    if (config.subscribeOnEvents) {
        db.events.on('ready', (dbname, heads) => {
            console.log(`Local database is fully loaded.\ndbname: ${dbname}\nheads: ${JSON.stringify(heads)}\n`)
        });

        db.events.on('replicate', (address) => {
            console.log(`Start replicate.\n${address}\n`)
        });

        db.events.on('replicated', (address) => {
            console.log(`Replicated.\n${address}\n`)
        });

        db.events.on('replicate.progress', (address, hash, entry, progress, have) => {
            console.log(`Replicate progress.\naddress: ${address}\n hash: ${hash}\n entry: ${entry}\n progress: ${progress}\n have: ${have}\n`)
        });

        db.events.on('load', (dbname) => {
            console.log(`Start loading.\n${dbname}\n`)
        });

        db.events.on('load.progress', (address, hash, entry, progress, total) => {
            console.log(`Loading progress.\naddress: ${address}\nhash: ${hash}\nentry: ${JSON.stringify(entry)}\nprogress: ${progress}\ntotal: ${total}`)
        });

        db.events.on('write', (dbname, hash, entry) => {
            //Emitted after an entry was added locally to the database. hash is the IPFS hash of the latest state of the database. entry is the added database op.
            console.log(`Entry added locally to the database.\ndbname: ${dbname}\nhash: ${JSON.stringify(hash)}\nentry: ${JSON.stringify(entry)}\n`)
        });

        db.events.on('closed', (dbname) => {
            console.log(`Database closed.\ndbname ${dbname}\n`)
        });
    }
}

async function getAllRecords(db) {
    const data = await db.get('');
    console.log(`Records in db.\n${JSON.stringify(data)}\n`);
    return data;
}

async function putRecordInDb(db, id) {
    return await db.put({"_id": id, timestamp: moment().format('hh:mm:ss a')});
}

module.exports = {
    createIdentity: createIdentity,
    listenOrbitdbEvents: listenOrbitdbEvents,
    getAllRecords: getAllRecords,
    putRecordInDb: putRecordInDb,
    createDB: createDB
};