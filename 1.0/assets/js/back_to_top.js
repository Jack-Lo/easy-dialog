/* 
* @Author: jack
* @Date:   2015-07-31 18:42:59
* @Last Modified by:   jack
* @Last Modified time: 2015-07-31 22:11:02
*/

'use strict';
(function(){
    var bd = document.getElementsByTagName('body')[0];
    var btn = document.createElement('div');
    var scrollBox = document.body;
    var scrollTop = 0;
    var timer = null;
    btn.className = 'u-back_to_top';
    bd.appendChild(btn);

    window.onscroll = function(){
        scrollBox = getSrollBox();
        scrollTop = scrollBox.scrollTop;
    }
    btn.onclick = function(){
        timer = setInterval(function(){
            if(scrollTop > 0) {
                if(scrollTop < 1) {scrollTop = 0;}
                scrollBox.scrollTop *= 0.8;
            }else{
                clearInterval(timer);
                timer = null;
            }
        }, 20);
    }

    function getSrollBox(){
        if(document.body.scrollTop == 0){
            return document.documentElement;
        }else{
            return document.body;
        }
    }
})();