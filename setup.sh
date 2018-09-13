# !/bin/sh
echo
"
 ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄ 
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
 ▀▀▀▀█░█▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ 
     ▐░▌     ▐░▌       ▐░▌▐░▌          
     ▐░▌     ▐░▌       ▐░▌▐░▌          
     ▐░▌     ▐░▌       ▐░▌▐░▌          
     ▐░▌     ▐░▌       ▐░▌▐░▌          
     ▐░▌     ▐░▌       ▐░▌▐░▌          
 ▄▄▄▄█░█▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄ 
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
 ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀      
"
echo "update your apt-get"
sudo apt-get update
sudo apt-get upgrade
echo "Install Ethereum"
sudo apt-get install software-properties-common
sudo apt-get-repository -y ppa:ethereum/ethereum
sudo apt-get install ethereum
echo "Install Node"
sudo apt-get install nodejs
echo "Install MySQL"
sudo apt-get install mysql-server
sudo apt install mysql-client
sudo apt install libmysqlclient-dev
echo "All Software has been OK!"
echo "------------------------------------------------------------------------"
echo "Install dependencies"
npm install 
echo "It is time to try"
cd ./bin
node www.js
