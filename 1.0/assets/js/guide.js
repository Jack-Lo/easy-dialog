/* 
* @Author: jack
* @Date:   2015-07-30 11:24:08
* @Last Modified by:   jack
* @Last Modified time: 2015-07-30 19:05:38
*/

'use strict';
(function(global){
    if(!global.alt) {
        console.log('未引入alt.js');
        return;
    }

    /*boxWidth: opt.boxWidth,//弹窗宽度
    boxHeight: opt.boxHeight,//正文窗体高度
    boxPosition: opt.boxPosition,//弹窗定位方式

    title: opt.title||'',//标题
    closeBtn: typeof opt.closeBtn==='undefined'?true:opt.closeBtn,//是否显示关闭按钮
    container: opt.container||document.body,//容器
    content: opt.content||'',//窗体正文
    footer: opt.footer||'',//自定义页脚内容
    footerType: opt.footerType||'none',//'none|mark|button' 预定义的页脚类型
    footerAlign: opt.footerAlign,//'left|center|right' 页脚对齐方式

    mark: opt.mark||'备注: 无',//备注

    button: opt.button||'single',//'single|couple'|html 预定义按钮或自定义内容
    btnType: opt.btnType||'input',//'input|a' 按钮元素(此功能暂不实现)
    sureBtnHandler: opt.sureBtnHandler,//确定按钮回调
    cancelBtnHandler: opt.cancelBtnHandler,//取消按钮回调
    closeBtnHandler: opt.closeBtnHandler,//关闭按钮回调

    model: opt.model||'dialog',//'dialog|message|loading' 弹窗类型
    draggable: typeof opt.draggable==='undefined'?false:opt.draggable,//拖拽
    showAnimation: opt.showAnimation,//弹窗动画
    hideAnimation: opt.hideAnimation,//关闭动画
    overlay: typeof opt.overlay==='undefined'?true:opt.overlay,//遮罩
    overlayType: opt.overlayType,//'grey|pure' 遮罩类型

    //message only
    stayTime: opt.stayTime||1800,//message自动退出的时间
    autoDestroy: opt.autoDestroy//是否自动销毁*/

    var map = {
        id: '弹窗id',
        skin: '皮肤',

        boxTop: '弹窗上边距',
        boxWidth: '弹窗宽度',
        boxHeight: '正文窗体高度',
        boxPosition: '弹窗定位方式',

        title: '标题',
        closeBtn: '是否显示关闭按钮',
        container: '容器',
        content: '窗体正文',
        footer: '自定义页脚内容',
        footerType: 'none|mark|button 预定义的页脚类型',
        footerAlign: 'left|center|right 页脚对齐方式',

        mark: '备注',

        button: 'single|couple|html 预定义按钮或自定义内容',
        btnType: 'input|a 按钮元素(此功能暂不实现)',
        sureBtnHandler: '确定按钮回调',
        cancelBtnHandler: '取消按钮回调',
        closeBtnHandler: '关闭按钮回调',

        model: 'dialog|message|loading 弹窗类型',
        draggable: '拖拽',
        showAnimation: '弹窗动画',
        hideAnimation: '关闭动画',
        overlay: '遮罩',
        overlayType: 'grey|pure 遮罩类型',

        //message only
        stayTime: 'message自动退出的时间',
        autoDestroy: '是否自动销毁'
    }

    var oAlt = new alt({
        id: "getAltCfg"
    });
    var cfg = oAlt.cfg;
    var oNav = document.getElementById('nav');
    var oNavList = oNav.getElementsByTagName('ul')[0];
    var oIntro = document.getElementById('intro');
    var oIntroList = oIntro.getElementsByTagName('ul')[0];
    var navHtml = '';
    var introHtml = '';
    var attr;
    for(attr in cfg){
        if(!map[attr]){
            navHtml += '<li>'+attr+'</li>';
        }else{
            navHtml += '<li><span class="u-tiptop">'+
                '<a class="target" href="#'+attr+'">'+attr+'</a>'+
                '<i class="info">'+map[attr]+'</i>'+
            '</span></li>';

            introHtml += '<li>'+
                '<h2 class="hd"><a class="tg" name="'+attr+'">&</a>'+attr+'</h2>'+
                '<div class="cnt">'+
                    '<div class="mean">释义：'+map[attr]+'</div>'+
                '</div>'+
            '</li>';
        }
    }
    oNavList.innerHTML = navHtml;
    oIntroList.innerHTML = introHtml;
    oAlt = null;

    var cfgStr = alt.toString();
    var startP = cfgStr.indexOf('/*config*/')+10;
    var endP = cfgStr.indexOf('/*!config*/');
    var str = cfgStr.slice(startP,endP);
    console.log(str);

})(window)