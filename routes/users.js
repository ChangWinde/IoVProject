var express = require('express');
var web3Test = require("../web3/web3");
var router = express.Router();
// 创建 eventEmitter 对象

//获取事件对象
var evtTest = web3Test.StateWithReturns();
//监听事件
evtTest.watch(function(err,result) {
    //evtTest.stopWatching();

    if (!err) {
        console.log(result.args.mes);
        console.log(result.args.value);
        console.log(result.args.values);
    }
    else
        console.log(err);
});
var eveTest = web3Test.State();
//监听事件
eveTest.watch(function(err,result) {
    //evtTest.stopWatching();

    if (!err) {
        console.log(result.args.mes);
    }
    else
        console.log(err);
});
/* GET users listing. */
router.get('/', function(req, res, next) {
    //console.log("get ippcoin");
    res.send({ippcoin :web3Test.getToken({from:"0x200739b45d0f877829a1f6192c5220ed640e15ae"}).toNumber()});
    //console.log(web3Test.getToken({from:"0x200739b45d0f877829a1f6192c5220ed640e15ae"}).toNumber());
});
// router.get('/cashing', function (req, res, next) {
//     web3Test.token2eth(web3Test.getToken({from:"0x200739b45d0f877829a1f6192c5220ed640e15ae"}).toNumber(),{from:"0x200739b45d0f877829a1f6192c5220ed640e15ae"});
//     console.log("1");
//    // res.send({ippcoin : web3Test.getToken({from:"0x200739b45d0f877829a1f6192c5220ed640e15ae"}).toNumber()});
//     // console.log("2");
//
//  })
router.get('/upload', function (req, res, next) {
    console.log("nmsl");
    var routeSteps = JSON.parse(req.body.result);
    for (var i = 0; i < routeSteps.length; i++) {
        routeSteps[i].routeInfo = JSON.parse(routeSteps[i].routeInfo);
        console.log(routeSteps[i].routeInfo )
    }
    //web3Test.uploadInfo(134,223,6,{from:"0x200739b45d0f877829a1f6192c5220ed640e15ae",gas:1000000});
    // web3Test.  web3TestuploadRoute(address user, uint routeChosen);
    console.log("wsngg");
    var aaaaa = web3Test.getInfo({from:"0x200739b45d0f877829a1f6192c5220ed640e15ae"});
    console.log(aaaaa[2]);
    //console.log(web3Test.getToken({from:"0x200739b45d0f877829a1f6192c5220ed640e15ae"}).toNumber());
})
module.exports = router;
