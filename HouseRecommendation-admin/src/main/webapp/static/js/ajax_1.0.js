/*
 * @Date：2015-12-23
 * @copyright：Glory
 * 
 * ajax操作封装，链式调用实现
 * version 1.0
 */

/**
 * 对ajax操作进行封装，以方便使用
 * 未经过严格测试
 */
(function(win) {
	
	/**
	 * 初始化一个对象，用来发起ajax请求
	 * @param {Object} options 参数键值对象
	 */
	win.ajax = function(options) {
		
		//默认参数
		var defaultOptions = {
			async: true,
			cache: false
		};
		
		options = extend(defaultOptions, options);
		
		//核心功能对象，包含了xhr并实现了需求中各个方法和属性
		var _obj = {
			xhr: createXhr(),	//xhr对象
			successCallbacks: [],
			errorCallbacks: [],
			alwaysCallbacks: [],
			options: options
		};
		
		/**
		 * 设置前置处理方法
		 * @param {Object} callback	回调函数
		 */
		_obj.before = function(callback) {
			
			//callback必须为函数才能够被调用
			typeof(callback) === 'function' && callback(_obj.xhr);
			
			//为了支持链式操作，将原对象返回
			return _obj;
		};
		
		/**
		 * 设置单个请求头
		 * header方法必须在GET | POST方法之前执行，否则请求已经发出在设置header没有意义
		 * @param {Object} name	请求参数名
		 * @param {Object} value 请求参数值
		 */
		_obj.header = function(name, value) {
			_obj.xhr.setRequestHeader(name, value);
			return _obj;
		};
		
		/**
		 * 设置多个请求头
		 * @param {Object} headers 请求头键值对象
		 */
		_obj.headers = function(headers) {
			if(Object.prototype.toString.call(headers) === '[object Object]') {
				for(var name in headers) {
					_obj.xhr.setRequestHeader(name, headers[name]);
				}
			}
			
			return _obj;
		};
		
		/**
		 * ajax求情成功时的回调方法
		 * @param {Object} callback 回调函数
		 * @param {Object} jsonForceValidate 强制校验json数据格式开关
		 */
		_obj.success = function(callback, jsonForceValidate) {
			
			//首先设置json数据格式的校验开关
			_obj.jsonForceValidate = jsonForceValidate;
			
			//callback必须是函数才能被调用
			if(typeof(callback) === 'function') {
				_obj.successCallbacks.push(callback);
			}
			
			return _obj;
		};
		
		/**
		 * 失败时的回调
		 * @param {Object} callback 回调函数
		 */
		_obj.error = function(callback) {
			if(typeof(callback) === 'function') {
				_obj.errorCallbacks.push(callback);
			}
			
			return _obj;
		};
		
		/**
		 * 不管请求是否成功都会调用的方法
		 * @param {Object} callback 回调函数
		 */
		_obj.always = function(callback) {
			
			//callback必须是函数
			if(typeof(callback) === 'function') {
				_obj.alwaysCallbacks.push(callback);
			}
			
			return _obj;
		};
		
		/**
		 *设置超时时间，并绑定超时回调
		 * @param {Object} timeout 超时时间
		 * @param {Object} callback 回调函数
		 */
		_obj.timeout = function(timeout, callback) {
			_obj.xhr.timeout = timeout;
			
			if(typeof(callback) === 'function') {
				_obj.xhr.ontimeout = function() {
					callback(_obj.xhr);
				}
			}
			
			return _obj;
		};
		
		/**
		 * 终止当前ajax请求
		 */
		_obj.abort = function() {
			_obj.xhr.abort();
			return _obj;
		};
		
		/**
		 * GET请求方式
		 * @param {Object} url
		 * @param {Object} data
		 */
		_obj.get = function(url, data) {
			
			//判断url不能为空
			if(typeof(url) === 'undefined') {
				throw 'url 不能为空！';
			}
			
			//数据必须一个对象
			if(Object.prototype.toString.call(data) !== '[object Object]'){
				data = undefined;
			}
			
			doAjax(_obj, 'get', url,  data, 'urlencoded');
			
			return _obj;
		};
		
		/**
		 * PSOT请求方式
		 * @param {Object} url
		 * @param {Object} data
		 * @param {Object} contentType
		 */
		_obj.post = function(url, data, contentType) {
			
			//判断url不能为空
			if(typeof(url) === 'undefined') {
				throw 'url 不能为空！';
			}
			
			//数据必须一个对象
			if(Object.prototype.toString.call(data) !== '[object Object]'){
				data = undefined;
			}
			
			//contentType必须是字符串
			if(typeof(contentType) !== 'string') {
				contentType = 'urlencoded';
			}
			
			//调用ajax执行方法
			doAjax(_obj, 'post', url, data, contentType);
			
			return _obj;
		};
		
		return _obj;
	};
	
	/**
	 * 数据编码、请求头处理、发送请求操作
	 * @param {Object} _obj [内部对象]
	 * @param {Object} method 请求方式
	 * @param {Object} url 请求url
	 * @param {Object} data 数据
	 * @param {Object} contentType 数据编码类型
	 */
	function doAjax(_obj, method, url, data, contentType) {
		
		var xhr = _obj.xhr;
		
		//编码数据对象
		data = encodeData(data, contentType);
		
		//判断是否使用缓存
		if(!_obj.options.cache){
			url += (url.indexOf('?') == -1 ? '?' : '&') + 't=' + new Date().getTime();
		}
		
		//如果是GET请求，将编码后的data作为查询参数附加到url上
		if('get' === method) {
			url += (url.indexOf('?') == -1 ? '?' : '&') + data;
		}
		
		//绑定事件处理器
		bindEventhandler();
		
		//open
		xhr.open(method, url, _obj.options.async);
		
		//send
		if('post' === method && data) {
			xhr.setRequestHeader('content-type', _obj.postContentType);
			xhr.send(data);
		}else {
			xhr.send();
		}
		
		/**
		 * 数据编码函数
		 * @param {Object} data 数据
		 * @param {Object} contentType 	数据类型
		 */
		function encodeData(data, contentType) {
			
			if(Object.prototype.toString.call(data) === '[object Object]') {
				
				//此处需要json转换字符串，现代浏览器都支持内置JSON对象
				//可以通过使用json2.js来支持旧版本浏览器
				
				if('json' === contentType.toLowerCase() &&		//以application/json为格式的数据
					typeof(JSON) === 'object' &&				//是否内置JSON对象
					typeof(JSON.stringify) === 'function') {    //是否支持JSON序列化
						
						_obj.postContentType = 'application/json';
						
						//返回转换后的的数据
						return JSON.stringify(data);
				}else {

					//其他所有情况都做为urlencoded处理
					_obj.postContentType = 'application/x-www-form-urlencoded';

					return encodeParam(data);
				}
			}
		}
		
		/**
		 * 以rulencoded方式编码数据
		 * @param {Object} data 	数据
		 */
		function encodeParam(data) {
			
			if(Object.prototype.toString.call(data) === '[object Object]') {
				var params = [];
				
				for(var name in data) {
					var value = data[name];
					
					//如果是数组，需要组装成paramName=v1&paramName=v2这样的形式，便于后台以数据格式接受数据
					if(Object.prototype.toString.call(data) === '[object Array]') {
						for(var i = 0, len = value.length; i < len; ++i){
							params.push(name + '=' + encodeURIComponent(value[i]));
						}
					}else {
						params.push(name + '=' + encodeURIComponent(data[name]));
					}
				}

				//返回编码后的键值字符串
				return params.join('&');
			}
		}
		
		/**
		 * 事件绑定函数
		 */
		function bindEventhandler() {
			
			//监听事件
			xhr.onreadystatechange = function() {
				
				//仅当请求完成时执行处理
				if(xhr.readyState == 4) {
					var i, len;
					
					//如果有always回调，限制性always
					for(i = 0, len = _obj.alwaysCallbacks.length; i < len; ++i) {
						_obj.alwaysCallbacks[i](xhr.status, xhr.responseText, xhr);
					}
					
					//根据请求是否成功，决定调用success | error
					var resText = xhr.responseText,
						resJson = toJson(resText);
					
					if(xhr.status == 200) {

						if(_obj.jsonForceValidate && typeof(resJson) === 'undefined') {
							
							//强制json格式验证且转换失败，出发errorCallback
							for(i = 0, len = _obj.errorCallbacks.length; i < len; ++i) {
								_obj.errorCallbacks[i](xhr.status, xhr.responseText, xhr);
							}
						}else {
							for(i = 0, len = _obj.successCallbacks.length; i < len; ++i) {
								_obj.successCallbacks[i](resJson || resText, xhr);
							}
						}

					}else {
						//非 200 状态调用 errorCallback
						for(i = 0, len = _obj.errorCallbacks.length; i < len; ++i){
							_obj.errorCallbacks[i](xhr.status, xhr.responseText, xhr);
						}
					}
				}
			};
		}
		
		/**
		 * 转换为JSON对象
		 * @param {Object} text
		 */
		function toJson(text) {
			
			var json;
			
			try{
				//尝试将结果转换为JSON对象
				//优先使用JSON.parse，如果浏览器不支持内置JSON对象，则以eval()方式执行
				if(typeof(JSON) === 'object' && typeof(JSON.parse) === 'function') {
				   	json = JSON.parse(text);
				}else {
					json = eval(text);
				}
			}catch(e) {
				//没啥事可以做的
				console.error(e);
			}
			
			return json;
		}
	}
	
	/**
	 * 用obj_2成员值替换obj_1成员值
	 * @param {Object} obj_1	  被替换值对象
	 * @param {Object} obj_2  	  替换值对象
	 */
	function extend(obj_1, obj_2){
		
		if(Object.prototype.toString.call(obj_1) === '[object Object]' &&
		   Object.prototype.toString.call(obj_2) === '[object Object]') {
			
			for(var propName in obj_2){
				obj_1[propName] = obj_2[propName];
			}
		}
		
		return obj_1;
	}
	
	/**
	 * XMLHttpRequest 对象创建函数
	 */
	function createXhr() {
		
		//initialize the variable
		var xhr;
		
		if(xhr == undefined){
			if(win.XMLHttpRequest){
			
				xhr = new XMLHttpRequest;
			}else if(win.ActiveXObject){
				
				xhr = new ActiveXObject("Msxml2.XMLHTTP") || new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		
		return xhr;
	}

})(window);
