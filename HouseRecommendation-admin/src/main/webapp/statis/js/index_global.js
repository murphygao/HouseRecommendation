/**
 * Created by 荣耀 on 2016/7/18.
 */

$(document).ready(function () {

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
            //$this.find('i.gl-icon-right').removeClass('gl-icon-rotate-up').addClass('gl-icon-rotate-down');
            $this.find('i.gl-icon-right').css('transform', 'rotate(180deg)');
            $this.attr('data-toggle', 'false');
        } else {
            // $this.find('i.gl-icon-right').removeClass('gl-icon-rotate-down').addClass('gl-icon-rotate-up');
            $this.find('i.gl-icon-right').css('transform', 'rotate(0deg)');
            $this.attr('data-toggle', 'true');
        }

        $(this).parent().find('dd').slideToggle();
    });
    
    //菜单点击事件
    $('#meun-group dd a').click(function (e) {
        
        var targetPage = $(this).attr('data-target') || "";
        console.log("targetPage: " + targetPage);
        
        if(targetPage !== "") {
        	getPage(targetPage);
        }
    });
});

/**
 * 事件触发流程：
 * 1、全局getPage()函数(按钮事件)     -->  beforeLoad函数     -->  闭包loadData函数
 * 2、onload事件(刷新按钮)  -->   闭包loadData函数
 * 3、onpopstate事件(前进/后退按钮)  -->   闭包loadData函数
 */

/**
 * 闭包函数，限制变量作用范围，防止变量污染（主要是限制xhr变量作用域）
 * 执行效率更高
 * @param {Object} window 全局对象
 */
(function(window) {

    //保存xhr操作对象，每当有新的ajax请求时，检测是否存在ajax阻塞
    var xhr;

    var loadData = function(target) {

        //如果存在ajax请求，就终止请求
        if(xhr) {
            xhr.abort();
        }

        xhr = $.ajax({
            type: "GET",
            url: "redirect",
            data: {page: target},
            dataType: "html",
            cache: false,
            success: function (data, status, xhr) {
                $('#content').html(data);
            }
        });

    };
    
    window.beforeLoad =  function(e) {
        e && console.log("history state：" + e.state);

        //获取url请求参数
        var param = window.location.search;
        if(param) {
            param = param.substr(param.lastIndexOf('=') + 1);
        }
        console.log("window.location.search: " + param);

        if(param !== 'index') {
        	//执行ajax请求
            loadData(param);
        }
        
    };

    //刷新按钮触发、历史记录状态事件监听
    window.onload = window.onpopstate = beforeLoad;
})(window);

/**
 * 全局hit函数定义
 * @param {Object} target       目标页面
 */
function getPage(target) {
    //每次ajax请求发起之前，都把请求信息压栈到history对象中
    //同时更新地址栏url
    //此时并不会马上触发onpopstate事件
    history.pushState({key: target}, "", '?page=' + target);
    console.log("target: " + target);
    beforeLoad();
};


/*function getRootPath(){
    //获取当前网址，如： http://localhost/Project/lry/join?param=login
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： Project/lry/join?param=login
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:80
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/Project
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return(localhostPaht+projectName) + '/';
}*/
