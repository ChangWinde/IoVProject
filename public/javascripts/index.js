var hostAddress =
$(document).ready(function(){
    $(".btn").click(function(){
        $("#right_body").load("navigation.html");

    });
});


function getTime(){
    var date = new Date();  //创建对象
    var h = date.getHours();  //时
    var minute = date.getMinutes()  //分
    if(h<10){
        h = "0"+h;
    }


    if(minute<10){
        minute = "0"+minute;
    }
    document.getElementById("time").innerHTML =  h+":"+minute;

}

function getDate(){
    var date2 = new Date();  //创建对象
    var m =date2.getMonth()+1;   //获取月份  返回0-11
    var d = date2.getDate(); // 获取日
    var ww = ' 星期'+'日一二三四五六'.charAt(new Date().getDay()) ;//星期几
    document.getElementById('date').innerHTML =  ww+ "  "+m+"月"+d+"日";

}

function getIppCoin(){
    $.ajax({
        type: 'GET',
        url: "/users",
        data: 111,
        success: function (data, textStatus) {
            document.getElementById("ippcoin").innerHTML = data.ippcoin;

        },
        error: function (data, textStatus) {
            console.log("error")

        }
    })
}
//进入全屏

function requestFullScreen() {
    var de = document.documentElement;
    if (de.requestFullscreen) {
        de.requestFullscreen();
    } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
    } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
    }
}
//退出全屏
function exitFullscreen() {
    var de = document;
    if (de.exitFullscreen) {
        de.exitFullscreen();
    } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
    } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
    }
}


$(document).ready(function(){

    $(".home").click(function(){

        $("#right_body").load("home.html");
    });
});

$(document).ready(function(){

    $("#wechat").click(function(){

        $("#right_body").load("https://wx.qq.com/");
    });
});




