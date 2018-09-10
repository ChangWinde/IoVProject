var currentLocation;

//初始化地图
window.onLoad  = function() {
    console.log("initial map");
    var map = new AMap.Map('container');
    //加载toolBar
    AMap.plugin('AMap.ToolBar', function () {
        console.log("tool bar");
        var toolbar = new AMap.ToolBar();
        map.addControl(toolbar);
    });

    //加载定位
    AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            timeout: 10000,
            // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
            buttonOffset: new AMap.Pixel(10, 20),
            //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            zoomToAccuracy: true,
            //  定位按钮的排放位置,  RB表示右下
            buttonPosition: 'RB'
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function (status, result) {
            currentLocation = result.position;
            console.log(currentLocation);
        });
    });

    //加载自动推荐目的地
    AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Driving'], function () {
        var EndPoint;
        var autoOptions = {
            input:"location"
        };
        var auto = new AMap.Autocomplete(autoOptions);
        var placeSearch = new AMap.PlaceSearch({
            map: map,
            pageSize:8,
            panel:"panel",
            autoFitView: true
        });
        //地点查询初始化
        AMap.event.addListener(auto, "select", select);//注册监听

        function select(e) {
            placeSearch.setCity(e.poi.adcode);
            placeSearch.search(e.poi.name);

        }

        //当选择poi时，获取其终点经纬度
        AMap.event.addListener(placeSearch, "listElementClick", getEndPoint);
        AMap.event.addListener(placeSearch, "markerClick", getEndPoint);

        function getEndPoint(selectChangeEvent) {
            console.log(55555)
            EndPoint = selectChangeEvent.data.location;
            console.log(EndPoint);
            map.emit("hadEndPoint",{endPoint: EndPoint});
            console.log("triggered")

        }
        //绑定一旦修改endPoint就执行路径规划的事件
        map.on("hadEndPoint", startPlanning);

        function startPlanning(e){
            console.log("startplanning")
            //获得高德路径规划方案
            //创建四种规划方案
            var leastDistanceDriving = new AMap.Driving({
                policy: AMap.DrivingPolicy.LEAST_DISTANCE,
                map: map,
                showTraffic: true,
                autoFitView: true
            });
            var leastTimeDriving = new AMap.Driving({
                policy: AMap.DrivingPolicy.LEAST_TIME,
                map: map,
                showTraffic: true,
                autoFitView: true
            });
            var leastFeeDriving = new AMap.Driving({
                policy: AMap.DrivingPolicy.LEAST_FEE,
                map: map,
                showTraffic: true,
                autoFitView: true
            });
            var leastTrafficDriving = new AMap.Driving({
                policy: AMap.DrivingPolicy.REAL_TRAFFIC,
                map: map,
                showTraffic: true,
                autoFitView: true
            });
            //获得四种规划方案
            // currentLocation = new AMap.LngLat(118.8208293915, 31.9314407620);
            var leastDistancePlan, leastTimePlan, leastFeePlan, trafficPlan;
            var drivings = new Array(leastDistanceDriving, leastTimeDriving, leastFeeDriving, leastTrafficDriving);
            var routeSteps = new Array();
            var count = 0;

            new Promise(function (resolve, reject) {
                for (var i = 0; i < drivings.length; i++){
                    drivings[i].search(currentLocation, EndPoint, {}, function (status, result) {
                        if (status == "complete"){
                            var steps = result.routes[0].steps;
                            var policy = result.routes[0].policy;
                            var length = result.routes[0].distance;
                            var time = result.routes[0].time;
                            var routeInfo = [];
                            for (var j = 0; j < steps.length; j++){
                                routeInfo[j] = steps[j].path;
                            }
                            var info = {
                                policy : policy,
                                routeInfo : routeInfo,
                                length: length,
                                time: time
                            }
                            routeSteps.push(info);
                        }else {
                            reject(result);
                        }

                    })

                }
                setTimeout(function () {
                    console.log("time up");
                    console.log(routeSteps)
                    resolve(routeSteps);
                }, 5000)


                //获得到数据后
            }).then(function (result) {
                //向服务器发送数据
                //TODO 使用ajax向服务器发送数据，成功接收后产生导航信息标签
                //ajax发送数据
                $.ajax({
                    type: 'GET',
                    url: "http://localhost:3000/processNavi",
                    data: routeSteps,
                    success: function (data, textStatus) {
                        var length = document.getElementById("routeLength");
                        var time = document.getElementById("routeTime");
                        length.innerHTML = "距离: ";
                        length.innerHTML = "耗时： ";
                        if(data == "distance"){
                            var distanceInfo = parseByPolicy("距离最短", routeSteps);
                            length.innerHTML += distanceInfo.length;
                            time.innerHTML += distanceInfo.time;

                        }else if (data == "time"){
                            var timeInfo = parseByPolicy("速度最快", routeSteps);
                            length.innerHTML += timeInfo.length;
                            time.innerHTML += timeInfo.time;

                        } else if(data == "traffic"){
                            var trafficInfo = parseByPolicy("参考交通信息最快", routeSteps);
                            length.innerHTML += trafficInfo.length;
                            time.innerHTML += trafficInfo.time;

                        }else {
                            var feeInfo = parseByPolicy("费用最低", routeSteps);
                            length.innerHTML += feeInfo.length;
                            time.innerHTML += feeInfo.time

                        }
                        //TODO 导航预览

                        //产生导航栏标签
                        var naviOpt = document.getElementsByClassName('navi-opt')[0];
                        naviOpt.classList.add('block');

                        //TODO 点击开始导航按钮后开始导航（不存在的没有）

                    },
                    error: function (data, textStatus) {
                        alert("生成路径失败")

                    },
                    dataType: String
                });
            }).catch(function (reason) {
                console.log(reason);

            });

            function parseByPolicy(policy, info) {
                for (var i = 0; i < info.length; i++ ){
                    if(info[i].policy == policy){
                        return info[i];
                    }
                }
            }





        }
        console.log(1)



    });

};
var url = 'https://webapi.amap.com/maps?v=1.4.8&key=0142d51b5476a32bd279128da1e42122&callback=onLoad';
var jsapi = document.createElement('script');
jsapi.charset = 'utf-8';
jsapi.src = url;
document.head.appendChild(jsapi);



