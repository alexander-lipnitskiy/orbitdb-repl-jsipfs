const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');

const config = require('../config');
const utils = require('../utils');

const ipfsOptions = {
    EXPERIMENTAL: {
        pubsub: true
    },

    config: {
        Addresses: {
            Swarm: [
                '/ip4/0.0.0.0/tcp/4022',
                '/ip4/127.0.0.1/tcp/4023/ws'
            ],
            API: '/ip4/127.0.0.1/tcp/5022',
            Gateway: '/ip4/127.0.0.1/tcp/9292'
        }
    },
    repo: './ipfs-peer-node',
    // relay: { enabled: true, hop: { enabled: true, active: true } }
};

const ipfs = new IPFS(ipfsOptions);

ipfs.on('error', (e) => console.error(e));

ipfs.on('ready', async () => {
    const identity = await utils.createIdentity("peer-node");

    const orbitdb = await OrbitDB.createInstance(ipfs, {
        directory: 'db-peer-node',
        identity: identity
    });

    const db = await utils.createDB(orbitdb, "peers-time");

    // const db = await orbitdb.open(config.db_address);

    utils.listenOrbitdbEvents(db);

    await db.load();

    setInterval(() => {
        utils.putRecordInDb(db, "peer-node");
    }, 2000);

    // setInterval(() => {
    //     utils.getAllRecords(db);
    // }, 2000)
});


