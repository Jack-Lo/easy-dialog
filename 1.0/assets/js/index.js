/* 
* @Author: jack
* @Date:   2015-08-01 10:45:51
* @Last Modified by:   jack
* @Last Modified time: 2015-08-01 10:46:44
*/

'use strict';
//执行示例代码
var cnt = document.getElementById('demo').getElementsByTagName('pre')[0];
var code = document.getElementById('demo_code').innerHTML;
cnt.innerHTML = code;

//配置项展示
var cfgStr = alt.toString();
var startP = cfgStr.indexOf('/*>>>config<<<*/');
var endP = cfgStr.indexOf('/*>>>!config<<<*/');
var str = 'cfg = {'+
cfgStr.slice(startP+16,endP);
str = str.replace(/\t\t\t/g, '    ');
str += '\n'+'}';
document.getElementById('cfg').getElementsByTagName('pre')[0].innerHTML = str;