
//在点击导航开始时隐藏导航栏
var naviOpt = document.getElementsByClassName('navi-opt')[0];
var chooseBtns = document.getElementsByClassName('chooseBtn');
for (var i = 0;i<chooseBtns.length;i++){
    chooseBtns[i].addEventListener('click',()=>{
        naviOpt.classList.remove('block');
    })
}
//发送数据到服务器
function sendInfo(Info) {

}





