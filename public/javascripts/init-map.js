var currentLocation;
var driving;
window.onLoad  = function(){
    var map = new AMap.Map('container');
    AMap.plugin(['AMap.Driving', 'AMap.Autocomplete', 'AMap.ToolBar', 'AMap.PlaceSearch', 'AMap.Geolocation'], function (){
        //初始化toolBar
        var toolbar = new AMap.ToolBar();
        map.addControl(toolbar);
        //初始化路径规划
        driving = new AMap.Driving({
            policy: AMap.DrivingPolicy.LEAST_DISTANCE,
            autoFitView: true

        });
        //初始化自动提示
        // var autoOptions = {
        //     input:"location"
        // };
        // console.log(10086)
        // var auto = new AMap.Autocomplete(autoOptions);
        // var placeSearch = new AMap.PlaceSearch({
        //     map: map,
        //     pageSize:8,
        //     panel:"panel",
        //     autoFitView: true
        // });
        // //地点查询初始化
        // AMap.event.addListener(auto, "select", select);//注册监听
        //
        // function select(e) {
        //     placeSearch.setCity(e.poi.adcode);
        //     placeSearch.search(e.poi.name);
        //     var endInfo = {
        //         name: e.poi.name,
        //         location: e.poi.location.toString()
        //     }
        //     console.log(endInfo)
        //
        //
        // }

        //初始化当前定位
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
        setInterval(geolocation.getCurrentPosition(function (status, result) {
            currentLocation = result.position;
        }), 1000);

        if(typeof(AMapUI) == "undefined"){
            $.getScript("//webapi.amap.com/ui/1.0/main.js?v=1.0.11").done(function (script, textstatus) {
                if(textstatus == "success" && typeof(AMapUI) != undefined){
                    AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

                        var poiPicker = new PoiPicker({
                            //city:'北京',
                            input: 'location',


                        });

                        //初始化poiPicker
                        poiPickerReady(poiPicker);
                    });
                } else {
                    console.log("loading failed");
                }

            });

        } else {
            AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

                var poiPicker = new PoiPicker({
                    //city:'北京',
                    input: 'location',

                });

                //初始化poiPicker
                poiPickerReady(poiPicker);
            });

        }

        

    });


    function poiPickerReady(poiPicker) {

        window.poiPicker = poiPicker;

        var marker = new AMap.Marker();

        var infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(0, -20)
        });

        //选取了某个POI
        poiPicker.on('poiPicked', function(poiResult) {
            var poi = poiResult.item;


            //设置地图上可视化显示点
            marker.setMap(map);
            infoWindow.setMap(map);

            marker.setPosition(poi.location);
            infoWindow.setPosition(poi.location);
            infoWindow.open(map, marker.getPosition());
            infoWindow.setContent(poi.name);
            map.setCenter(poi.location);
            //查询路径规划方案
            var distanceRouteCoordinate, timeRouteCoordinate, feeRouteCoordinate, trafficRouteCoordinate = [];
            var time, distance, fee, traffic;
            var timeInfo, distanceInfo, feeInfo, trafficInfo;
            distance = searchByPolicy(driving, AMap.DrivingPolicy.LEAST_DISTANCE);
            time = searchByPolicy(driving, AMap.DrivingPolicy.LEAST_TIME);
            fee = searchByPolicy(driving, AMap.DrivingPolicy.LEAST_FEE);
            traffic = searchByPolicy(driving. AMap.DrivingPolicy.REAL_TRAFFIC);

            distanceRouteCoordinate = distance.coordians;
            timeRouteCoordinate = time.coordians;
            feeRouteCoordinate = fee.coordians;
            trafficRouteCoordinate = traffic.coordians;

            timeInfo = {
                time : time.time,
                length: time.distance
            };

            distanceInfo = {
                time: distance.time,
                length: distance.distance
            };

            feeInfo = {
                time: fee.time,
                length: fee.distance
            };

            trafficInfo = {
                time: traffic.time,
                length: traffic.distance
            }




            var routes = {
                distance: distanceRouteCoordinate,
                time: timeRouteCoordinate,
                fee: feeRouteCoordinate,
                traffic: trafficRouteCoordinate
            }



            //TODO 使用ajax向服务器发送数据，成功接收后产生导航信息标签
            //ajax发送数据
            $.ajax({
                type: 'GET',
                url: "http://localhost:3000/processNavi",
                data: routes,
                success: function (data, textStatus) {
                    var length = document.getElementById("routeLength");
                    var time = document.getElementById("routeTime");
                    if(data == "distance"){
                        length.innerHTML = distanceInfo.length;
                        time.innerHTML = distanceInfo.time;

                    }else if (data == "time"){
                        length.innerHTML = timeInfo.length;
                        time.innerHTML = timeInfo.time;

                    } else if(data == "traffic"){
                        length.innerHTML = trafficInfo.length;
                        time.innerHTML = trafficInfo.time;

                    }else {
                        length.innerHTML = feeInfo.length;
                        time.innerHTML = feeInfo.time

                    }
                    //TODO 导航预览

                    //产生导航栏标签
                    var naviOpt = document.getElementsByClassName('navi-opt')[0];
                    naviOpt.classList.add('block');

                    //TODO 点击开始导航按钮后开始导航
                },
                error: function (data, textStatus) {
                    alert("生成路径失败")
                    
                },
                dataType: String
            });




            //map.setCenter(marker.getPosition());
        });





    }

    function searchByPolicy(driving, policy) {
        var coordians = [];
        var distance, time;
        driving.setPolicy(policy);
        driving.search(currentLocation, poi.location, {}, function (status, result) {
            var routes = result.routes;
            var steps = routes[0].steps;
            distance = routes.distance;
            time = routes.time;

            for (var i = 0; i < steps.length; i++){
                var routeInfo = {
                    startLocation: steps[i].start_location,
                    endLocation: steps[i].end_location
                }

                coordians[i] = routeInfo;

            }

        });

        var info = {
            distance: distance,
            time: time,
            coordians: coordians
        };
        return info;

    }


}

var url = 'https://webapi.amap.com/maps?v=1.4.8&key=0142d51b5476a32bd279128da1e42122&callback=onLoad';
var jsapi = document.createElement('script');
jsapi.charset = 'utf-8';
jsapi.src = url;
document.head.appendChild(jsapi);



