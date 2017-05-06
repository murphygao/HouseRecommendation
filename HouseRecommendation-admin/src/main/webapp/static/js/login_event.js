/**
 * Created by 荣耀 on 2017/4/19.
 */

var Glory = {};

/**
 * 初始化Glory对象内容
 */
(function (Glory, win) {

    var doc  = win.document;

    /**
     *
     * @param fn
     */
    Glory.ready = function(fn) {

        if (doc.addEventListener) {

            //标准浏览器
            doc.addEventListener('DOMContentLoaded', function () {

                //注销事件，避免反复触发
                doc.removeEventListener('DOMContentLoaded', arguments.callee, false);

                //执行事件函数
                fn();
            }, false);

        } else if (doc.attachEvent) {

            //IE浏览器
            doc.attachEvent('onreadystatechange', function () {

                if (doc.readyState == 'complete') {

                    doc.detachEvent('onreadystatechange', arguments.callee);

                    //执行事件函数
                    fn();
                }
            });
        }
    };

    /**
     * @function 	                document.getElementById(id)封装
     * @param       id	            DOM元素的id属性
     */
    Glory.getNode = function (id) {

        return doc.getElementById(id);
    };

    /**
     * @function 	                 document.querySelectorAll封装
     * @param       key 	         查询字符串
     */
     Glory.getNodeList = function (key) {

        return doc.querySelectorAll(key);
     };

    /**
     * 清除文本节点
     * @param node
     * @returns {*}
     */
    Glory.clearTextNode = function (node) {

        var child = node.childNodes;

        for(var i = 0, len = child.length; i < len; i++) {

            if(child[i].nodeName == "#text" && !/\s/.test(child[i].nodeValue)) {
                node.removeChild(child[i]);
            }
        }

        return node;
    };

    /**
     * 给dom节点添加css类
     * @param   node                    操作节点
     * @param   className               类名
     * @returns {{}}                    返回Glory全局对象，便于链式操作
     */
    Glory.addClass = function (node, className) {

        node.className += ' ' + className;

        return Glory;
    };

    /**
     * 给dom节点移除css类
     * @param   node                    操作节点
     * @param   className               类名
     * @returns {{}}                    返回Glory全局对象，便于链式操作
     */
    Glory.removeClass = function (node, className) {

        node.className = node.className.replace(' ' + className, '');

        return Glory;
    };

    /**
     * 设置dom节点css类
     * @param   node                    操作节点
     * @param   classes                 类名集合
     * @returns {{}}                    返回Glory全局对象，便于链式操作
     */
    Glory.setClass = function (node, classes) {

        node.className = classes;

        return Glory;
    };

    /**
     * 设置dom节点属性
     */
    Glory.attr = function (node, attrName, attrValue) {

        if(!node || !attrName) {
            return;
        }

        if(attrValue) {

            node[attrName] ?
                node[attrName] = attrValue :
                node.setAttribute(attrName, attrValue);
            return Glory;
        }

        return node[attrName] ? node[attrName] : node.getAttribute(attrName);

    };

    /**
     * 移除dom节点属性
     * @param   node
     * @param   attrName
     * @returns {{}}
     */
    Glory.removeAttr = function (node, attrName) {

        if(!node || !attrName) {
            return;
        }

        node.removeAttribute(attrName);

        return Glory;
    };

     /**
     *  绑定事件函数
     *	@param       obj  		      绑定目标对象
     *	@param       eventType	      监听事件
     *	@param       handler		  绑定的事件处理方法
     *	@param       isPropagation	  冒泡方法 默认false：子节点 --> 父节点冒泡	、true：父节点 --> 子节点冒泡
     */
     Glory.eventListener = function (obj, eventType, handler, isPropagation) {

          if(!obj || !eventType || !handler) {
              return;
          }

         //Propagation初始化
         isPropagation = isPropagation || false;

         //绑定事件到多个对象，递归调用
         if(obj instanceof Array) {

             for(var i = 0, len = obj.length; i < len; i++) {

                 Glory.eventListener(obj[i], eventType, handler, isPropagation);
             }

             //绑定操作结束
             return;
         }

         //绑定多个事件，递归调用
         if(eventType instanceof Array) {

             for(i = 0, len = eventType.length; i < len; i++) {

                 Glory.eventListener(obj, eventType[i], handler, isPropagation);
             }

         }

         //事件绑定完成，结束绑定操作
         if(eventType instanceof Array) {
             return;
         }

         //标准事件绑定
         if(obj.addEventListener) {

             obj.addEventListener(eventType, handler, isPropagation);

         //IE事件绑定
         }else if(obj.attachEvent) {

             obj.attachEvent('on' + eventType, handler);

         //最原始事件绑定
         }else {

             obj['on' + eventType] = handler;
         }
     };

     /**
      * @function		                  事件源操作绑定
      * @param       event	              事件源
      * @param       handler		      提取事件源对象之后执行的回调
      */
     Glory.eventHandler = function(event, handler) {

        //获取事件源
        event = event ? event : win.event;

        //获取事件源触发对象    注：event.target不支持IE浏览器
        var eventObj = event.srcElement ? event.srcElement : event.target;

        //执行事件函数
         handler(eventObj, event);
     };

     /**
     *	@function 		                    阻止事件冒泡
     * 	@param	    event               	事件源
     */
     Glory.stopPropagation = function(event) {

        //标准W3C阻止冒泡方法
        if(event.stopPropagation) {
            event.stopPropagation();

            //IE阻止事件冒泡方法
        } else {
            event.cancelBubble = true;
        }
    };

    /**
     * 获取当前URL基本路径
     * @returns {string}
     */
    Glory.getBaseURL = function () {

        //获取当前网址，如： http://localhost/SSCS_4/lry/join?param=login
        var curWwwPath = window.document.location.href;

        //获取主机地址之后的目录，如： SSCS_4/lry/join?param=login
        var pathName = window.document.location.pathname;

        var pos = curWwwPath.indexOf(pathName);

        //获取主机地址，如： http://localhost:80
        var localhostPath = curWwwPath.substring(0, pos);

        //获取带"/"的项目名，如：/SSCS_4
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);

        return(localhostPath + projectName);
    };
    
    //内置ajax框架
    Glory.ajax = win.ajax;



})(Glory, window);


