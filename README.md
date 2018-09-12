# IOC
## Requirement

- Linux ubuntu 18.04 LST
- Node：8.10.0
- truffle: 4.1.14 
- truffle-contact：3.0.6
- express：~4.16.0
- mysql：2.16.0
- geth：lastest
## Installation
### geth
- 安装

   ```
   sudo apt-get install software-properties-common 
   sudo add-apt-repository -y ppa:ethereum/ethereum 
   sudo apt-get update 
   sudo apt-get install ethereum 
   ```
### Node

- 安装

    ```
    sudo apt-get install nodejs
    ```

- 注意apt-get可能需要更新的问题

    ```
    sudo apt-get update
    sudo apt-get upgrade
    ```

### MySQL

- 安装

    ```
    sudo apt-get install mysql-server
    sudo apt install mysql-client
    sudo apt install libmysqlclient-dev
    ```
- 检验安装

    ```
    sudo netstat -tap | grep mysql
    ```

- 允许mysql远程访问

   ```
   sudo vim /etc/mysql/mysql.conf.d/mysqld.cnf
   ```

mysqld.cnf文件中，注释掉bind-address = 127.0.0.1本行，退出保存

- 授权

    ```
    grant all on *.* to root@'%' identified by 'your passward' with grant option;
    flush privileges;
    ```

- 重启mysql

    ```
    service mysql restart
    ```

### 运行源代码

- 安装node_modules

    ```
    cd ./IoVProject
    npm install 
    ```

- 运行

    ```
    cd ./IoVProject/bin
    node www.js
    ```

使用iPad访问Google Chrome（或其他浏览器）查看


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

    contracts/: Directory for Solidity contracts
    migrations/: Directory for scriptable deployment files
    test/: Directory for test files for testing your application and contracts
    truffle.js: Truffle configuration file

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

### ganache-cli

  Ganache CLI, part of the Truffle suite of Ethereum development tools, is the command line version of Ganache, your personal blockchain for Ethereum development.

  Ganache CLI uses ethereumjs to simulate full client behavior and make developing Ethereum applications faster, easier, and safer. It also includes all popular RPC functions and features (like events) and can be run deterministically to make development a breeze.

- Installation

    ```
    npm install ganache-cli
    ```



