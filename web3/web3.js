var db = require('../database/db.js');
var a1 = "0x4c0e6fa15267298e0f2030a9d7596ac92d9687af";
var a2 = "0x26887d12ea40ecf5e66d9d16bc7877a1fea1a1ff";

var Web3 = require("web3");
// 创建web3对象
var web3obj = new Web3();
// 连接到以太坊节点
web3obj.setProvider(new Web3.providers.HttpProvider("http://localhost:8046"));
//合约ABI
var abi = [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"mes","type":"string"}],"name":"State","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"mes","type":"string"},{"indexed":false,"name":"value","type":"uint256"}],"name":"StateWithReturn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"mes","type":"string"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"values","type":"uint256[]"}],"name":"StateWithReturns","type":"event"},{"constant":false,"inputs":[{"name":"myRate","type":"uint256"},{"name":"myT2tr","type":"uint256"}],"name":"changeRate","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"}],"name":"giveCarPermission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"},{"name":"initMoneyLimit","type":"uint256"},{"name":"initToken","type":"uint256"}],"name":"giveNorBuyerPermission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"},{"name":"plusTime","type":"uint256"}],"name":"giveTimeBuyerPermission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"}],"name":"cancelCarPermission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"}],"name":"cancelNorBuyerPermission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"}],"name":"cancelTimeBuyerPermission","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"timeValue","type":"uint256"}],"name":"buyTime","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"start","type":"uint256"},{"name":"end","type":"uint256"},{"name":"crowd","type":"uint256"}],"name":"uploadInfo","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"},{"name":"routeChosen","type":"uint256[]"}],"name":"uploadRoute","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"value","type":"uint256"}],"name":"pay","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"token2eth","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"eth2token","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"empty","outputs":[],"payable":true,"stateMutability":"payable","type":"function"}]
//合约地址
var address = "0xe758572dd7374cd829a35cd99e2a5aa3a280835a";
//获取合约对象
var web3Test = web3obj.eth.contract(abi).at(address);

//获取事件对象
var evtTest = web3Test.State();
//监听事件
evtTest.watch(function(err,result) {
    //evtTest.stopWatching();
    if(!err)
        console.log(result.args.mes);
    else
        console.log(err);
});

//获取事件对象
var dbTest = web3Test.StateWithReturns();
//监听事件，调用数据库函数
dbTest.watch(function(err,result) {
   if(!err) {
        if(result.args.mes == "upload info")
            db.changeCount(result.args.ret[0],result.args.ret[1],result.args.ret[2],result.args.ret[3],result.args.ret[4]);
   }
   else
       console.log(err);
});
module.exports = web3Test;
