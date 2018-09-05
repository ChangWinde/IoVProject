var currentLocation;
window.onLoad  = function(){
    var map = new AMap.Map('container');
    AMap.plugin(['AMap.Driving', 'AMap.Autocomplete', 'AMap.ToolBar', 'AMap.PlaceSearch', 'AMap.Geolocation'], function (){
        //初始化toolBar
        var toolbar = new AMap.ToolBar();
        map.addControl(toolbar);
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

            //TODO 使用ajax向服务器发送数据，成功接收后产生导航信息标签
            var naviOpt = document.getElementsByClassName('navi-opt')[0];
            naviOpt.classList.add('block');


            //map.setCenter(marker.getPosition());
        });

    }





}

var url = 'https://webapi.amap.com/maps?v=1.4.8&key=0142d51b5476a32bd279128da1e42122&callback=onLoad';
var jsapi = document.createElement('script');
jsapi.charset = 'utf-8';
jsapi.src = url;
document.head.appendChild(jsapi);



