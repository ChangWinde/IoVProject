var express = require("express");
var database = require("../database/db");
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    console.log( );
    var routeSteps = JSON.parse(req.body.result);
    for (var i = 0; i < routeSteps.length; i++) {
        routeSteps[i].routeInfo = JSON.parse(routeSteps[i].routeInfo);
    }
    //database.init(routeSteps);

    res.send("time");

});

module.exports = router;
