var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("get ippcoin");
  res.send({ippcoin : web3Test.getToken({from:a3}).toNumber()});

});

module.exports = router;
