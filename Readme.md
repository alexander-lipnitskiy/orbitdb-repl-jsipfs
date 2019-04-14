
# Overview
This is an example of replication orbitdb between jsipfs nodes. In this example, there are three nodes:

- peer-node
- peer-node2
- peer-http-api-client

Nodes with name peer-node and peer-node2  running as a child process in node.js.  A node with name peer-http-api-client connects to the jsipfs that start daemon with pub-sub-experiment flag using CLI command. Every ipfs node connects to the same orbitdb and add record with a timestamp to the orbitdb. By default, all jsipfs nodes that running locally know about each other.

# Requirements
- node.js - 10.15.3
- yarn - 1.10.1
- jsipfs CLI - 0.35.0

# Installation

Install jsipfs CLI 
```sh
$ npm install ipfs@0.35.0 --global 
```

Run daemon with pub-sub flag 
```sh
$ jsipfs daemon --enable-pubsub-experiment 
```

Get API Address of running ipfs node
```sh
$ jsipfs config Addresses.API 
```
In the root directory in config.js file update variable IPFS_CLI_ADDRESS.

### Open a terminal in the root directory.
Install packages.
```sh
$ yarn install
```

Run peer-node.js. After running this node copy address of created orbitdb from a console. Then you should update variable ORBIT_DB_ADDRESS in config.js file.

```sh
$ node peer-node.js
```
Run other nodes.

```sh
$ node peer-node2.js
$ node peer-http-api-client.js
```