/**----------------------------业务逻辑-----------------------------*/


/**
 * dom加载完毕，执行初始化操作
 */
Glory.ready(function () {

    //禁用登录按钮
    Glory.attr(Glory.getNode('login-btn'), 'disabled', 'disabled');

    //input、focus、blur事件委托实现，把事件绑定到form表单元素，然后向子元素冒泡
    Glory.eventListener(Glory.getNode('login-form'),
                        ['input', 'focus', 'blur'], function (e) {

        //console.log(e.type);

        //事件处理器
        Glory.eventHandler(e, function (obj, event) {

            switch(event.type) {

                case 'input':
                    //input事件处理
                    inputHandler(obj);
                    //登录权限检测
                    loginCheck();
                break;

                case 'focus':
                    //focus事件处理
                    focusHandler(obj);
                break;

                case 'blur':
                    //blur事件处理
                    blurHandler(obj);
                break;
            }

            //阻止事件继续冒泡
            Glory.stopPropagation(event);
        });

    }, true);

    //keydoen回车键事件处理
    Glory.eventListener(window, 'keydown', function (e) {
        Glory.eventHandler(e, function (obj, event) {
           if(event.keyCode == 13) {
               if(Glory.attr(Glory.getNode('gl-user'), 'data-verify') == 'true' &&
                   Glory.attr(Glory.getNode('gl-pwd'), 'data-verify') == 'true') {

                   //执行登录事件
                   clickHandler();
               }
           }

            //阻止事件继续冒泡
            Glory.stopPropagation(event);
        });
    });

    //按钮点击事件
    Glory.eventListener(Glory.getNode('login-btn'), 'click', function (e) {

        Glory.eventHandler(e, function (obj, event) {

            //执行登录事件
            clickHandler();

            //阻止事件继续冒泡
            Glory.stopPropagation(event);
        });
    });

    /**
     * input处理器
     * @param   obj                 事件源对象
     * @param   checkedNode         检验结果反馈节点
     */
    function inputHandler(obj, checkedNode) {

            //console.log(obj.type);

            checkedNode = obj.nextSibling.nextSibling;
            var iconNode = obj.previousSibling.previousSibling;

            if(obj.value.length === 0) {
                Glory.setClass(obj, 'panel-item-input input-focus');
                Glory.setClass(checkedNode, 'icon icon-checked');
                Glory.setClass(iconNode, 'icon gl-icon-default ' +
                    (obj.type == 'text' ? 'icon-user icon-user-1' : 'icon-pwd icon-lock-1'));
                Glory.attr(obj, 'data-verify', 'false');

            }else if((obj.type == 'password' &&!obj.value.match(/^([a-zA-Z0-9]|[!@#$%^&*()_+=]){6,12}$/)) ||
                     (obj.type == 'text' && !obj.value.match(/^([\u4e00-\u9fa5]|[a-zA-Z0-9_]){2,12}$/))) {
                Glory.setClass(obj, 'panel-item-input input-warning');
                Glory.setClass(checkedNode, 'icon icon-checked gl-icon-warning icon-attention-circled');
                Glory.setClass(iconNode, 'icon gl-icon-warning ' +
                               (obj.type == 'text' ? "icon-user icon-user-1" : "icon-pwd icon-lock-1"));
                Glory.attr(obj, 'data-verify', 'false');

            }else {
                Glory.setClass(obj, 'panel-item-input input-success');
                Glory.setClass(checkedNode, 'icon icon-checked gl-icon-success icon-ok-circled');
                Glory.setClass(iconNode, 'icon gl-icon-success ' +
                    (obj.type == 'text' ? "icon-user icon-user-1" : "icon-pwd icon-lock-1"));
                Glory.attr(obj, 'data-verify', 'true');
            }
    }

    /**
     * focus处理器
     * @param   obj                 事件源对象
     */
    function focusHandler(obj) {

        if(obj.className == 'panel-item-input'){
            Glory.addClass(obj, 'input-focus');
            Glory.addClass(obj.previousSibling.previousSibling, 'gl-icon-focus');
        }
    }

    /**
     * blur处理器
     * @param   obj                 事件源对象
     */
    function blurHandler(obj) {

        if(obj.className == 'panel-item-input input-focus') {
            Glory.removeClass(obj, 'input-focus');
            Glory.removeClass(obj.previousSibling.previousSibling, 'gl-icon-focus');
        }
    }

    /**
     * 登录权限校验
     */
    function loginCheck() {
        if(Glory.attr(Glory.getNode('gl-user'), 'data-verify') == 'true' &&
            Glory.attr(Glory.getNode('gl-pwd'), 'data-verify') == 'true') {

            Glory.setClass(Glory.getNode('login-sign'), 'icon-btn icon-lock icon-login');
            Glory.setClass(Glory.getNode('login-btn'), 'panel-item-btn btn-success');
            Glory.removeAttr(Glory.getNode('login-btn'), 'disabled');

        }else {
            Glory.setClass(Glory.getNode('login-sign'), 'icon-btn icon-lock icon-block-1');
            Glory.setClass(Glory.getNode('login-btn'), 'panel-item-btn btn-default');
            Glory.attr(Glory.getNode('login-btn'), 'disabled', 'disabled');
        }
    }

    //保存xhr操作对象，每当有新的ajax请求时，检测是否存在ajax阻塞
    var xhr;

    /**
     * 登录事件
     * @param obj
     */
    function clickHandler() {

	   var btn  = Glory.getNode('login-btn'),
	       icon = Glory.getNode('login-sign'),
	       nIpt = Glory.getNode('gl-user'),
	       pIpt = Glory.getNode('gl-pwd');

	   //锁定按钮
        Glory.setClass(icon, 'icon-btn icon-spin4 animate-spin');
        Glory.setClass(btn, 'panel-item-btn btn-default');
        Glory.attr(btn, 'disabled', 'disabled');

        //如果存在ajax请求，就终止请求
        if(xhr) {
            xhr.abort();
        }

       xhr = ajax().before(function(xhr){
            xhr.onabort = function(){
                console.log('请求被终止');
            }
       		}).post(Glory.getBaseURL() + '/loginValid', {name: nIpt.value, password: pIpt.value})
	        .success(function(data){
	        	console.log(data);

	        	//登录成功
	        	 if(data.result == true) {
	        		 //保存当前目标内容索引
	        		 window.sessionStorage && window.sessionStorage.setItem('currentTarget', 'index');
	        		 window.sessionStorage && window.sessionStorage.setItem('JSESSIONID', data.sessionId);
	        		 
	        		 //跳转到首页
	        		 window.location.href = Glory.getBaseURL() + '/view/index?JSESSIONID=' + data.sessionId;
	                 
	             //登录失败
	             } else {
	                 //按钮样式还原
	                 Glory.setClass(icon, 'icon-btn icon-block-1');
	                 Glory.setClass(btn, 'panel-item-btn btn-default');
	                 
	                 //用户名错误提示
	                 if(data.resultCode === 'login-1000' ||
                         data.resultCode === 'login-1001' ||
                         data.resultCode === 'login-1005') {
	                	 Glory.setClass(nIpt, 'panel-item-input input-error');
	                     Glory.setClass(nIpt.nextSibling.nextSibling, 'icon icon-checked gl-icon-error icon-cancel-circled');
	                     Glory.setClass(nIpt.previousSibling.previousSibling, 'icon gl-icon-error icon-user icon-user-1');
	                     Glory.attr(nIpt, 'data-verify', 'false');
	                 }
	
	                 //密码错误提示
	                 if(data.resultCode === 'login-1002' ||
                         data.resultCode === 'login-1003' ||
                         data.resultCode === 'login-1004') {
	                	 Glory.setClass(pIpt, 'panel-item-input input-error');
	                     Glory.setClass(pIpt.nextSibling.nextSibling, 'icon icon-checked gl-icon-error icon-cancel-circled');
	                     Glory.setClass(pIpt.previousSibling.previousSibling, 'icon gl-icon-error icon-pwd icon-lock-1');
	                     Glory.attr(pIpt, 'data-verify', 'false');
	                 }
	             }

	        //请求发生未知错误
            }).error(function(xhr){
                alert('艹，请求发生未知错误!');
                Glory.setClass(icon, 'icon-btn icon-login');
                Glory.setClass(btn, 'panel-item-btn btn-success');
                Glory.removeAttr(btn, 'disabled');

            //请求超时
            }).timeout(10000, function(){
            	 Glory.setClass(icon, 'icon-btn icon-login');
                 Glory.setClass(btn, 'panel-item-btn btn-success');
                 Glory.removeAttr(btn, 'disabled');
            });
    }
});
