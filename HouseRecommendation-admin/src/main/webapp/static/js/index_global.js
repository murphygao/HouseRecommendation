/**
 * Created by 荣耀 on 2017/4/18.
 */

/* 全局插件参数配置 */
$(document).ready(function () {

	layer.config({
		extend:'skin/moon/style.css'
	});
	
	/*window.paceOptions = {
		  ajax: true
	};*/
	
    /** 滚动条插件初始化 */
    $('#meun').mCustomScrollbar({
        scrollbarPosition: "inside",
        autoHideScrollbar: true,
        theme: "light-3"
    });
    $('#scroll-box').mCustomScrollbar({
        scrollbarPosition: "inside",
        autoHideScrollbar: true,
        theme: "light-3"
    });
    
    /** 菜单栏事件设置 */
    var meunBox = $('#meun-group');
    meunBox.find('dd').hide();

    //点击dt show hide事件
    meunBox.find('dt').on('click', function () {
    	
        var $this = $(this);
        if ($this.attr('data-toggle') == 'true') {
        	
        	//图标旋转
            $this.find('i.gl-icon-right').css('transform', 'rotate(180deg)');
            //图标旋转状态
            $this.attr('data-toggle', 'false');
            
        } else {
        	//图标旋转
            $this.find('i.gl-icon-right').css('transform', 'rotate(0)');
            //图标旋转状态
            $this.attr('data-toggle', 'true');
        }
        //
        meunBox.find('dt a').removeClass('gl-dt-active');
        $(this).find('a').addClass('gl-dt-active');
        
        $(this).parent().find('dd').slideToggle();
    });
    
    //加载用户登录信息
    $.ajax({
    	url: 'login',
    	data: {operate: 'userInfo'},
    	dataType: 'json',
    	success: function(data){
    		if(data) {
    			$('#gl-user-name').text(data.userName);
    			var role = ["系统管理员","客服人员","配送管理员","调度管理员","分站管理员","中心库房管理员","配送员","会计"];
    			$('#gl-user-type').text(role[data.userRole]);
    			
    			//缓存用户信息
    			window.sessionStorage && window.sessionStorage.setItem('user', JSON.stringify(data));
    			
    		}else {
    			layer.msg('加载用户信息错误', {icon: 5});
    		}
    	},
    	error: function(){
    		layer.msg('加载用户信息错误', {icon: 5});
    	}
    });
    
    //用户修改密码事件
    $('#gl-user-modify').click(function(){
    	layer.open({
	  	    type: 2,
	  	    title: false,
	  	    area: ['400px', '370px'],
	  	    /*skin: 'layui-layer-rim', //加上边框*/
	  	    content: [getBaseURI() + '/redirect?page=modify', 'no']
      	});
    });
    
    //用户注销事件
    $('#gl-user-logout').click(function(){
    	layer.msg(
    			'你他妈的确定注销了吗？',
    			{
    				icon: 6, 
    				title:'蠢货专用提示',
    				time: false,
    				shade: [0.3, '#393D49'],
    				btn:['就注了能咋的', '蠢了，再想想'],
    				closeBtn: 1,
    				skin:'layer-ext-moon',
    				yes:function(index){
        				window.location.href = getBaseURI() + '/login?operate=logout';
        			},
        			btn2: function(index){
        				layer.msg('蠢货！！', {icon: 6,time: 2000});
        			},
        			cancel: function(index){
        				layer.msg('蠢货！！', {icon: 6,time: 2000});
        			}
    			});
    });
    
    //菜单点击事件
    $('#meun-group dd a').click(function (e) {
        
    	//active样式
        meunBox.find('dd a').removeClass('gl-dd-active');
        $(this).addClass('gl-dd-active');
    	
        var targetPage = $(this).attr('data-target') || "";
        console.log("targetPage: " + targetPage);
        
        if(targetPage !== "") {
        	//getPage(targetPage);
        }
    });
});

/**
 * 事件触发流程：
 * 1、全局getPage()函数(路由入口)     -->  beforeLoad函数     -->  闭包loadData函数
 * 2、onload事件(刷新按钮)  -->   闭包loadData函数
 * 3、onpopstate事件(前进/后退按钮)  -->   闭包loadData函数
 */

/**
 * 闭包函数，限制变量作用范围，防止变量污染（主要是限制xhr变量作用域）
 * 执行效率更高
 * @param {Object} Glory 	自定义全局对象
 * @param {Object} win	    全局对象
 * @param {Object} $ 		jQuery全局对象
 */
var Glory = {};
(function(Glory, win, $) {

    //保存xhr操作对象，每当有新的ajax请求时，检测是否存在ajax阻塞
    Glory.xhr = null;

    //加载model
    function _loadData(target) {

        //如果存在ajax请求，就终止请求
        if(Glory.xhr) {
        	Glory.xhr.abort();
        }

        //获取sessionID
        var sessionId = getJSessionID();
        
        Glory.xhr = $.ajax({
            type: "GET",
            url: "redirect",
            data: {page: target, JSESSIONID: sessionId},
            dataType: "html",
            cache: false,
            success: function (data, status, xhr) {
                $('#content').html(data);
            }
        });
    };
    
    //获取URL中的page参数
    function _getTarget() {
    	
    	console.log("win.location.search: " + param);
    	//获取url请求参数
        var param = win.location.search.substring(1);
        if(param) {
        	param = param.indexOf('&') != -1 ?
                    param.substring(5, param.indexOf('&')):
                    param.substr(param.lastIndexOf('=') + 1);
        }
        console.log("param: " + param);
        
        return param;
    } 
    
    Glory.beforeLoad =  function(e) {

    	//保存当前目标内容索引
    	var target = _getTarget();
        win.sessionStorage.setItem('currentTarget', target);
        if(target !== 'index') {
        	//执行ajax请求
            _loadData(target);
        }
        
    };

    //历史记录状态事件监听
    win.onpopstate = Glory.beforeLoad;
    
    //刷新事件绑定
    win.onload = function (e) {
         
         //刷新操作之后加载当前model
    	 getPage(_getTarget());
    };
    
})(Glory, window, jQuery);




/**
 * 全局加载model函数定义
 * @param {Object} target       目标页面
 * @param {Object} id       	目标item的id值
 */
function getPage(target, id) {
	/**
	 * 每次ajax请求发起之前，都把请求信息压栈到history对象中
	 * 同时更新地址栏url
	 * 此时并不会马上触发onpopstate事件
	 * 保存当前目标内容索引
	 */
	
	//缓存操作目标item的id
	if(id) {
        window.sessionStorage.setItem('itemID', id);
    }
	
	//保存当前model索引
    window.sessionStorage.setItem('currentTarget', target);
	//加载历史压栈
    history.pushState({page: target, JSESSIONID: getJSessionID()}, "", 
    					'?page=' + target + 
			    		'&reload=true' + '&JSESSIONID=' + getJSessionID());
    //'&JSESSIONID=' + getJSessionID()
    
    //加载数据
    Glory.beforeLoad();
};

/**
 * 获取sessionStorage中缓存的sessionID
 * @returns
 */
function getJSessionID() {
	
	var jsession;

    //通过sessionStorage获取sessionId
    /*window.localStorage && window.localStorage.getItem('JSESSIONID') ||*/
	jsession = window.sessionStorage && window.sessionStorage.getItem('JSESSIONID');

    if(!jsession) {
    	//是时候做点什么了...
    }
    
    return jsession || '';
}

/**
 * 获取基本路径
 * @returns
 */
function getBaseURI(){
	
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
}


