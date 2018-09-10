var mysql=require("mysql");
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
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
    query(sql,[start,end,0,0,0],callback)
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
// getLinkedPoint("111",function (e,r,f) {
//     if(!e)
//         console.log(r);
//     else
//         console.log("Error");
// })


module.exports = {
    createTable:createTable,
    getLinkedPoint:getLinkedPoint,
    getStreetCrowdCT:getStreetCrowdCT,
    insertStreetCrowdCT:insertStreetCrowdCT,
    updateStreetCrowdCT:updateStreetCrowdCT,
    deleteStreetCrowdCT:deleteStreetCrowdCT
};
