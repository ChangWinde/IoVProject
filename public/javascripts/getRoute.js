
//输入地点显示导航方案栏
//TODO 使用定时的方式在网络不良的状况下无法获取列表
// var localInput = document.getElementById('location');
//
// localInput.addEventListener('keyup',()=>{
//     setTimeout(function () {
//         var autoItems = document.getElementsByClassName('auto-item');
//         for (var i = 0;i<autoItems.length;i++){
//             //console.log(1)
//             autoItems[i].addEventListener('click',()=>{
//                 setTimeout(function () {
//                     var selected = document.getElementsByClassName('poibox');
//                     var endPoint;
//                     for (var i = 0,length = selected.length;i<length;i++){
//                         //console.log(selected[i])
//                         selected[i].addEventListener('click',()=>{
//
//                             //获取终点
//                             endPoint = document.getElementsByClassName("poibox selected");
//
//                         })
//                     }
//                 },500);
//             })
//         }
//     },500);
//



//在点击导航开始时隐藏导航栏
var naviOpt = document.getElementsByClassName('navi-opt')[0];
var chooseBtns = document.getElementsByClassName('chooseBtn');
for (var i = 0;i<chooseBtns.length;i++){
    chooseBtns[i].addEventListener('click',()=>{
        naviOpt.classList.remove('block');
    })
}




