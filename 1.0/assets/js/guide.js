/* 
* @Author: jack
* @Date:   2015-07-30 11:24:08
* @Last Modified by:   jack
* @Last Modified time: 2015-07-31 16:00:37
*/

'use strict';
(function(global){
    if(!global.alt) {
        console.log('未引入alt.js');
        return;
    }

    var oNav = document.getElementById('nav');
    var oNavList = oNav.getElementsByTagName('ul')[0];
    var oIntro = document.getElementById('intro');
    var oIntroList = oIntro.getElementsByTagName('ul')[0];
    var navHtml = '';
    var introHtml = '';
    var dataArr = getConfigData();
    for (var i = 0; i < dataArr[0].length; i++) {
        navHtml += '<li><span class="u-tiptop">'+
            '<a class="target" href="#'+dataArr[0][i]+'">'+dataArr[0][i]+'</a>'+
            '<i class="info">'+dataArr[2][i]+'</i>'+
        '</span></li>';

        introHtml += '<li>'+
            '<h2 class="hd"><a class="tg" name="'+dataArr[0][i]+'">&</a>'+dataArr[0][i]+'</h2>'+
            '<div class="cnt">'+
                '<div class="val">取值：'+dataArr[1][i]+'</div>'+
                '<div class="mean">释义：'+dataArr[2][i]+'</div>'+
            '</div>'+
        '</li>';
    };
    
    oNavList.innerHTML = navHtml;
    oIntroList.innerHTML = introHtml;

    function getConfigData(){
        var cfgStr = alt.toString();
        var startP = cfgStr.indexOf('/*>>>config<<<*/');
        var endP = cfgStr.indexOf('/*>>>!config<<<*/');
        var str = cfgStr.slice(startP+16,endP);

        var keyValArr = str.split(/>>>/);
        var newKeyValArr = [];
        var keyArr = [];
        var valArr = [];
        var meanArr = [];
        for (var i = 0; i < keyValArr.length; i++) {
            if(/\S/.test(keyValArr[i])) {
                var item = keyValArr[i].replace(/\s/g, '');
                newKeyValArr.push(item);
            }
        };
        newKeyValArr[newKeyValArr.length-1] = newKeyValArr[newKeyValArr.length-1].replace('//',',//');
        for (var i = 0; i < newKeyValArr.length; i++) {
            if(newKeyValArr[i]=='') {
                return;
            }
            var arr = newKeyValArr[i].split(',//');
            var arr2 = arr[0].split(':');
            meanArr.push(arr[1]);
            keyArr.push(arr2[0]);
            valArr.push(arr2[1]);
        };
        return [keyArr, valArr, meanArr];
    }

})(window)