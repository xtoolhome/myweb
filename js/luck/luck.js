/*
 @ Name：luck弹层组件-mobile
 @ Author：前端老徐
 @ Date：2015/5/12
 @ Email：442413729@qq.com
 @ Weibo:http://weibo.com/qdlaoxu
 @ Address:http://www.loveqiao.com/
*/
!function(a) {
    "use strict";
    var c = document, delay = null, flag = null;
    //主程序
    a.luck = {
        view:function(opt) {
            //主框架
            var luck = c.createElement("div");
            luck.className = "luck";
            luck.id = "luck";
            var oTable = c.createElement("div");
            oTable.className = "luck-table";
            var oCell = c.createElement("div");
            oCell.className = "luck-table-cell";
            var oChild = c.createElement("div");
            oChild.className = "luck-child";
            if (opt.style) {
                oChild.setAttribute("style", opt.style);
            }
            var oShade = c.createElement("div");
            oShade.className = "luck-shade";
            //遮罩层点击操作
            if (opt.shadeClose) {
                oShade.onclick = function() {
                    a.luck.close();
                };
            }
            // 外层点击操作
            if (opt.shadeWrapClose) {
                luck.onclick = function() {
                    a.luck.close();
                };
            }
            //自定义层
            if (opt.type == 1) {
                oChild.innerHTML = opt.content;
                oCell.appendChild(oChild);
                oTable.appendChild(oCell);
                luck.appendChild(oTable);
                luck.appendChild(oShade);
                return luck;
            }
            //标题	
            if (opt.title) {
                var oTit = c.createElement("h3");
                oTit.className = "luck-title";
                oTit.innerHTML = opt.title[0];
                // var oBtn = c.createElement("button");
                // oBtn.innerHTML = "×";
                // oBtn.addEventListener("click", function() {
                //     a.luck.close();
                // });
                if (opt.title[1]) {
                    oTit.setAttribute("style", opt.title[1]);
                }
                // oTit.appendChild(oBtn);
                oChild.appendChild(oTit);
            }
            //内容
            var oCon = c.createElement("div");
            oCon.className = "luck-con";
            oCon.innerHTML = opt.content ? opt.content :'<a href="http://www.loveqiao.com/dom/js/luck">luck弹层组件</a>';
            oChild.appendChild(oCon);
            //按钮
            if ("yes" in opt || "no" in opt) {
                var oBox = c.createElement("div"), btn = "";
                oBox.className = "luck-btn-box";
                if ("no" in opt) {
                    var oNo = c.createElement("span");
                    oNo.className = "no";
                    if (opt.btn && opt.btn[1]) {
                        oNo.innerHTML = opt.btn[0];
                    } else {
                        oNo.innerHTML = "取消";
                    }
                    oNo.onclick = function() {
                        opt.no();
                    };
                    oBox.appendChild(oNo);
                }
                if ("yes" in opt) {
                    var oYes = c.createElement("span");
                    oYes.className = "yes";
                    if (opt.btn && opt.btn[0]) {
                        oYes.innerHTML = opt.btn[1];
                    } else {
                        oYes.innerHTML = "确定";
                    }
                    oYes.onclick = function() {
                        opt.yes();
                    };
                    oBox.appendChild(oYes);
                }
                oChild.appendChild(oBox);
            }
            //组合框架
            oCell.appendChild(oChild);
            oTable.appendChild(oCell);
            luck.appendChild(oTable);
            luck.appendChild(oShade);
            return luck;
        },
        open:function(options) {
            if (flag) {
                a.luck.close();
            }
            flag = true;
            c.body.appendChild(luck.view(options));
            //定时关闭
            if (options.time) {
                delay = setTimeout(function() {
                    a.luck.close();
                }, options.time);
            }
        },
        close:function() {
            flag = false;
            if (delay) {
                clearTimeout(delay);
            }
            var obj = document.getElementById("luck");
            c.body.removeChild(obj);
        }
    };
	var style='';
	function getStyle(){
		var obj=null,len=document.scripts.length,str='';
		for(var i=0;i<len;i++){
			obj=document.scripts[i];
			if(obj.src.indexOf('luck.js')>=0){
				str=obj.src
				break
			}
		}
		return str.split('luck.js')[0]+'luck.css';
	}
	document.head.appendChild(function(){
		var a=c.createElement("link");
		a.href=style?style:getStyle(),a.type="text/css",a.rel="styleSheet",a.id="luckcss";return a
	}())
}(window);
