const IpfsClient = require('ipfs-http-client');
const OrbitDB = require('orbit-db');

const config = require('./config');
const utils = require('./utils');

// jsipfs config Addresses.API
const ipfs = IpfsClient(config.ipfs_cli_address);

async function main() {
    const identity = await utils.createIdentity('peer-http-api-client');

    const orbitdb = await OrbitDB.createInstance(ipfs, {directory: 'db-http-api-client', identity: identity});

    const db = await orbitdb.open(config.db_address);

    utils.listenOrbitdbEvents(db);

    await db.load();

    setInterval(() => {
        utils.putRecordInDb(db, "peer-http-api-client");
    }, 2000);

    // setInterval(() => {
    //         utils.getAllRecords(db);
    //     }, 2000)
}

main();
