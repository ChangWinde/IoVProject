# IOC
## Requirement

- Linux ubuntu 18.04 LST
- Node：8.10.0
- Truffle: 4.1.14 
- Truffle-contact：3.0.6
- Express：~4.16.0
- MySQL：2.16.0
- Geth：1.8.14
- Solidity：0.4.24 


## Installation
### geth
- Install

   ```
   sudo apt-get install software-properties-common 
   sudo add-apt-repository -y ppa:ethereum/ethereum 
   sudo apt-get update 
   sudo apt-get install ethereum 
   ```
### Node

- Install

    ```
    sudo apt-get install nodejs
    ```

- notice apt-get may meet some problem about update

    ```
    sudo apt-get update
    sudo apt-get upgrade
    ```

### MySQL

- Intall

    ```
    sudo apt-get install mysql-server
    sudo apt install mysql-client
    sudo apt install libmysqlclient-dev
    ```
- Inspection installation

    ```
    sudo netstat -tap | grep mysql
    ```

- permit mysql remote access

   ```
   sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
   ```

   In mysqld.cnf,comment the line of bind-address = 127.0.0.1, then save and quit.

- Authorization

    ```
    grant all on *.* to root@'%' identified by 'your passward' with grant option;
    flush privileges;
    ```

- Restart mysql

    ```
    service mysql restart
    ```

### Run Source Code

- install node_modules dependencies

    ```
    cd ./IoVProject
    npm install 
    ```

- run

    ```
    cd ./IoVProject/bin
    node www.js
    ```
access our production on Google Chrome(or other brower) by iPad.


## Overview
### truffle

- Requirements

    NodeJS 5.0+ recommended.
    Windows, Linux or Mac OS X

   Truffle also requires that you have a running Ethereum client which supports the standard JSON RPC API (which is nearly all of them). There are many to choose from, and some better than others for development. We'll discuss them in detail in the Choosing an Ethereum client section.

- Installation

    ```
    npm install -g truffle
    ```

- Start project

    ```
    truffle init
    ```

   Once this operation is completed, you'll now have a project structure with the following items:

    ```
    contracts/: Directory for Solidity contracts
    migrations/: Directory for scriptable deployment files
    test/: Directory for test files for testing your application and contracts
    truffle.js: Truffle configuration file
    ```

- Compile

    ```
    truffle compile
    ```

  Upon first run, all contracts will be compiled. Upon subsequent runs, Truffle will compile only the contracts that have been changed since the last compile. If you'd like to override this behavior, run the above command with the --alloption.

- Migration

    ```
    truffle migrate
    #truffle migrate --reset means 
    ```

  This will run all migrations located within your project's migrations directory. At their simplest, migrations are simply a set of managed deployment scripts. If your migrations were previously run successfully, truffle migrate will start execution from the last migration that was ran, running only newly created migrations. If no new migrations exists, truffle migrate won't perform any action at all. You can use the --reset option to run all your migrations from the beginning.

- Develop

    ```
    truffle develop 
    ```

  This will look for a network definition called development in the configuration, and connect to it, if available. You can override this using the --network <name> option
   
### truffle contract

   Better Ethereum contract abstraction, for Node and the browser.
- Install

    ```
    npm install truffle-contract
    ```
- Set up a new web3 provider instance and initialize your contract

    ```
    var provider = new Web3.providers.HttpProvider("http://localhost:8545");
    var contract = require("truffle-contract");

    var MyContract = contract({
    abi: ...,
    unlinked_binary: ...,
    address: ..., // optional
    // many more
    })
    MyContract.setProvider(provider);
    ```
   You now have access to the functions on your contract.

### ganache-cli

  Ganache CLI, part of the Truffle suite of Ethereum development tools, is the command line version of Ganache, your personal blockchain for Ethereum development.

  Ganache CLI uses ethereumjs to simulate full client behavior and make developing Ethereum applications faster, easier, and safer. It also includes all popular RPC functions and features (like events) and can be run deterministically to make development a breeze.

- Installation

    ```
    npm install ganache-cli
    ```



