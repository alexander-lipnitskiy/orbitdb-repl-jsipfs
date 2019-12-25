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
                '/ip4/0.0.0.0/tcp/4032',
                '/ip4/127.0.0.1/tcp/4033/ws'
            ],
            API: '/ip4/127.0.0.1/tcp/5032',
            Gateway: '/ip4/127.0.0.1/tcp/9393'
        }
    },
    repo: './ipfs-peer-node2',
    // relay: { enabled: true, hop: { enabled: true, active: true } }
};

const ipfs = new IPFS(ipfsOptions);

ipfs.on('error', (e) => console.error(e));

ipfs.on('ready', async () => {
    const identity = await utils.createIdentity("peer-node2");

    const orbitdb = await OrbitDB.createInstance(ipfs, {
        directory: 'db-peer-node2',
        identity: identity
    });

    const db = await orbitdb.open(config.db_address);

    if (db) {
        utils.listenOrbitdbEvents(db);
    }

    await db.load();

    setInterval(() => {
        utils.putRecordInDb(db, "peer-node2");
    }, 2000)

    // setInterval(() => {
    //     utils.getAllRecords(db);
    // }, 2000)
});