// AMap.plugin([ 'AMap.Autocomplete', 'AMap.ToolBar', 'AMap.PlaceSearch', 'AMap.Geolocation'], function (){
//     //初始化toolBar
//     var toolbar = new AMap.ToolBar();
//     map.addControl(toolbar);
//     //初始化路径规划
//
//     //初始化当前定位

//

//
//
//     function poiPickerReady(poiPicker, driving) {
//
//         window.poiPicker = poiPicker;
//
//         var marker = new AMap.Marker();
//
//         var infoWindow = new AMap.InfoWindow({
//             offset: new AMap.Pixel(0, -20)
//         });
//
//         //选取了某个POI
//         poiPicker.on('poiPicked', function(poiResult) {
//             var poi = poiResult.item;
//
//
//             //设置地图上可视化显示点
//             marker.setMap(map);
//             infoWindow.setMap(map);
//
//             marker.setPosition(poi.location);
//             infoWindow.setPosition(poi.location);
//             infoWindow.open(map, marker.getPosition());
//             infoWindow.setContent(poi.name);
//             map.setCenter(poi.location);
//             //查询路径规划方案
//             var distanceRouteCoordinate, timeRouteCoordinate, feeRouteCoordinate, trafficRouteCoordinate = [];
//             var time, distance, fee, traffic;
//             var timeInfo, distanceInfo, feeInfo, trafficInfo;
//             var leastTime = 1;
//             distance = searchByPolicy(leastTime ,poi);
//             // time = searchByPolicy(AMap.DrivingPolicy.LEAST_TIME, poi);
//             // fee = searchByPolicy(AMap.DrivingPolicy.LEAST_FEE, poi);
//             //traffic = searchByPolicy(driving. AMap.DrivingPolicy.REAL_TRAFFIC, poi);
//             console.log(distance);
//             distanceRouteCoordinate = distance.coordians;
//             timeRouteCoordinate = time.coordians;
//             feeRouteCoordinate = fee.coordians;
//             trafficRouteCoordinate = traffic.coordians;
//
//             timeInfo = {
//                 time : time.time,
//                 length: time.distance
//             };
//
//             distanceInfo = {
//                 time: distance.time,
//                 length: distance.distance
//             };
//
//             feeInfo = {
//                 time: fee.time,
//                 length: fee.distance
//             };
//
//             trafficInfo = {
//                 time: traffic.time,
//                 length: traffic.distance
//             }
//
//
//
//
//             var routes = {
//                 distance: distanceRouteCoordinate,
//                 time: timeRouteCoordinate,
//                 fee: feeRouteCoordinate,
//                 traffic: trafficRouteCoordinate
//             }
//
//
//





            //map.setCenter(marker.getPosition());
//
//
//
//
//
//
//     }
//
//     function searchByPolicy(policy, poi) {
//         currentLocation = new AMap.LngLat(31.9314407620, 118.8208293915);
//         var driving;
//         AMap.plugin('AMap.Driving', function () {
//             driving = new AMap.Driving({
//                 policy: AMap.DrivingPolicy.LEAST_TIME,
//                 autoFitView: true
//             });
//             console.log(driving);
//             var coordians, paths = [];
//             var distance, time;
//             driving.search(currentLocation, poi.location, {}, function (status, result) {
//                 console.log(status)
//                 console.log(result)
//                 var routes = result.routes;
//                 var steps = routes[0].steps;
//                 distance = routes.distance;
//                 time = routes.time;
//
//                 for (var i = 0; i < steps.length; i++){
//                     var routeInfo = {
//                         startLocation: steps[i].start_location,
//                         endLocation: steps[i].end_location
//                     }
//
//                     coordians[i] = routeInfo;
//
//                 }
//
//             });
//
//             var info = {
//                 distance: distance,
//                 time: time,
//                 coordians: coordians
//             };
//             return info;
//         });
//
//
//
//     }
// });








