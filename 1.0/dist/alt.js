/* 
* @Author: jack
* @Date:   2015-05-21 18:43:10
* @Last Modified by:   jack
* @Last Modified time: 2015-06-07 18:30:32
*/

/*
* 可配置项：
* 全局的id id: "my_alt"
* 定位方式 position: "fixed|absolute"
* 遮罩层 overlay: true|false
* 提示文本 header: '提示'
* 正文 container: '正文'
* 高度 boxHeight: "200px"
* 宽度 boxWidth: "400px"
* 模式 model: "normal|confirm|decide|message|loading"
* 按钮类型 btnType: "button|a"
* 按钮文本 btnText: ['好的', '不了谢谢']
* 按钮行为 btnAction: function(btns){ do something... }
* 按钮对齐方式 btnAlign: "left|center|right"
* 自定义页脚内容 footer: "<input type='button' value='收藏'>"
* 拖拽 draggable: true|false
* 弹窗动画 showAnimation: function(alt){ do something... }
* 关闭动画 hideAnimation: function(alt){ do something... }
*/

'use strict';
(function (global) {
	var tools = {  //工具类
		cElm: function(tag){
			if(typeof tag === 'object'){  //对象
				var elm = document.createElement(tag.tag||'div');
				var attr;
				for(attr in tag){  //循环添加属性
					elm[attr] = tag[attr];
				}
			}else{  //字符串
				elm = document.createElement(tag||'div');
			}
			return elm;
		},
		setStyle: function(el, strCss){
			function endsWith(str, suffix) {
				var l = str.length - suffix.length;
				return l >= 0 && str.indexOf(suffix, l) == l;
			}
			var sty = el.style,
			cssText = sty.cssText;
			if(!endsWith(cssText, ';')){
				cssText += ';';
			}
			sty.cssText = cssText + strCss;
			return el;
		},
		addEvent: function(el, type, fn) {
			if (window.addEventListener) {
				el.addEventListener(type, fn, false);
				var ev = document.createEvent("HTMLEvents");
				ev.initEvent(type, false, false);
				if (!el["ev" + type]) {
					el["ev" + type] = ev;
				}
			} else if (window.attachEvent) {
				el.attachEvent("on" + type, fn);
				if (isNaN(el["cu" + type])) {
					// 自定义属性
					el["cu" + type] = 0;
				}
				var fnEv = function(event) {
					if (event.propertyName == "cu" + type) { fn.call(el); }
				};
				el.attachEvent("onpropertychange", fnEv);
				if (!el["ev" + type]) {
					el["ev" + type] = [fnEv];
				} else {
					el["ev" + type].push(fnEv);
				}
			}
			return this;
		},
		removeEvent: function(el, type, fn) {
			if (window.removeEventListener) {
				el.removeEventListener(type, fn, false);
			} else if (document.attachEvent) {
				el.detachEvent("on" + type, fn);
				var arrEv = el["ev" + type];
				if (arrEv instanceof Array) {
					for (var i=0; i<arrEv.length; i+=1) {
						el.detachEvent("onpropertychange", arrEv[i]);
					}
				}
			}
			return this;
		},
		drag: function(tapEl, dragEl){
			var lastX, lastY;
			var iSpeedX, iSpeedY;
			var disX, disY;
			var _this = this;
			tapEl.style.cursor = 'move';
			//不完善的拖拽功能
			tapEl.onmousedown = function(ev){
				var oEvent=ev||event;
				var disX=oEvent.clientX-dragEl.offsetLeft;
				var disY=oEvent.clientY-dragEl.offsetTop;

				document.onmousemove = moveHandler;
				document.onmouseup = upHandler;
				
				function moveHandler(ev){
					var oEvent=ev||event;
					
					var l=oEvent.clientX-disX;
					var t=oEvent.clientY-disY;
					
					dragEl.style.left=l+'px';
					dragEl.style.top=t+'px';
				};

				function upHandler(ev){
					document.onmousemove = null;
					document.onmouseup = null;
				};
			}
		}
	}

	var me = function (opt){
		this.cfg = {  //整合配置项
			id: opt.id||null,//弹窗id
			skin: opt.skin,//皮肤

			boxTop: opt.boxTop,//弹窗上边距
			boxWidth: opt.boxWidth,//弹窗宽度
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
			autoDestroy: opt.autoDestroy//是否自动销毁
		};
		this.handlers = {};
		switch(this.cfg.model){  //弹窗模式
			case 'message':
			msg(this);
			break;

			case 'loading':
			loading(this);
			break;

			default:
			dialog(this);
			break;
		}
	};
	me.prototype = {
		box: null,
		on: function (action, handler){
			//监听
			var handlers = this.handlers;
			if(!handlers[action]){
				handlers[action] = new Array;
			}
			this.handlers[action].push(handler);
		},
		fire: function (action, handler){
			//触发
			var handlers = this.handlers;
			if(!handlers[action]) return;
			for(var i = 0; i < handlers[action].length; i++){
				handlers[action][i]();
			}
		},
		render: function (){
			//渲染
		},
		crt: function (){
			//执行弹窗
			//console.log(this.cfg)
			var cfg = this.cfg;
			this.box = this.render();
			cfg.container.appendChild(this.box);
			this.fire('crt');
		},
		del: function (){
			//关闭弹窗并销毁
			this.box.parentNode.removeChild(this.box);
			this.fire('del');
			tools = null, t = null, me = null,
			dialog = null, msg = null, loading = null;
		}
	}
	var t = tools;

	var dialog = function (me){  //弹窗
		var cfg = me.cfg;
		var alt, mainBox, header, closeBtn, container, footer, overlay;
		var mark, buttons;
		me.render = function (){
			//渲染
			alt = t.cElm({  //窗体
				id: cfg.id,
				className: cfg.skin||'alt'
			});
			cfg.boxTop&&(function(){
				t.setStyle(alt,
					'top:'+cfg.boxTop+';'+
					'position:'+cfg.boxPosition
				);
			})();

			mainBox = t.cElm({  //主窗体
				className: 'main_box'
			});
			cfg.boxWidth&&(function(){
				t.setStyle(mainBox,
					'width:'+cfg.boxWidth+';'+
					'margin-left:-'+(parseInt(cfg.boxWidth)/2+1)+'px'//减去边框1px像素
				);
			})();

			header = t.cElm({  //窗体头部
				className: 'header',
				innerHTML: '<div>'+cfg.title+'</div>'
			});
			cfg.draggable&&t.drag(header, alt);

			if(cfg.closeBtn){
				closeBtn = t.cElm({  //关闭按钮
					tag: 'span',
					className: 'close_btn',
					innerHTML: '×',
					onclick: function (){
						cfg.closeBtnHandler&&cfg.closeBtnHandler();
						me.del();
					}
				});
				header.appendChild(closeBtn);
			}

			container = t.cElm({  //正文
				className: 'container',
				innerHTML: cfg.content
			});
			cfg.boxHeight&&(function(){
				t.setStyle(container, 'height:'+(parseInt(cfg.boxHeight)-26-10-30-10-2)+'px');
				//减去头部高度、内容框体padding、脚部高度、脚部padding、上下边框2px
			})();

			footer = t.cElm({  //窗体底栏
				className: 'footer'
			});
			if(cfg.footer == ''){
				switch(cfg.footerType){
					case 'none':
					break;

					case 'mark':
					mark = t.cElm({  //备注框体
						className: 'mark',
						innerHTML: cfg.mark
					});
					cfg.footerAlign&&(t.setStyle(mark, 'text-align:'+cfg.footerAlign));
					footer.appendChild(mark);
					break;

					case 'button':
					buttons = t.cElm({  //按钮框体
						className: 'button'
					});
					cfg.footerAlign&&(t.setStyle(buttons, 'text-align:'+cfg.footerAlign));
					var btns = cfg.button;
					//按钮
					if(btns == 'single'){  //单按钮
						var sureBtn = t.cElm({
							tag: 'input',
							type: 'button',
							className: 'btn sure',
							value: '确定',
							onclick: function (){
								cfg.sureBtnHandler&&cfg.sureBtnHandler();
								me.del();
							}
						});
						buttons.appendChild(sureBtn);
					}else if(btns == 'couple'){  //双按钮
						var sureBtn = t.cElm({
							tag: 'input',
							type: 'button',
							className: 'btn sure',
							value: '确定',
							onclick: function (){
								cfg.sureBtnHandler&&cfg.sureBtnHandler();
								me.del();
							}
						});
						var cancelBtn = t.cElm({
							tag: 'input',
							type: 'button',
							className: 'btn cancel',
							value: '取消',
							onclick: function (){
								cfg.cancelBtnHandler&&cfg.cancelBtnHandler();
								me.del();
							}
						});
						buttons.appendChild(sureBtn);
						buttons.appendChild(cancelBtn);
					}else{  //自定义内容
						buttons.innerHTML = btns;
					}
					footer.appendChild(buttons);
					break;
				}
			}else{
				footer.innerHTML = cfg.footer;
			}

			if(cfg.overlay){  //遮罩层
				var overlayClassName = '';
				if(cfg.overlayType){
					switch(cfg.overlayType){
						case 'grey':
						overlayClassName = 'alt_overlay';
						break;

						case 'pure':
						overlayClassName = 'alt_overlay_pure';
						break;
					}
				}else{
					overlayClassName = 'alt_overlay';
				}
				overlay = t.cElm({
					className: overlayClassName
				});
				alt.appendChild(overlay);
			}
			
			mainBox.appendChild(header);
			mainBox.appendChild(container);
			mainBox.appendChild(footer);
			alt.appendChild(mainBox);
			return alt;
		};
	};

	var msg = function (me){  //消息
		var cfg = me.cfg;
		var alt, mainBox, container, overlay;
		me.render = function (){
			//渲染
			alt = t.cElm({  //窗体
				id: cfg.id,
				className: cfg.skin||'alt_message'
			});
			cfg.boxTop&&(function(){
				t.setStyle(alt,
					'top:'+cfg.boxTop+';'+
					'position:'+cfg.boxPosition
				);
			})();

			mainBox = t.cElm({  //主窗体
				className: 'main_box'
			});
			cfg.boxWidth&&(function(){
				t.setStyle(mainBox,
					'width:'+cfg.boxWidth+';'+
					'margin-left:-'+(parseInt(cfg.boxWidth)/2+1)+'px'//减去边框1px像素
				);
			})();

			container = t.cElm({  //正文
				tag: 'span',
				className: 'container',
				innerHTML: cfg.content
			});
			cfg.boxHeight&&(function(){
				t.setStyle(container, 'height:'+(parseInt(cfg.boxHeight)-26-10-30-10-2)+'px');
				//减去头部高度、内容框体padding、脚部高度、脚部padding、上下边框2px
			})();

			if(cfg.overlay){  //遮罩层
				var overlayClassName = '';
				if(cfg.overlayType){
					switch(cfg.overlayType){
						case 'grey':
						overlayClassName = 'alt_overlay';
						break;

						case 'pure':
						overlayClassName = 'alt_overlay_pure';
						break;
					}
				}else{
					overlayClassName = 'alt_overlay_pure';
				}
				overlay = t.cElm({
					className: overlayClassName
				});
				alt.appendChild(overlay);
			}
			
			mainBox.appendChild(container);
			alt.appendChild(mainBox);
			return alt;
		};
		switch(cfg.autoDestroy){  //是否自动销毁
			case false:
			break;

			default:
			me.on('crt', function(){
				setTimeout(function(){
					me.del();
				}, cfg.stayTime);
			});
		}
		
	};

	var loading = function (me){  //加载
		var cfg = me.cfg;
		var alt, mainBox, container, overlay;
		me.render = function (){
			//渲染
			alt = t.cElm({  //窗体
				id: cfg.id,
				className: cfg.skin||'alt_loading'
			});
			cfg.boxTop&&(function(){
				t.setStyle(alt,
					'top:'+cfg.boxTop+';'+
					'position:'+cfg.boxPosition
				);
			})();

			mainBox = t.cElm({  //主窗体
				className: 'main_box'
			});
			cfg.boxWidth&&(function(){
				t.setStyle(mainBox,
					'width:'+cfg.boxWidth+';'+
					'margin-left:-'+(parseInt(cfg.boxWidth)/2+1)+'px'//减去边框1px像素
				);
			})();

			container = t.cElm({  //正文
				className: 'container'
			});
			cfg.boxHeight&&(function(){
				t.setStyle(container, 'height:'+(parseInt(cfg.boxHeight)-26-10-30-10-2)+'px');
				//减去头部高度、内容框体padding、脚部高度、脚部padding、上下边框2px
			})();

			if(cfg.overlay){  //遮罩层
				var overlayClassName = '';
				if(cfg.overlayType){
					switch(cfg.overlayType){
						case 'grey':
						overlayClassName = 'alt_overlay';
						break;

						case 'pure':
						overlayClassName = 'alt_overlay_pure';
						break;
					}
				}else{
					overlayClassName = 'alt_overlay_pure';
				}
				overlay = t.cElm({
					className: overlayClassName
				});
				alt.appendChild(overlay);
			}
			
			mainBox.appendChild(container);
			alt.appendChild(mainBox);
			return alt;
		};
	};

	global.alt = me;
})(window);