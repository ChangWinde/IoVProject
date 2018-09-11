function openWeiXin (e) {
    var ifr = document.createElement('iframe');
    ifr.src = 'weixin://';
    ifr.style.display = 'none';
    document.body.appendChild(ifr);

    window.setTimeout(function () {
        document.body.removeChild(ifr)

    },3000)

}