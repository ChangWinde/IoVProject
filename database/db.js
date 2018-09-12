var mysql = require('mysql');
var async = require('async');
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mm40659614',
    database: 'IOC',
    port:3306
});
//query
function query(sql,options,callback){
    pool.getConnection(function(error,connection){
        if(error){
            console.error('error:connecting'+error.stack);
            console.log("Error:query!");
            callback(error,null,null);
        }else{
            connection.query(sql,options,function(error,results,fields){
                //release
                connection.release();
                //callback
                callback(error,results,fields);
            });

        }
    });
};
//create table record
function createTable(callback) {
    let sql = "CREATE TABLE IF NOT EXISTS record (start VARCHAR(30),end VARCHAR(30),crowd FLOAT,total INT,count INT)";
    query(sql,[],callback)
}
//get linked point
function getLinkedPoint(point,callback){
    let sql = "SELECT start,end FROM record WHERE  start = ? OR end = ?";
    query(sql,[point,point],callback);
    // function (error,results) {
    //     if(error){
    //         console.log("Error:getLinkedPoint!");
    //         return;
    //     }
    //     console.log(results[0].end);
    //     return results[0].end;
    // })
}
//get crowd
function getStreetCrowdCT(start,end,callback) {
    sql = "SELECT crowd,total,count FROM record WHERE start = ? AND  end = ?";
    query(sql, [start, end], callback);
}
//insert
function insertStreetCrowdCT(start,end,callback){
    let sql = "INSERT INTO record VALUES (?,?,?,?,?)";
    query(sql,[start,end,1,1,1],callback)
}
//update
function updateStreetCrowdCT(start,end,crowd,total,count,callback){
    let sql = "UPDATE record SET crowd = ?,total = ?,count = ? WHERE start = ? AND end = ?";
    query(sql,[crowd,total,count,start,end],callback);
}
//delete
function deleteStreetCrowdCT(start,end,callback){
    let sql = "DELETE FROM record WHERE start = ? AND end =?";
    query(sql,[start,end],callback);
}
//init
function init (values){
    for(let i = 0;i<values.length;i++){
        let value = values[i].routeInfo;
        for (let j = 0;j<value.length;j++){
            for (let k = 0;k<value[j].length-1;k++){
                let str1 = value[j][k].lng.toString()+value[j][k].lat.toString();
                let str2 = value[j][k+1].lng.toString()+value[j][k+1].lat.toString();
                insertStreetCrowdCT(str1,str2, function (error,results,fields) {

                });
            }
        }
    }
}
let crowdness = Array();
//get best road
function getBestRoadBasic (roads, res){
    let pros = Array();
    for(let i = 0;i<4;i++){
        crowdness[i] = 0;
        let road = roads[i].routeInfo;
        for (let j = 0;j<road.length;j++){

            for (let k = 0;k<road[j].length-1;k++){
                let str1 = road[j][k].lng.toString()+road[j][k].lat.toString();
                let str2 = road[j][k+1].lng.toString()+road[j][k+1].lat.toString();
                getStreetCrowdCT(str1,str2,function (e,r,f) {
                    pros.push(new Promise(function (resolve, reject) {


                        crowdness[i] += (1 - (r[0].crowd/r[0].total)*(1-0.667/r[0].count));
                        resolve();

                    }).catch(function (reason) {
                        console.log("error")
                    }))

                });
            }
        }
    }
    Promise.all(pros).then(getBestRoad(roads, res)).catch(function (reason) {console.log(reason);})
}
//get best policy
function getBestRoad (roads, res) {
    let count = 0;
    for(let i = 1;i<4;i++){
        let min = crowdness[0];
        if(crowdness[i]<min){
            min = crowdness[i]
            count = i;
        }
    }
    res.send(roads[count].policy) ;
}
//update count
function updateCount(count,start,end,callback) {
    let sql = "UPDATE record SET count = ? WHERE start = ? AND end = ?";
    query(sql,[count,start,end],callback);
}
//get count
function getCount(start,end,callback) {
    sql = "SELECT count FROM record WHERE start = ? AND  end = ?";
    query(sql, [start, end], callback);
}
//web3
function changeCount(start1,end1,start2,end2) {
    let pros = Array();
    let count1 = 0;
    let count2 = 0;
    pros.push(new Promise(function (resolve, reject) {
        let sql = "SELECT count FROM record WHERE start = ? AND  end = ?";
        query(sql, [start1, end1], function (e, r, f) {
            count1 = r[0].count - 1;
            resolve(count1);
        });
    }));
    pros.push(new Promise(function (resolve, reject) {
        let sql = "SELECT count FROM record WHERE start = ? AND  end = ?";
        query(sql, [start2, end2], function (e, r) {
            count2 = r[0].count + 1;
            resolve(count2);
        });
    }));
    Promise.all(pros).then(function (resout) {
        updateCount(resout[0],start1,end1,function (e) {});
        updateCount(resout[1],start2,end2,function (e) {});
    });
}
// for(let i = 0;i<2;i++){
//     var sum = 0;
//     getStreetCrowdCT("111","222",function (e,r,f) {
//         console.log(i+"     "+r[0].total);
//         console.log(i+"     "+r[0].crowd);
//         sum += r[0].total+ r[0].crowd;
//         console.log(i+"     "+sum);
//     })
//
// }
// deleteStreetCrowdCT("123","456",function (e,r,f) {
//     if(!e)
//         console.log(r);
//     else
//         console.log("error");
// })
// updateStreetCrowdCT("111","222",1,2,3,function (e,r,f) {
//     if(!e)
//         console.log(r);
//     else
//         console.log("error");
// })
// insertStreetCrowdCT("123","456",function (e,r,f) {
//     if(!e)
//         console.log(r);
//     else
//         console.log("Error");
// })

// getStreetCrowdCT("111","222",function (e,r,f) {
//     if(!e)
//         console.log(r[0].count);
//     else
//         console.log(e);
// })
// getLinkedPoint(test,function (e,r,f) {
//     if(!e)
//         console.log(r);
//     else
//         console.log("Error");
// })
// var sum =0;
// function f1(callback){
//     for(let i = 0;i<2;i++){
//         getStreetCrowdCT("111","222",function (e,r,f) {
//             console.log(i+"     "+r[0].total);
//             console.log(i+"     "+r[0].crowd);
//             sum += r[0].total+ r[0].crowd;
//             console.log(i+"     "+sum);
//         })
//     }
//     setTimeout(function () {
//         return f2();
//     },2000);
// }
// function f2(){
//     console.log(sum)
//     return sum;
// }
// f1(f2);
// async.waterfall([
//     function (next) {
//     var sum = 0;
//
//     next(null,sum);
// },function (data,next) {
//     console.log(data);
// }],function (err,res) {
//     if(err)
//         console.log(e);
//     else
//         console.log(r);
// })

module.exports = {
    createTable:createTable,
    getLinkedPoint:getLinkedPoint,
    getStreetCrowdCT:getStreetCrowdCT,
    insertStreetCrowdCT:insertStreetCrowdCT,
    updateStreetCrowdCT:updateStreetCrowdCT,
    deleteStreetCrowdCT:deleteStreetCrowdCT,
    getBestRoadBasic:getBestRoadBasic,
    getBestRoad:getBestRoad,
    updateCount:updateCount,
    changeCount:changeCount,
    getCount:getCount,
    init:init
};
