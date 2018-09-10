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

$(document).ready(function(){

    $(".home").click(function(){

        $("#right_body").load("home.html");
    });
});





