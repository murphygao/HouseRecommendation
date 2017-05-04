/**
 @Name : layDate v1.1 日期控件
 @Author: 贤心
 @Date: 2014-06-25
 @QQ群：176047195
 @Site：http://sentsin.com/layui/laydate
 */
(function(win) {

	//全局配置，如果采用默认均不需要改动
	var config = {
		path: '', //laydate所在路径
		skin: 'default', //初始化皮肤
		format: 'YYYY-MM-DD', //日期格式
		min: '1900-01-01 00:00:00', //最小日期
		max: '2099-12-31 23:59:59', //最大日期
		isv: false,
		init: true
	};

	var Dates = {},
		doc = document,
		creat = 'createElement',
		byid = 'getElementById',
		tags = 'getElementsByTagName';
	var as = ['laydate_box', 'laydate_void', 'laydate_click', 'LayDateSkin', 'skins/', '/laydate.css'];


	//主接口
	win.laydate = function(options) {
		options = options || {};
		try {
			as.event = win.event ? win.event : laydate.caller.arguments[0];
		} catch (e) {};
		Dates.run(options);
		return laydate;
	};

	laydate.v = '1.1';

	//获取组件存放路径
	Dates.getPath = (function() {
		var js = document.scripts,
			jsPath = js[js.length - 1].src;
		return config.path ? config.path : jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
	}());

	Dates.use = function(lib, id) {
		var link = doc[creat]('link');
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = Dates.getPath + lib + as[5];
		id && (link.id = id);
		doc[tags]('head')[0].appendChild(link);
		link = null;
	};

	Dates.trim = function(str) {
		str = str || '';
		return str.replace(/^\s|\s$/g, '').replace(/\s+/g, ' ');
	};

	//补齐数位
	Dates.digit = function(num) {
		return num < 10 ? '0' + (num | 0) : num;
	};

	Dates.stopmp = function(e) {
		e = e || win.event;
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
		return this;
	};

	Dates.each = function(arr, fn) {
		var i = 0,
			len = arr.length;
		for (; i < len; i++) {
			if (fn(i, arr[i]) === false) {
				break
			}
		}
	};

	Dates.hasClass = function(elem, cls) {
		elem = elem || {};
		return new RegExp('\\b' + cls + '\\b').test(elem.className);
	};

	Dates.addClass = function(elem, cls) {
		elem = elem || {};
		Dates.hasClass(elem, cls) || (elem.className += ' ' + cls);
		elem.className = Dates.trim(elem.className);
		return this;
	};

	Dates.removeClass = function(elem, cls) {
		elem = elem || {};
		if (Dates.hasClass(elem, cls)) {
			var reg = new RegExp('\\b' + cls + '\\b');
			elem.className = elem.className.replace(reg, '');
		}
		return this;
	};

	//清除css属性
	Dates.removeCssAttr = function(elem, attr) {
		var s = elem.style;
		if (s.removeProperty) {
			s.removeProperty(attr);
		} else {
			s.removeAttribute(attr);
		}
	};

	//显示隐藏
	Dates.shde = function(elem, type) {
		elem.style.display = type ? 'none' : 'block';
	};

	//简易选择器
	Dates.query = function(node) {
		if (node && node.nodeType === 1) {
			if (node.tagName.toLowerCase() !== 'input') {
				throw new Error('选择器elem错误');
			}
			return node;
		}

		var node = (Dates.trim(node)).split(' '),
			elemId = doc[byid](node[0].substr(1)),
			arr;
		if (!elemId) {
			return;
		} else if (!node[1]) {
			return elemId;
		} else if (/^\./.test(node[1])) {
			var find, child = node[1].substr(1),
				exp = new RegExp('\\b' + child + '\\b');
			arr = []
			find = doc.getElementsByClassName ? elemId.getElementsByClassName(child) : elemId[tags]('*');
			Dates.each(find, function(ii, that) {
				exp.test(that.className) && arr.push(that);
			});
			return arr[0] ? arr : '';
		} else {
			arr = elemId[tags](node[1]);
			return arr[0] ? elemId[tags](node[1]) : '';
		}
	};

	//事件监听器
	Dates.on = function(elem, even, fn) {
		elem.attachEvent ? elem.attachEvent('on' + even, function() {
			fn.call(elem, win.even);
		}) : elem.addEventListener(even, fn, false);
		return Dates;
	};

	//阻断mouseup
	Dates.stopMosup = function(evt, elem) {
		if (evt !== 'mouseup') {
			Dates.on(elem, 'mouseup', function(ev) {
				Dates.stopmp(ev);
			});
		}
	};

	Dates.run = function(options) {
		var S = Dates.query,
			elem, devt, even = as.event,
			target;
		try {
			target = even.target || even.srcElement || {};
		} catch (e) {
			target = {};
		}
		elem = options.elem ? S(options.elem) : target;

		as.elemv = /textarea|input/.test(elem.tagName.toLocaleLowerCase()) ? 'value' : 'innerHTML';
		if (('init' in options ? options.init : config.init) && (!elem[as.elemv])) elem[as.elemv] = laydate.now(null, options.format || config.format);

		if (even && target.tagName) {
			if (!elem || elem === Dates.elem) {
				return;
			}
			Dates.stopMosup(even.type, elem);
			Dates.stopmp(even);
			Dates.view(elem, options);
			Dates.reshow();
		} else {
			devt = options.event || 'click';
			Dates.each((elem.length | 0) > 0 ? elem : [elem], function(ii, that) {
				Dates.stopMosup(devt, that);
				Dates.on(that, devt, function(ev) {
					Dates.stopmp(ev);
					if (that !== Dates.elem) {
						Dates.view(that, options);
						Dates.reshow();
					}
				});
			});
		}

		chgSkin(options.skin || config.skin)
	};

	Dates.scroll = function(type) {
		type = type ? 'scrollLeft' : 'scrollTop';
		return doc.body[type] | doc.documentElement[type];
	};

	Dates.winarea = function(type) {
		return document.documentElement[type ? 'clientWidth' : 'clientHeight']
	};

	//判断闰年
	Dates.isleap = function(year) {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	};

	//检测是否在有效期
	Dates.checkVoid = function(YY, MM, DD) {
		var back = [];
		YY = YY | 0;
		MM = MM | 0;
		DD = DD | 0;
		if (YY < Dates.mins[0]) {
			back = ['y'];
		} else if (YY > Dates.maxs[0]) {
			back = ['y', 1];
		} else if (YY >= Dates.mins[0] && YY <= Dates.maxs[0]) {
			if (YY == Dates.mins[0]) {
				if (MM < Dates.mins[1]) {
					back = ['m'];
				} else if (MM == Dates.mins[1]) {
					if (DD < Dates.mins[2]) {
						back = ['d'];
					}
				}
			}
			if (YY == Dates.maxs[0]) {
				if (MM > Dates.maxs[1]) {
					back = ['m', 1];
				} else if (MM == Dates.maxs[1]) {
					if (DD > Dates.maxs[2]) {
						back = ['d', 1];
					}
				}
			}
		}
		return back;
	};

	//时分秒的有效检测
	Dates.timeVoid = function(times, index) {
		if (Dates.ymd[1] + 1 == Dates.mins[1] && Dates.ymd[2] == Dates.mins[2]) {
			if (index === 0 && (times < Dates.mins[3])) {
				return 1;
			} else if (index === 1 && times < Dates.mins[4]) {
				return 1;
			} else if (index === 2 && times < Dates.mins[5]) {
				return 1;
			}
		} else if (Dates.ymd[1] + 1 == Dates.maxs[1] && Dates.ymd[2] == Dates.maxs[2]) {
			if (index === 0 && times > Dates.maxs[3]) {
				return 1;
			} else if (index === 1 && times > Dates.maxs[4]) {
				return 1;
			} else if (index === 2 && times > Dates.maxs[5]) {
				return 1;
			}
		}
		if (times > (index ? 59 : 23)) {
			return 1;
		}
	};

	//检测日期是否合法
	Dates.check = function() {
		var reg = Dates.options.format.replace(/YYYY|MM|DD|hh|mm|ss/g, '\\d+\\').replace(/\\$/g, '');
		var exp = new RegExp(reg),
			value = Dates.elem[as.elemv];
		var arr = value.match(/\d+/g) || [],
			isvoid = Dates.checkVoid(arr[0], arr[1], arr[2]);
		if (value.replace(/\s/g, '') !== '') {
			if (!exp.test(value)) {
				Dates.elem[as.elemv] = '';
				Dates.msg('日期不符合格式，请重新选择。');
				return 1;
			} else if (isvoid[0]) {
				Dates.elem[as.elemv] = '';
				Dates.msg('日期不在有效期内，请重新选择。');
				return 1;
			} else {
				isvoid.value = Dates.elem[as.elemv].match(exp).join();
				arr = isvoid.value.match(/\d+/g);
				if (arr[1] < 1) {
					arr[1] = 1;
					isvoid.auto = 1;
				} else if (arr[1] > 12) {
					arr[1] = 12;
					isvoid.auto = 1;
				} else if (arr[1].length < 2) {
					isvoid.auto = 1;
				}
				if (arr[2] < 1) {
					arr[2] = 1;
					isvoid.auto = 1;
				} else if (arr[2] > Dates.months[(arr[1] | 0) - 1]) {
					arr[2] = 31;
					isvoid.auto = 1;
				} else if (arr[2].length < 2) {
					isvoid.auto = 1;
				}
				if (arr.length > 3) {
					if (Dates.timeVoid(arr[3], 0)) {
						isvoid.auto = 1;
					};
					if (Dates.timeVoid(arr[4], 1)) {
						isvoid.auto = 1;
					};
					if (Dates.timeVoid(arr[5], 2)) {
						isvoid.auto = 1;
					};
				}
				if (isvoid.auto) {
					Dates.creation([arr[0], arr[1] | 0, arr[2] | 0], 1);
				} else if (isvoid.value !== Dates.elem[as.elemv]) {
					Dates.elem[as.elemv] = isvoid.value;
				}
			}
		}
	};

	//生成日期
	Dates.months = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	Dates.viewDate = function(Y, M, D) {
		var S = Dates.query,
			log = {},
			De = new Date();
		Y < (Dates.mins[0] | 0) && (Y = (Dates.mins[0] | 0));
		Y > (Dates.maxs[0] | 0) && (Y = (Dates.maxs[0] | 0));

		De.setFullYear(Y, M, D);
		log.ymd = [De.getFullYear(), De.getMonth(), De.getDate()];

		Dates.months[1] = Dates.isleap(log.ymd[0]) ? 29 : 28;

		De.setFullYear(log.ymd[0], log.ymd[1], 1);
		log.FDay = De.getDay();

		log.PDay = Dates.months[M === 0 ? 11 : M - 1] - log.FDay + 1;
		log.NDay = 1;

		//渲染日
		Dates.each(as.tds, function(i, elem) {
			var YY = log.ymd[0],
				MM = log.ymd[1] + 1,
				DD;
			elem.className = '';
			if (i < log.FDay) {
				elem.innerHTML = DD = i + log.PDay;
				Dates.addClass(elem, 'laydate_nothis');
				MM === 1 && (YY -= 1);
				MM = MM === 1 ? 12 : MM - 1;
			} else if (i >= log.FDay && i < log.FDay + Dates.months[log.ymd[1]]) {
				elem.innerHTML = DD = i - log.FDay + 1;
				if (i - log.FDay + 1 === log.ymd[2]) {
					Dates.addClass(elem, as[2]);
					log.thisDay = elem;
				}
			} else {
				elem.innerHTML = DD = log.NDay++;
				Dates.addClass(elem, 'laydate_nothis');
				MM === 12 && (YY += 1);
				MM = MM === 12 ? 1 : MM + 1;
			}

			if (Dates.checkVoid(YY, MM, DD)[0]) {
				Dates.addClass(elem, as[1]);
			}

			Dates.options.festival && Dates.festival(elem, MM + '.' + DD);
			elem.setAttribute('y', YY);
			elem.setAttribute('m', MM);
			elem.setAttribute('d', DD);
			YY = MM = DD = null;
		});

		Dates.valid = !Dates.hasClass(log.thisDay, as[1]);
		Dates.ymd = log.ymd;

		//锁定年月
		as.year.value = Dates.ymd[0] + '年';
		as.month.value = Dates.digit(Dates.ymd[1] + 1) + '月';

		//定位月
		Dates.each(as.mms, function(i, elem) {
			var getCheck = Dates.checkVoid(Dates.ymd[0], (elem.getAttribute('m') | 0) + 1);
			if (getCheck[0] === 'y' || getCheck[0] === 'm') {
				Dates.addClass(elem, as[1]);
			} else {
				Dates.removeClass(elem, as[1]);
			}
			Dates.removeClass(elem, as[2]);
			getCheck = null
		});
		Dates.addClass(as.mms[Dates.ymd[1]], as[2]);

		//定位时分秒
		log.times = [
			Dates.inymd[3] | 0 || 0,
			Dates.inymd[4] | 0 || 0,
			Dates.inymd[5] | 0 || 0
		];
		Dates.each(new Array(3), function(i) {
			Dates.hmsin[i].value = Dates.digit(Dates.timeVoid(log.times[i], i) ? Dates.mins[i + 3] | 0 : log.times[i] | 0);
		});

		//确定按钮状态
		Dates[Dates.valid ? 'removeClass' : 'addClass'](as.ok, as[1]);
	};

	//节日
	Dates.festival = function(td, md) {
		var str;
		switch (md) {
			case '1.1':
				str = '元旦';
				break;
			case '3.8':
				str = '妇女';
				break;
			case '4.5':
				str = '清明';
				break;
			case '5.1':
				str = '劳动';
				break;
			case '6.1':
				str = '儿童';
				break;
			case '9.10':
				str = '教师';
				break;
			case '10.1':
				str = '国庆';
				break;
		};
		str && (td.innerHTML = str);
		str = null;
	};

	//生成年列表
	Dates.viewYears = function(YY) {
		var S = Dates.query,
			str = '';
		Dates.each(new Array(14), function(i) {
			if (i === 7) {
				str += '<li ' + (parseInt(as.year.value) === YY ? 'class="' + as[2] + '"' : '') + ' y="' + YY + '">' + YY + '年</li>';
			} else {
				str += '<li y="' + (YY - 7 + i) + '">' + (YY - 7 + i) + '年</li>';
			}
		});
		S('#laydate_ys').innerHTML = str;
		Dates.each(S('#laydate_ys li'), function(i, elem) {
			if (Dates.checkVoid(elem.getAttribute('y'))[0] === 'y') {
				Dates.addClass(elem, as[1]);
			} else {
				Dates.on(elem, 'click', function(ev) {
					Dates.stopmp(ev).reshow();
					Dates.viewDate(this.getAttribute('y') | 0, Dates.ymd[1], Dates.ymd[2]);
				});
			}
		});
	};

	//初始化面板数据
	Dates.initDate = function() {
		var S = Dates.query,
			log = {},
			De = new Date();
		var ymd = Dates.elem[as.elemv].match(/\d+/g) || [];
		if (ymd.length < 3) {
			ymd = Dates.options.start.match(/\d+/g) || [];
			if (ymd.length < 3) {
				ymd = [De.getFullYear(), De.getMonth() + 1, De.getDate()];
			}
		}
		Dates.inymd = ymd;
		Dates.viewDate(ymd[0], ymd[1] - 1, ymd[2]);
	};

	//是否显示零件
	Dates.iswrite = function() {
		var S = Dates.query,
			log = {
				time: S('#laydate_hms')
			};
		Dates.shde(log.time, !Dates.options.istime);
		Dates.shde(as.oclear, !('isclear' in Dates.options ? Dates.options.isclear : 1));
		Dates.shde(as.otoday, !('istoday' in Dates.options ? Dates.options.istoday : 1));
		Dates.shde(as.ok, !('issure' in Dates.options ? Dates.options.issure : 1));
	};

	//方位辨别
	Dates.orien = function(obj, pos) {
		var tops, rect = Dates.elem.getBoundingClientRect();
		obj.style.left = rect.left + (pos ? 0 : Dates.scroll(1)) + 'px';
		if (rect.bottom + obj.offsetHeight / 1.5 <= Dates.winarea()) {
			tops = rect.bottom - 1;
		} else {
			tops = rect.top > obj.offsetHeight / 1.5 ? rect.top - obj.offsetHeight + 1 : Dates.winarea() - obj.offsetHeight;
		}
		obj.style.top = Math.max(tops + (pos ? 0 : Dates.scroll()), 1) + 'px';
	};

	//吸附定位
	Dates.follow = function(obj) {
		if (Dates.options.fixed) {
			obj.style.position = 'fixed';
			Dates.orien(obj, 1);
		} else {
			obj.style.position = 'absolute';
			Dates.orien(obj);
		}
	};

	//生成表格
	Dates.viewtb = (function() {
		var tr, view = [],
			weeks = ['日', '一', '二', '三', '四', '五', '六'];
		var log = {},
			table = doc[creat]('table'),
			thead = doc[creat]('thead');
		thead.appendChild(doc[creat]('tr'));
		log.creath = function(i) {
			var th = doc[creat]('th');
			th.innerHTML = weeks[i];
			thead[tags]('tr')[0].appendChild(th);
			th = null;
		};

		Dates.each(new Array(6), function(i) {
			view.push([]);
			tr = table.insertRow(0);
			Dates.each(new Array(7), function(j) {
				view[i][j] = 0;
				i === 0 && log.creath(j);
				tr.insertCell(j);
			});
		});

		table.insertBefore(thead, table.children[0]);
		table.id = table.className = 'laydate_table';
		tr = view = null;
		return table.outerHTML.toLowerCase();
	}());

	//渲染控件骨架
	Dates.view = function(elem, options) {
		var S = Dates.query,
			div, log = {};
		options = options || elem;

		Dates.elem = elem;
		Dates.options = options;
		Dates.options.format || (Dates.options.format = config.format);
		Dates.options.start = Dates.options.start || '';
		Dates.mm = log.mm = [Dates.options.min || config.min, Dates.options.max || config.max];
		Dates.mins = log.mm[0].match(/\d+/g);
		Dates.maxs = log.mm[1].match(/\d+/g);

		if (!Dates.box) {
			div = doc[creat]('div');
			div.id = as[0];
			div.className = as[0];
			div.style.cssText = 'position: absolute;';
			div.setAttribute('name', 'laydate-v' + laydate.v);

			div.innerHTML = log.html = '<div class="laydate_top">' + '<div class="laydate_ym laydate_y" id="laydate_YY">' + '<a class="laydate_choose laydate_chprev laydate_tab"><cite></cite></a>' + '<input id="laydate_y" readonly><label></label>' + '<a class="laydate_choose laydate_chnext laydate_tab"><cite></cite></a>' + '<div class="laydate_yms">' + '<a class="laydate_tab laydate_chtop"><cite></cite></a>' + '<ul id="laydate_ys"></ul>' + '<a class="laydate_tab laydate_chdown"><cite></cite></a>' + '</div>' + '</div>' + '<div class="laydate_ym laydate_m" id="laydate_MM">' + '<a class="laydate_choose laydate_chprev laydate_tab"><cite></cite></a>' + '<input id="laydate_m" readonly><label></label>' + '<a class="laydate_choose laydate_chnext laydate_tab"><cite></cite></a>' + '<div class="laydate_yms" id="laydate_ms">' + function() {
				var str = '';
				Dates.each(new Array(12), function(i) {
					str += '<span m="' + i + '">' + Dates.digit(i + 1) + '月</span>';
				});
				return str;
			}() + '</div>' + '</div>' + '</div>'

			+ Dates.viewtb

				+ '<div class="laydate_bottom">' + '<ul id="laydate_hms">' + '<li class="laydate_sj">时间</li>' + '<li><input readonly>:</li>' + '<li><input readonly>:</li>' + '<li><input readonly></li>' + '</ul>' + '<div class="laydate_time" id="laydate_time"></div>' + '<div class="laydate_btn">' + '<a id="laydate_clear">清空</a>' + '<a id="laydate_today">今天</a>' + '<a id="laydate_ok">确认</a>' + '</div>' + (config.isv ? '<a href="http://sentsin.com/layui/laydate/" class="laydate_v" target="_blank">laydate-v' + laydate.v + '</a>' : '') + '</div>';
			doc.body.appendChild(div);
			Dates.box = S('#' + as[0]);
			Dates.events();
			div = null;
		} else {
			Dates.shde(Dates.box);
		}
		Dates.follow(Dates.box);
		options.zIndex ? Dates.box.style.zIndex = options.zIndex : Dates.removeCssAttr(Dates.box, 'z-index');
		Dates.stopMosup('click', Dates.box);

		Dates.initDate();
		Dates.iswrite();
		Dates.check();
	};

	//隐藏内部弹出元素
	Dates.reshow = function() {
		Dates.each(Dates.query('#' + as[0] + ' .laydate_show'), function(i, elem) {
			Dates.removeClass(elem, 'laydate_show');
		});
		return this;
	};

	//关闭控件
	Dates.close = function() {
		Dates.reshow();
		Dates.shde(Dates.query('#' + as[0]), 1);
		Dates.elem = null;
	};

	//转换日期格式
	Dates.parse = function(ymd, hms, format) {
		ymd = ymd.concat(hms);
		format = format || (Dates.options ? Dates.options.format : config.format);
		return format.replace(/YYYY|MM|DD|hh|mm|ss/g, function(str, index) {
			ymd.index = ++ymd.index | 0;
			return Dates.digit(ymd[ymd.index]);
		});
	};

	//返回最终日期
	Dates.creation = function(ymd, hide) {
		var S = Dates.query,
			hms = Dates.hmsin;
		var getDates = Dates.parse(ymd, [hms[0].value, hms[1].value, hms[2].value]);
		Dates.elem[as.elemv] = getDates;
		if (!hide) {
			Dates.close();
			typeof Dates.options.choose === 'function' && Dates.options.choose(getDates);
		}
	};

	//事件
	Dates.events = function() {
		var S = Dates.query,
			log = {
				box: '#' + as[0]
			};

		Dates.addClass(doc.body, 'laydate_body');

		as.tds = S('#laydate_table td');
		as.mms = S('#laydate_ms span');
		as.year = S('#laydate_y');
		as.month = S('#laydate_m');

		//显示更多年月
		Dates.each(S(log.box + ' .laydate_ym'), function(i, elem) {
			Dates.on(elem, 'click', function(ev) {
				Dates.stopmp(ev).reshow();
				Dates.addClass(this[tags]('div')[0], 'laydate_show');
				if (!i) {
					log.YY = parseInt(as.year.value);
					Dates.viewYears(log.YY);
				}
			});
		});

		Dates.on(S(log.box), 'click', function() {
			Dates.reshow();
		});

		//切换年
		log.tabYear = function(type) {
			if (type === 0) {
				Dates.ymd[0]--;
			} else if (type === 1) {
				Dates.ymd[0]++;
			} else if (type === 2) {
				log.YY -= 14;
			} else {
				log.YY += 14;
			}
			if (type < 2) {
				Dates.viewDate(Dates.ymd[0], Dates.ymd[1], Dates.ymd[2]);
				Dates.reshow();
			} else {
				Dates.viewYears(log.YY);
			}
		};
		Dates.each(S('#laydate_YY .laydate_tab'), function(i, elem) {
			Dates.on(elem, 'click', function(ev) {
				Dates.stopmp(ev);
				log.tabYear(i);
			});
		});


		//切换月
		log.tabMonth = function(type) {
			if (type) {
				Dates.ymd[1]++;
				if (Dates.ymd[1] === 12) {
					Dates.ymd[0]++;
					Dates.ymd[1] = 0;
				}
			} else {
				Dates.ymd[1]--;
				if (Dates.ymd[1] === -1) {
					Dates.ymd[0]--;
					Dates.ymd[1] = 11;
				}
			}
			Dates.viewDate(Dates.ymd[0], Dates.ymd[1], Dates.ymd[2]);
		};
		Dates.each(S('#laydate_MM .laydate_tab'), function(i, elem) {
			Dates.on(elem, 'click', function(ev) {
				Dates.stopmp(ev).reshow();
				log.tabMonth(i);
			});
		});

		//选择月
		Dates.each(S('#laydate_ms span'), function(i, elem) {
			Dates.on(elem, 'click', function(ev) {
				Dates.stopmp(ev).reshow();
				if (!Dates.hasClass(this, as[1])) {
					Dates.viewDate(Dates.ymd[0], this.getAttribute('m') | 0, Dates.ymd[2]);
				}
			});
		});

		//选择日
		Dates.each(S('#laydate_table td'), function(i, elem) {
			Dates.on(elem, 'click', function(ev) {
				if (!Dates.hasClass(this, as[1])) {
					Dates.stopmp(ev);
					Dates.creation([this.getAttribute('y') | 0, this.getAttribute('m') | 0, this.getAttribute('d') | 0]);
				}
			});
		});

		//清空
		as.oclear = S('#laydate_clear');
		Dates.on(as.oclear, 'click', function() {
			Dates.elem[as.elemv] = '';
			Dates.close();
		});

		//今天
		as.otoday = S('#laydate_today');
		Dates.on(as.otoday, 'click', function() {
			var now = new Date();
			Dates.creation([now.getFullYear(), now.getMonth() + 1, now.getDate()]);
		});

		//确认
		as.ok = S('#laydate_ok');
		Dates.on(as.ok, 'click', function() {
			if (Dates.valid) {
				Dates.creation([Dates.ymd[0], Dates.ymd[1] + 1, Dates.ymd[2]]);
			}
		});

		//选择时分秒
		log.times = S('#laydate_time');
		Dates.hmsin = log.hmsin = S('#laydate_hms input');
		log.hmss = ['小时', '分钟', '秒数'];
		log.hmsarr = [];

		//生成时分秒或警告信息
		Dates.msg = function(i, title) {
			var str = '<div class="laydte_hsmtex">' + (title || '提示') + '<span>×</span></div>';
			if (typeof i === 'string') {
				str += '<p>' + i + '</p>';
				Dates.shde(S('#' + as[0]));
				Dates.removeClass(log.times, 'laydate_time1').addClass(log.times, 'laydate_msg');
			} else {
				if (!log.hmsarr[i]) {
					str += '<div id="laydate_hmsno" class="laydate_hmsno">';
					Dates.each(new Array(i === 0 ? 24 : 60), function(i) {
						str += '<span>' + i + '</span>';
					});
					str += '</div>'
					log.hmsarr[i] = str;
				} else {
					str = log.hmsarr[i];
				}
				Dates.removeClass(log.times, 'laydate_msg');
				Dates[i === 0 ? 'removeClass' : 'addClass'](log.times, 'laydate_time1');
			}
			Dates.addClass(log.times, 'laydate_show');
			log.times.innerHTML = str;
		};

		log.hmson = function(input, index) {
			var span = S('#laydate_hmsno span'),
				set = Dates.valid ? null : 1;
			Dates.each(span, function(i, elem) {
				if (set) {
					Dates.addClass(elem, as[1]);
				} else if (Dates.timeVoid(i, index)) {
					Dates.addClass(elem, as[1]);
				} else {
					Dates.on(elem, 'click', function(ev) {
						if (!Dates.hasClass(this, as[1])) {
							input.value = Dates.digit(this.innerHTML | 0);
						}
					});
				}
			});
			Dates.addClass(span[input.value | 0], 'laydate_click');
		};

		//展开选择
		Dates.each(log.hmsin, function(i, elem) {
			Dates.on(elem, 'click', function(ev) {
				Dates.stopmp(ev).reshow();
				Dates.msg(i, log.hmss[i]);
				log.hmson(this, i);
			});
		});

		Dates.on(doc, 'mouseup', function() {
			var box = S('#' + as[0]);
			if (box && box.style.display !== 'none') {
				Dates.check() || Dates.close();
			}
		}).on(doc, 'keydown', function(event) {
			event = event || win.event;
			var codes = event.keyCode;

			//如果在日期显示的时候按回车
			if (codes === 13 && Dates.elem) {
				Dates.creation([Dates.ymd[0], Dates.ymd[1] + 1, Dates.ymd[2]]);
			}
		});
	};

	Dates.init = (function() {
		Dates.use('need');
		Dates.use(as[4] + config.skin, as[3]);
		Dates.skinLink = Dates.query('#' + as[3]);
	}());

	//重置定位
	laydate.reset = function() {
		(Dates.box && Dates.elem) && Dates.follow(Dates.box);
	};

	//返回指定日期
	laydate.now = function(timestamp, format) {
		var De = new Date((timestamp | 0) ? function(tamp) {
			return tamp < 86400000 ? (+new Date + tamp * 86400000) : tamp;
		}(parseInt(timestamp)) : +new Date);
		return Dates.parse(
			[De.getFullYear(), De.getMonth() + 1, De.getDate()], [De.getHours(), De.getMinutes(), De.getSeconds()],
			format
		);
	};

	//皮肤选择
	laydate.skin = chgSkin;

	//内部函数
	function chgSkin(lib) {
		Dates.skinLink.href = Dates.getPath + as[4] + lib + as[5];
	};

})(window);




/*!
@Name：layer v2.4 弹层组件
@Author：贤心
@Site：http://layer.layui.com
@License：LGPL
   
*/
(function(window, undefined){
"use strict";

var $, win, ready = {
 getPath: function(){
   var js = document.scripts, script = js[js.length - 1], jsPath = script.src;
   if(script.getAttribute('merge')) return;
   return jsPath.substring(0, jsPath.lastIndexOf("/") + 1);
 }(),
 
 //屏蔽Enter触发弹层
 enter: function(e){
   if(e.keyCode === 13) e.preventDefault();
 },
 config: {}, end: {},
 btn: ['&#x786E;&#x5B9A;','&#x53D6;&#x6D88;'],
 
 //五种原始层模式
 type: ['dialog', 'page', 'iframe', 'loading', 'tips']
};

//默认内置方法。
var layer = {
 v: '2.4',
 ie6: !!window.ActiveXObject&&!window.XMLHttpRequest,
 index: 0,
 path: ready.getPath,
 config: function(options, fn){
   var item = 0;
   options = options || {};
   layer.cache = ready.config = $.extend(ready.config, options);
   layer.path = ready.config.path || layer.path;
   typeof options.extend === 'string' && (options.extend = [options.extend]);
   layer.use('skin/layer.css', (options.extend && options.extend.length > 0) ? (function loop(){
     var ext = options.extend;
     layer.use(ext[ext[item] ? item : item-1], item < ext.length ? function(){
       ++item; 
       return loop;
     }() : fn);
   }()) : fn);
   return this;
 },
 
 //载入配件
 use: function(module, fn, readyMethod){
   var i = 0, head = $('head')[0];
   var module = module.replace(/\s/g, '');
   var iscss = /\.css$/.test(module);
   var node = document.createElement(iscss ? 'link' : 'script');
   var id = 'layui_layer_' + module.replace(/\.|\//g, '');
   if(!layer.path) return;
   if(iscss){
     node.rel = 'stylesheet';
   }
   node[iscss ? 'href' : 'src'] = /^http:\/\//.test(module) ? module : layer.path + module;
   node.id = id;
   if(!$('#'+ id)[0]){
     head.appendChild(node);
   }
   //轮询加载就绪
   ;(function poll() {
     ;(iscss ? parseInt($('#'+id).css('width')) === 1989 : layer[readyMethod||id]) ? function(){
       fn && fn();
       try { iscss || head.removeChild(node); } catch(e){};
     }() : setTimeout(poll, 100);
   }());
   return this;
 },
 
 ready: function(path, fn){
   var type = typeof path === 'function';
   if(type) fn = path;
   layer.config($.extend(ready.config, function(){
      return type ? {} : {path: path};
   }()), fn);
   return this;
 },
 
 //各种快捷引用
 alert: function(content, options, yes){
   var type = typeof options === 'function';
   if(type) yes = options;
   return layer.open($.extend({
     content: content,
     yes: yes
   }, type ? {} : options));
 }, 
 
 confirm: function(content, options, yes, cancel){ 
   var type = typeof options === 'function';
   if(type){
     cancel = yes;
     yes = options;
   }
   return layer.open($.extend({
     content: content,
     btn: ready.btn,
     yes: yes,
     btn2: cancel
   }, type ? {} : options));
 },
 
 msg: function(content, options, end){ //最常用提示层
   var type = typeof options === 'function', rskin = ready.config.skin;
   var skin = (rskin ? rskin + ' ' + rskin + '-msg' : '')||'layui-layer-msg';
   var shift = doms.anim.length - 1;
   if(type) end = options;
   return layer.open($.extend({
     content: content,
     time: 3000,
     shade: false,
     skin: skin,
     title: false,
     closeBtn: false,
     btn: false,
     end: end
   }, (type && !ready.config.skin) ? {
     skin: skin + ' layui-layer-hui',
     shift: shift
   } : function(){
      options = options || {};
      if(options.icon === -1 || options.icon === undefined && !ready.config.skin){
        options.skin = skin + ' ' + (options.skin||'layui-layer-hui');
      }
      return options;
   }()));  
 },
 
 load: function(icon, options){
   return layer.open($.extend({
     type: 3,
     icon: icon || 0,
     shade: 0.01
   }, options));
 }, 
 
 tips: function(content, follow, options){
   return layer.open($.extend({
     type: 4,
     content: [content, follow],
     closeBtn: false,
     time: 3000,
     shade: false,
     fix: false,
     maxWidth: 210
   }, options));
 }
};

var Class = function(setings){  
 var that = this;
 that.index = ++layer.index;
 that.config = $.extend({}, that.config, ready.config, setings);
 that.creat();
};

Class.pt = Class.prototype;

//缓存常用字符
var doms = ['layui-layer', '.layui-layer-title', '.layui-layer-main', '.layui-layer-dialog', 'layui-layer-iframe', 'layui-layer-content', 'layui-layer-btn', 'layui-layer-close'];
doms.anim = ['layer-anim', 'layer-anim-01', 'layer-anim-02', 'layer-anim-03', 'layer-anim-04', 'layer-anim-05', 'layer-anim-06'];

//默认配置
Class.pt.config = {
 type: 0,
 shade: 0.3,
 fix: true,
 move: doms[1],
 title: '&#x4FE1;&#x606F;',
 offset: 'auto',
 area: 'auto',
 closeBtn: 1,
 time: 0, //0表示不自动关闭
 zIndex: 19891014, 
 maxWidth: 360,
 shift: 0,
 icon: -1,
 scrollbar: true, //是否允许浏览器滚动条
 tips: 2
};

//容器
Class.pt.vessel = function(conType, callback){
 var that = this, times = that.index, config = that.config;
 var zIndex = config.zIndex + times, titype = typeof config.title === 'object';
 var ismax = config.maxmin && (config.type === 1 || config.type === 2);
 var titleHTML = (config.title ? '<div class="layui-layer-title" style="'+ (titype ? config.title[1] : '') +'">' 
   + (titype ? config.title[0] : config.title) 
 + '</div>' : '');
 
 config.zIndex = zIndex;
 callback([
   //遮罩
   config.shade ? ('<div class="layui-layer-shade" id="layui-layer-shade'+ times +'" times="'+ times +'" style="'+ ('z-index:'+ (zIndex-1) +'; background-color:'+ (config.shade[1]||'#000') +'; opacity:'+ (config.shade[0]||config.shade) +'; filter:alpha(opacity='+ (config.shade[0]*100||config.shade*100) +');') +'"></div>') : '',
   
   //主体
   '<div class="'+ doms[0] + (' layui-layer-'+ready.type[config.type]) + (((config.type == 0 || config.type == 2) && !config.shade) ? ' layui-layer-border' : '') + ' ' + (config.skin||'') +'" id="'+ doms[0] + times +'" type="'+ ready.type[config.type] +'" times="'+ times +'" showtime="'+ config.time +'" conType="'+ (conType ? 'object' : 'string') +'" style="z-index: '+ zIndex +'; width:'+ config.area[0] + ';height:' + config.area[1] + (config.fix ? '' : ';position:absolute;') +'">'
     + (conType && config.type != 2 ? '' : titleHTML)
     +'<div id="'+ (config.id||'') +'" class="layui-layer-content'+ ((config.type == 0 && config.icon !== -1) ? ' layui-layer-padding' :'') + (config.type == 3 ? ' layui-layer-loading'+config.icon : '') +'">'
       + (config.type == 0 && config.icon !== -1 ? '<i class="layui-layer-ico layui-layer-ico'+ config.icon +'"></i>' : '')
       + (config.type == 1 && conType ? '' : (config.content||''))
     +'</div>'
     + '<span class="layui-layer-setwin">'+ function(){
       var closebtn = ismax ? '<a class="layui-layer-min" href="javascript:;"><cite></cite></a><a class="layui-layer-ico layui-layer-max" href="javascript:;"></a>' : '';
       config.closeBtn && (closebtn += '<a class="layui-layer-ico '+ doms[7] +' '+ doms[7] + (config.title ? config.closeBtn : (config.type == 4 ? '1' : '2')) +'" href="javascript:;"></a>');
       return closebtn;
     }() + '</span>'
     + (config.btn ? function(){
       var button = '';
       typeof config.btn === 'string' && (config.btn = [config.btn]);
       for(var i = 0, len = config.btn.length; i < len; i++){
         button += '<a class="'+ doms[6] +''+ i +'">'+ config.btn[i] +'</a>'
       }
       return '<div class="'+ doms[6] +'">'+ button +'</div>'
     }() : '')
   +'</div>'
 ], titleHTML);
 return that;
};

//创建骨架
Class.pt.creat = function(){
 var that = this, config = that.config, times = that.index, nodeIndex;
 var content = config.content, conType = typeof content === 'object';
 
 if($('#'+config.id)[0])  return;
 
 if(typeof config.area === 'string'){
   config.area = config.area === 'auto' ? ['', ''] : [config.area, ''];
 }
 
 switch(config.type){
   case 0:
     config.btn = ('btn' in config) ? config.btn : ready.btn[0];
     layer.closeAll('dialog');
   break;
   case 2:
     var content = config.content = conType ? config.content : [config.content||'http://layer.layui.com', 'auto'];
     config.content = '<iframe scrolling="'+ (config.content[1]||'auto') +'" allowtransparency="true" id="'+ doms[4] +''+ times +'" name="'+ doms[4] +''+ times +'" onload="this.className=\'\';" class="layui-layer-load" frameborder="0" src="' + config.content[0] + '"></iframe>';
   break;
   case 3:
     config.title = false;
     config.closeBtn = false;
     config.icon === -1 && (config.icon === 0);
     layer.closeAll('loading');
   break;
   case 4:
     conType || (config.content = [config.content, 'body']);
     config.follow = config.content[1];
     config.content = config.content[0] + '<i class="layui-layer-TipsG"></i>';
     config.title = false;
     config.tips = typeof config.tips === 'object' ? config.tips : [config.tips, true];
     config.tipsMore || layer.closeAll('tips');
   break;
 }
 
 //建立容器
 that.vessel(conType, function(html, titleHTML){
   $('body').append(html[0]);
   conType ? function(){
     (config.type == 2 || config.type == 4) ? function(){
       $('body').append(html[1]);
     }() : function(){
       if(!content.parents('.'+doms[0])[0]){
         content.show().addClass('layui-layer-wrap').wrap(html[1]);
         $('#'+ doms[0] + times).find('.'+doms[5]).before(titleHTML);
       }
     }();
   }() : $('body').append(html[1]);
   that.layero = $('#'+ doms[0] + times);
   config.scrollbar || doms.html.css('overflow', 'hidden').attr('layer-full', times);
 }).auto(times);

 config.type == 2 && layer.ie6 && that.layero.find('iframe').attr('src', content[0]);
 $(document).off('keydown', ready.enter).on('keydown', ready.enter);
 that.layero.on('keydown', function(e){
   $(document).off('keydown', ready.enter);
 });

 //坐标自适应浏览器窗口尺寸
 config.type == 4 ? that.tips() : that.offset();
 if(config.fix){
   win.on('resize', function(){
     that.offset();
     (/^\d+%$/.test(config.area[0]) || /^\d+%$/.test(config.area[1])) && that.auto(times);
     config.type == 4 && that.tips();
   });
 }
 
 config.time <= 0 || setTimeout(function(){
   layer.close(that.index)
 }, config.time);
 that.move().callback();
 
 //为兼容jQuery3.0的css动画影响元素尺寸计算
 if(doms.anim[config.shift]){
   that.layero.addClass(doms.anim[config.shift]);
 };
 
};

//自适应
Class.pt.auto = function(index){
 var that = this, config = that.config, layero = $('#'+ doms[0] + index);
 if(config.area[0] === '' && config.maxWidth > 0){
   //为了修复IE7下一个让人难以理解的bug
   if(/MSIE 7/.test(navigator.userAgent) && config.btn){
     layero.width(layero.innerWidth());
   }
   layero.outerWidth() > config.maxWidth && layero.width(config.maxWidth);
 }
 var area = [layero.innerWidth(), layero.innerHeight()];
 var titHeight = layero.find(doms[1]).outerHeight() || 0;
 var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
 function setHeight(elem){
   elem = layero.find(elem);
   elem.height(area[1] - titHeight - btnHeight - 2*(parseFloat(elem.css('padding'))|0));
 }
 switch(config.type){
   case 2: 
     setHeight('iframe');
   break;
   default:
     if(config.area[1] === ''){
       if(config.fix && area[1] >= win.height()){
         area[1] = win.height();
         setHeight('.'+doms[5]);
       }
     } else {
       setHeight('.'+doms[5]);
     }
   break;
 }
 return that;
};

//计算坐标
Class.pt.offset = function(){
 var that = this, config = that.config, layero = that.layero;
 var area = [layero.outerWidth(), layero.outerHeight()];
 var type = typeof config.offset === 'object';
 that.offsetTop = (win.height() - area[1])/2;
 that.offsetLeft = (win.width() - area[0])/2;
 if(type){
   that.offsetTop = config.offset[0];
   that.offsetLeft = config.offset[1]||that.offsetLeft;
 } else if(config.offset !== 'auto'){
   that.offsetTop = config.offset;
   if(config.offset === 'rb'){ //右下角
     that.offsetTop = win.height() - area[1];
     that.offsetLeft = win.width() - area[0];
   }
 }
 if(!config.fix){
   that.offsetTop = /%$/.test(that.offsetTop) ? 
     win.height()*parseFloat(that.offsetTop)/100
   : parseFloat(that.offsetTop);
   that.offsetLeft = /%$/.test(that.offsetLeft) ? 
     win.width()*parseFloat(that.offsetLeft)/100
   : parseFloat(that.offsetLeft);
   that.offsetTop += win.scrollTop();
   that.offsetLeft += win.scrollLeft();
 }
 layero.css({top: that.offsetTop, left: that.offsetLeft});
};

//Tips
Class.pt.tips = function(){
 var that = this, config = that.config, layero = that.layero;
 var layArea = [layero.outerWidth(), layero.outerHeight()], follow = $(config.follow);
 if(!follow[0]) follow = $('body');
 var goal = {
   width: follow.outerWidth(),
   height: follow.outerHeight(),
   top: follow.offset().top,
   left: follow.offset().left
 }, tipsG = layero.find('.layui-layer-TipsG');
 
 var guide = config.tips[0];
 config.tips[1] || tipsG.remove();
 
 goal.autoLeft = function(){
   if(goal.left + layArea[0] - win.width() > 0){
     goal.tipLeft = goal.left + goal.width - layArea[0];
     tipsG.css({right: 12, left: 'auto'});
   } else {
     goal.tipLeft = goal.left;
   };
 };
 
 //辨别tips的方位
 goal.where = [function(){ //上        
   goal.autoLeft();
   goal.tipTop = goal.top - layArea[1] - 10;
   tipsG.removeClass('layui-layer-TipsB').addClass('layui-layer-TipsT').css('border-right-color', config.tips[1]);
 }, function(){ //右
   goal.tipLeft = goal.left + goal.width + 10;
   goal.tipTop = goal.top;
   tipsG.removeClass('layui-layer-TipsL').addClass('layui-layer-TipsR').css('border-bottom-color', config.tips[1]); 
 }, function(){ //下
   goal.autoLeft();
   goal.tipTop = goal.top + goal.height + 10;
   tipsG.removeClass('layui-layer-TipsT').addClass('layui-layer-TipsB').css('border-right-color', config.tips[1]);
 }, function(){ //左
   goal.tipLeft = goal.left - layArea[0] - 10;
   goal.tipTop = goal.top;
   tipsG.removeClass('layui-layer-TipsR').addClass('layui-layer-TipsL').css('border-bottom-color', config.tips[1]);
 }];
 goal.where[guide-1]();
 
 /* 8*2为小三角形占据的空间 */
 if(guide === 1){
   goal.top - (win.scrollTop() + layArea[1] + 8*2) < 0 && goal.where[2]();
 } else if(guide === 2){
   win.width() - (goal.left + goal.width + layArea[0] + 8*2) > 0 || goal.where[3]()
 } else if(guide === 3){
   (goal.top - win.scrollTop() + goal.height + layArea[1] + 8*2) - win.height() > 0 && goal.where[0]();
 } else if(guide === 4){
    layArea[0] + 8*2 - goal.left > 0 && goal.where[1]()
 }

 layero.find('.'+doms[5]).css({
   'background-color': config.tips[1], 
   'padding-right': (config.closeBtn ? '30px' : '')
 });
 layero.css({
   left: goal.tipLeft - (config.fix ? win.scrollLeft() : 0), 
   top: goal.tipTop  - (config.fix ? win.scrollTop() : 0)
 });
}

//拖拽层
Class.pt.move = function(){
 var that = this, config = that.config, conf = {
   setY: 0,
   moveLayer: function(){
     var layero = conf.layero, mgleft = parseInt(layero.css('margin-left'));
     var lefts = parseInt(conf.move.css('left'));
     mgleft === 0 || (lefts = lefts - mgleft);
     if(layero.css('position') !== 'fixed'){
       lefts = lefts - layero.parent().offset().left;
       conf.setY = 0;
     }
     layero.css({left: lefts, top: parseInt(conf.move.css('top')) - conf.setY});
   }
 };
 
 var movedom = that.layero.find(config.move);
 config.move && movedom.attr('move', 'ok');
 movedom.css({cursor: config.move ? 'move' : 'auto'});
 
 $(config.move).on('mousedown', function(M){  
   M.preventDefault();
   if($(this).attr('move') === 'ok'){
     conf.ismove = true;
     conf.layero = $(this).parents('.'+ doms[0]);
     var xx = conf.layero.offset().left, yy = conf.layero.offset().top, ww = conf.layero.outerWidth() - 6, hh = conf.layero.outerHeight() - 6;
     if(!$('#layui-layer-moves')[0]){
       $('body').append('<div id="layui-layer-moves" class="layui-layer-moves" style="left:'+ xx +'px; top:'+ yy +'px; width:'+ ww +'px; height:'+ hh +'px; z-index:2147483584"></div>');
     }
     conf.move = $('#layui-layer-moves');
     config.moveType && conf.move.css({visibility: 'hidden'});
      
     conf.moveX = M.pageX - conf.move.position().left;
     conf.moveY = M.pageY - conf.move.position().top;
     conf.layero.css('position') !== 'fixed' || (conf.setY = win.scrollTop());
   }
 });
 
 $(document).mousemove(function(M){
   if(conf.ismove){
     var offsetX = M.pageX - conf.moveX, offsetY = M.pageY - conf.moveY;
     M.preventDefault();

     //控制元素不被拖出窗口外
     if(!config.moveOut){
       conf.setY = win.scrollTop();
       var setRig = win.width() - conf.move.outerWidth(), setTop = conf.setY;         
       offsetX < 0 && (offsetX = 0);
       offsetX > setRig && (offsetX = setRig); 
       offsetY < setTop && (offsetY = setTop);
       offsetY > win.height() - conf.move.outerHeight() + conf.setY && (offsetY = win.height() - conf.move.outerHeight() + conf.setY);
     }
     
     conf.move.css({left: offsetX, top: offsetY});  
     config.moveType && conf.moveLayer();
     
     offsetX = offsetY = setRig = setTop = null;
   }                         
 }).mouseup(function(){
   try{
     if(conf.ismove){
       conf.moveLayer();
       conf.move.remove();
       config.moveEnd && config.moveEnd();
     }
     conf.ismove = false;
   }catch(e){
     conf.ismove = false;
   }
 });
 return that;
};

Class.pt.callback = function(){
 var that = this, layero = that.layero, config = that.config;
 that.openLayer();
 if(config.success){
   if(config.type == 2){
     layero.find('iframe').on('load', function(){
       config.success(layero, that.index);
     });
   } else {
     config.success(layero, that.index);
   }
 }
 layer.ie6 && that.IE6(layero);
 
 //按钮
 layero.find('.'+ doms[6]).children('a').on('click', function(){
   var index = $(this).index();
   if(index === 0){
     if(config.yes){
       config.yes(that.index, layero)
     } else if(config['btn1']){
       config['btn1'](that.index, layero)
     } else {
       layer.close(that.index);
     }
   } else {
     var close = config['btn'+(index+1)] && config['btn'+(index+1)](that.index, layero);
     close === false || layer.close(that.index);
   }
 });
 
 //取消
 function cancel(){
   var close = config.cancel && config.cancel(that.index, layero);
   close === false || layer.close(that.index);
 }
 
 //右上角关闭回调
 layero.find('.'+ doms[7]).on('click', cancel);
 
 //点遮罩关闭
 if(config.shadeClose){
   $('#layui-layer-shade'+ that.index).on('click', function(){
     layer.close(that.index);
   });
 } 
 
 //最小化
 layero.find('.layui-layer-min').on('click', function(){
   var min = config.min && config.min(layero);
   min === false || layer.min(that.index, config); 
 });
 
 //全屏/还原
 layero.find('.layui-layer-max').on('click', function(){
   if($(this).hasClass('layui-layer-maxmin')){
     layer.restore(that.index);
     config.restore && config.restore(layero);
   } else {
     layer.full(that.index, config);
     setTimeout(function(){
       config.full && config.full(layero);
     }, 100);
   }
 });

 config.end && (ready.end[that.index] = config.end);
};

//for ie6 恢复select
ready.reselect = function(){
 $.each($('select'), function(index , value){
   var sthis = $(this);
   if(!sthis.parents('.'+doms[0])[0]){
     (sthis.attr('layer') == 1 && $('.'+doms[0]).length < 1) && sthis.removeAttr('layer').show(); 
   }
   sthis = null;
 });
}; 

Class.pt.IE6 = function(layero){
 var that = this, _ieTop = layero.offset().top;
 
 //ie6的固定与相对定位
 function ie6Fix(){
   layero.css({top : _ieTop + (that.config.fix ? win.scrollTop() : 0)});
 };
 ie6Fix();
 win.scroll(ie6Fix);

 //隐藏select
 $('select').each(function(index , value){
   var sthis = $(this);
   if(!sthis.parents('.'+doms[0])[0]){
     sthis.css('display') === 'none' || sthis.attr({'layer' : '1'}).hide();
   }
   sthis = null;
 });
};

//需依赖原型的对外方法
Class.pt.openLayer = function(){
 var that = this;
 
 //置顶当前窗口
 layer.zIndex = that.config.zIndex;
 layer.setTop = function(layero){
   var setZindex = function(){
     layer.zIndex++;
     layero.css('z-index', layer.zIndex + 1);
   };
   layer.zIndex = parseInt(layero[0].style.zIndex);
   layero.on('mousedown', setZindex);
   return layer.zIndex;
 };
};

ready.record = function(layero){
 var area = [
   layero.width(),
   layero.height(),
   layero.position().top, 
   layero.position().left + parseFloat(layero.css('margin-left'))
 ];
 layero.find('.layui-layer-max').addClass('layui-layer-maxmin');
 layero.attr({area: area});
};

ready.rescollbar = function(index){
 if(doms.html.attr('layer-full') == index){
   if(doms.html[0].style.removeProperty){
     doms.html[0].style.removeProperty('overflow');
   } else {
     doms.html[0].style.removeAttribute('overflow');
   }
   doms.html.removeAttr('layer-full');
 }
};

/** 内置成员 */

window.layer = layer;

//获取子iframe的DOM
layer.getChildFrame = function(selector, index){
 index = index || $('.'+doms[4]).attr('times');
 return $('#'+ doms[0] + index).find('iframe').contents().find(selector);  
};

//得到当前iframe层的索引，子iframe时使用
layer.getFrameIndex = function(name){
 return $('#'+ name).parents('.'+doms[4]).attr('times');
};

//iframe层自适应宽高
layer.iframeAuto = function(index){
 if(!index) return;
 var heg = layer.getChildFrame('html', index).outerHeight();
 var layero = $('#'+ doms[0] + index);
 var titHeight = layero.find(doms[1]).outerHeight() || 0;
 var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
 layero.css({height: heg + titHeight + btnHeight});
 layero.find('iframe').css({height: heg});
};

//重置iframe url
layer.iframeSrc = function(index, url){
 $('#'+ doms[0] + index).find('iframe').attr('src', url);
};

//设定层的样式
layer.style = function(index, options){
 var layero = $('#'+ doms[0] + index), type = layero.attr('type');
 var titHeight = layero.find(doms[1]).outerHeight() || 0;
 var btnHeight = layero.find('.'+doms[6]).outerHeight() || 0;
 if(type === ready.type[1] || type === ready.type[2]){
   layero.css(options);
   if(type === ready.type[2]){
     layero.find('iframe').css({
       height: parseFloat(options.height) - titHeight - btnHeight
     });
   }
 }
};

//最小化
layer.min = function(index, options){
 var layero = $('#'+ doms[0] + index);
 var titHeight = layero.find(doms[1]).outerHeight() || 0;
 ready.record(layero);
 layer.style(index, {width: 180, height: titHeight, overflow: 'hidden'});
 layero.find('.layui-layer-min').hide();
 layero.attr('type') === 'page' && layero.find(doms[4]).hide();
 ready.rescollbar(index);
};

//还原
layer.restore = function(index){
 var layero = $('#'+ doms[0] + index), area = layero.attr('area').split(',');
 var type = layero.attr('type');
 layer.style(index, {
   width: parseFloat(area[0]), 
   height: parseFloat(area[1]), 
   top: parseFloat(area[2]), 
   left: parseFloat(area[3]),
   overflow: 'visible'
 });
 layero.find('.layui-layer-max').removeClass('layui-layer-maxmin');
 layero.find('.layui-layer-min').show();
 layero.attr('type') === 'page' && layero.find(doms[4]).show();
 ready.rescollbar(index);
};

//全屏
layer.full = function(index){
 var layero = $('#'+ doms[0] + index), timer;
 ready.record(layero);
 if(!doms.html.attr('layer-full')){
   doms.html.css('overflow','hidden').attr('layer-full', index);
 }
 clearTimeout(timer);
 timer = setTimeout(function(){
   var isfix = layero.css('position') === 'fixed';
   layer.style(index, {
      top: isfix ? 0 : win.scrollTop(),
      left: isfix ? 0 : win.scrollLeft(),
      width: win.width(),
      height: win.height()
   });
   layero.find('.layui-layer-min').hide();
 }, 100);
};

//改变title
layer.title = function(name, index){
 var title = $('#'+ doms[0] + (index||layer.index)).find(doms[1]);
 title.html(name);
};

//关闭layer总方法
layer.close = function(index){
 var layero = $('#'+ doms[0] + index), type = layero.attr('type');
 if(!layero[0]) return;
 if(type === ready.type[1] && layero.attr('conType') === 'object'){
   layero.children(':not(.'+ doms[5] +')').remove();
   for(var i = 0; i < 2; i++){
     layero.find('.layui-layer-wrap').unwrap().hide();
   }
 } else {
   //低版本IE 回收 iframe
   if(type === ready.type[2]){
     try {
       var iframe = $('#'+doms[4]+index)[0];
       iframe.contentWindow.document.write('');
       iframe.contentWindow.close();
       layero.find('.'+doms[5])[0].removeChild(iframe);
     } catch(e){}
   }
   layero[0].innerHTML = '';
   layero.remove();
 }
 $('#layui-layer-moves, #layui-layer-shade' + index).remove();
 layer.ie6 && ready.reselect();
 ready.rescollbar(index);
 $(document).off('keydown', ready.enter);
 typeof ready.end[index] === 'function' && ready.end[index]();
 delete ready.end[index]; 
};

//关闭所有层
layer.closeAll = function(type){
 $.each($('.'+doms[0]), function(){
   var othis = $(this);
   var is = type ? (othis.attr('type') === type) : 1;
   is && layer.close(othis.attr('times'));
   is = null;
 });
};

/** 
 拓展模块，layui开始合并在一起
*/

var cache = layer.cache||{}, skin = function(type){
 return (cache.skin ? (' ' + cache.skin + ' ' + cache.skin + '-'+type) : '');
}; 

//仿系统prompt
layer.prompt = function(options, yes){
 options = options || {};
 if(typeof options === 'function') yes = options;
 var prompt, content = options.formType == 2 ? '<textarea class="layui-layer-input">'+ (options.value||'') +'</textarea>' : function(){
   return '<input type="'+ (options.formType == 1 ? 'password' : 'text') +'" class="layui-layer-input" value="'+ (options.value||'') +'">';
 }();
 return layer.open($.extend({
   btn: ['&#x786E;&#x5B9A;','&#x53D6;&#x6D88;'],
   content: content,
   skin: 'layui-layer-prompt' + skin('prompt'),
   success: function(layero){
     prompt = layero.find('.layui-layer-input');
     prompt.focus();
   }, yes: function(index){
     var value = prompt.val();
     if(value === ''){
       prompt.focus();
     } else if(value.length > (options.maxlength||500)) {
       layer.tips('&#x6700;&#x591A;&#x8F93;&#x5165;'+ (options.maxlength || 500) +'&#x4E2A;&#x5B57;&#x6570;', prompt, {tips: 1});
     } else {
       yes && yes(value, index, prompt);
     }
   }
 }, options));
};

//tab层
layer.tab = function(options){
 options = options || {};
 var tab = options.tab || {};
 return layer.open($.extend({
   type: 1,
   skin: 'layui-layer-tab' + skin('tab'),
   title: function(){
     var len = tab.length, ii = 1, str = '';
     if(len > 0){
       str = '<span class="layui-layer-tabnow">'+ tab[0].title +'</span>';
       for(; ii < len; ii++){
         str += '<span>'+ tab[ii].title +'</span>';
       }
     }
     return str;
   }(),
   content: '<ul class="layui-layer-tabmain">'+ function(){
     var len = tab.length, ii = 1, str = '';
     if(len > 0){
       str = '<li class="layui-layer-tabli xubox_tab_layer">'+ (tab[0].content || 'no content') +'</li>';
       for(; ii < len; ii++){
         str += '<li class="layui-layer-tabli">'+ (tab[ii].content || 'no  content') +'</li>';
       }
     }
     return str;
   }() +'</ul>',
   success: function(layero){
     var btn = layero.find('.layui-layer-title').children();
     var main = layero.find('.layui-layer-tabmain').children();
     btn.on('mousedown', function(e){
       e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
       var othis = $(this), index = othis.index();
       othis.addClass('layui-layer-tabnow').siblings().removeClass('layui-layer-tabnow');
       main.eq(index).show().siblings().hide();
       typeof options.change === 'function' && options.change(index);
     });
   }
 }, options));
};

//相册层
layer.photos = function(options, loop, key){
 var dict = {};
 options = options || {};
 if(!options.photos) return;
 var type = options.photos.constructor === Object;
 var photos = type ? options.photos : {}, data = photos.data || [];
 var start = photos.start || 0;
 dict.imgIndex = (start|0) + 1;
 
 options.img = options.img || 'img';

 if(!type){ //页面直接获取
   var parent = $(options.photos), pushData = function(){
     data = [];
     parent.find(options.img).each(function(index){
       var othis = $(this);
       othis.attr('layer-index', index);
       data.push({
         alt: othis.attr('alt'),
         pid: othis.attr('layer-pid'),
         src: othis.attr('layer-src') || othis.attr('src'),
         thumb: othis.attr('src')
       });
     })
   };
   
   pushData();
   
   if (data.length === 0) return;
   
   loop || parent.on('click', options.img, function(){
     var othis = $(this), index = othis.attr('layer-index'); 
     layer.photos($.extend(options, {
       photos: {
         start: index,
         data: data,
         tab: options.tab
       },
       full: options.full
     }), true);
     pushData();
   })
   
   //不直接弹出
   if(!loop) return;
   
 } else if (data.length === 0){
   return layer.msg('&#x6CA1;&#x6709;&#x56FE;&#x7247;');
 }
 
 //上一张
 dict.imgprev = function(key){
   dict.imgIndex--;
   if(dict.imgIndex < 1){
     dict.imgIndex = data.length;
   }
   dict.tabimg(key);
 };
 
 //下一张
 dict.imgnext = function(key,errorMsg){
   dict.imgIndex++;
   if(dict.imgIndex > data.length){
     dict.imgIndex = 1;
     if (errorMsg) {return};
   }
   dict.tabimg(key)
 };
 
 //方向键
 dict.keyup = function(event){
   if(!dict.end){
     var code = event.keyCode;
     event.preventDefault();
     if(code === 37){
       dict.imgprev(true);
     } else if(code === 39) {
       dict.imgnext(true);
     } else if(code === 27) {
       layer.close(dict.index);
     }
   }
 }
 
 //切换
 dict.tabimg = function(key){
   if(data.length <= 1) return;
   photos.start = dict.imgIndex - 1;
   layer.close(dict.index);
   layer.photos(options, true, key);
 }
 
 //一些动作
 dict.event = function(){
   dict.bigimg.hover(function(){
     dict.imgsee.show();
   }, function(){
     dict.imgsee.hide();
   });
   
   dict.bigimg.find('.layui-layer-imgprev').on('click', function(event){
     event.preventDefault();
     dict.imgprev();
   });  
   
   dict.bigimg.find('.layui-layer-imgnext').on('click', function(event){     
     event.preventDefault();
     dict.imgnext();
   });
   
   $(document).on('keyup', dict.keyup);
 };
 
 //图片预加载
 function loadImage(url, callback, error) {   
   var img = new Image();
   img.src = url; 
   if(img.complete){
     return callback(img);
   }
   img.onload = function(){
     img.onload = null;
     callback(img);
   };
   img.onerror = function(e){
     img.onerror = null;
     error(e);
   };  
 };
 
 dict.loadi = layer.load(1, {
   shade: 'shade' in options ? false : 0.9,
   scrollbar: false
 });
 loadImage(data[start].src, function(img){
   layer.close(dict.loadi);
   dict.index = layer.open($.extend({
     type: 1,
     area: function(){
        var imgarea = [img.width, img.height];
        var winarea = [$(window).width() - 50, $(window).height() - 50];
        if(!options.full && imgarea[0] > winarea[0]){
          imgarea[0] = winarea[0];
          imgarea[1] = imgarea[0]*img.height/img.width;
        }
        return [imgarea[0]+'px', imgarea[1]+'px']; 
     }(),
     title: false,
     shade: 0.9,
     shadeClose: true,
     closeBtn: false,
     move: '.layui-layer-phimg img',
     moveType: 1,
     scrollbar: false,
     moveOut: true,
     shift: Math.random()*5|0,
     skin: 'layui-layer-photos' + skin('photos'),
     content: '<div class="layui-layer-phimg">'
       +'<img src="'+ data[start].src +'" alt="'+ (data[start].alt||'') +'" layer-pid="'+ data[start].pid +'">'
       +'<div class="layui-layer-imgsee">'
         +(data.length > 1 ? '<span class="layui-layer-imguide"><a href="javascript:;" class="layui-layer-iconext layui-layer-imgprev"></a><a href="javascript:;" class="layui-layer-iconext layui-layer-imgnext"></a></span>' : '')
         +'<div class="layui-layer-imgbar" style="display:'+ (key ? 'block' : '') +'"><span class="layui-layer-imgtit"><a href="javascript:;">'+ (data[start].alt||'') +'</a><em>'+ dict.imgIndex +'/'+ data.length +'</em></span></div>'
       +'</div>'
     +'</div>',
     success: function(layero, index){
       dict.bigimg = layero.find('.layui-layer-phimg');
       dict.imgsee = layero.find('.layui-layer-imguide,.layui-layer-imgbar');
       dict.event(layero);
       options.tab && options.tab(data[start], layero);
     }, end: function(){
       dict.end = true;
       $(document).off('keyup', dict.keyup);
     }
   }, options));
 }, function(){
   layer.close(dict.loadi);
   layer.msg('&#x5F53;&#x524D;&#x56FE;&#x7247;&#x5730;&#x5740;&#x5F02;&#x5E38;<br>&#x662F;&#x5426;&#x7EE7;&#x7EED;&#x67E5;&#x770B;&#x4E0B;&#x4E00;&#x5F20;&#xFF1F;', {
     time: 30000, 
     btn: ['&#x4E0B;&#x4E00;&#x5F20;', '&#x4E0D;&#x770B;&#x4E86;'], 
     yes: function(){
       data.length > 1 && dict.imgnext(true,true);
     }
   });
 });
};

//主入口
ready.run = function(){
 $ = jQuery; 
 win = $(window);
 doms.html = $('html');
 layer.open = function(deliver){
   var o = new Class(deliver);
   return o.index;
 };
};

'function' === typeof define ? define(function(){
 ready.run();
 return layer;
}) : function(){
  ready.run();
  layer.use('skin/layer.css');
}();

})(window);

/**
 * 
 * @param a
 */
(function() {
	  var AjaxMonitor, Bar, DocumentMonitor, ElementMonitor, ElementTracker, EventLagMonitor, Evented, Events, NoTargetError, Pace, RequestIntercept, SOURCE_KEYS, Scaler, SocketRequestTracker, XHRRequestTracker, animation, avgAmplitude, bar, cancelAnimation, cancelAnimationFrame, defaultOptions, extend, extendNative, getFromDOM, getIntercept, handlePushState, ignoreStack, init, now, options, requestAnimationFrame, result, runAnimation, scalers, shouldIgnoreURL, shouldTrack, source, sources, uniScaler, _WebSocket, _XDomainRequest, _XMLHttpRequest, _i, _intercept, _len, _pushState, _ref, _ref1, _replaceState,
	    __slice = [].slice,
	    __hasProp = {}.hasOwnProperty,
	    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
	    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	  defaultOptions = {
	    catchupTime: 100,
	    initialRate: .03,
	    minTime: 250,
	    ghostTime: 100,
	    maxProgressPerFrame: 20,
	    easeFactor: 1.25,
	    startOnPageLoad: true,
	    restartOnPushState: true,
	    restartOnRequestAfter: 500,
	    target: 'body',
	    elements: {
	      checkInterval: 100,
	      selectors: ['body']
	    },
	    eventLag: {
	      minSamples: 10,
	      sampleCount: 3,
	      lagThreshold: 3
	    },
	    ajax: {
	      trackMethods: ['GET'],
	      trackWebSockets: true,
	      ignoreURLs: []
	    }
	  };

	  now = function() {
	    var _ref;
	    return (_ref = typeof performance !== "undefined" && performance !== null ? typeof performance.now === "function" ? performance.now() : void 0 : void 0) != null ? _ref : +(new Date);
	  };

	  requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	  cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

	  if (requestAnimationFrame == null) {
	    requestAnimationFrame = function(fn) {
	      return setTimeout(fn, 50);
	    };
	    cancelAnimationFrame = function(id) {
	      return clearTimeout(id);
	    };
	  }

	  runAnimation = function(fn) {
	    var last, tick;
	    last = now();
	    tick = function() {
	      var diff;
	      diff = now() - last;
	      if (diff >= 33) {
	        last = now();
	        return fn(diff, function() {
	          return requestAnimationFrame(tick);
	        });
	      } else {
	        return setTimeout(tick, 33 - diff);
	      }
	    };
	    return tick();
	  };

	  result = function() {
	    var args, key, obj;
	    obj = arguments[0], key = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
	    if (typeof obj[key] === 'function') {
	      return obj[key].apply(obj, args);
	    } else {
	      return obj[key];
	    }
	  };

	  extend = function() {
	    var key, out, source, sources, val, _i, _len;
	    out = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    for (_i = 0, _len = sources.length; _i < _len; _i++) {
	      source = sources[_i];
	      if (source) {
	        for (key in source) {
	          if (!__hasProp.call(source, key)) continue;
	          val = source[key];
	          if ((out[key] != null) && typeof out[key] === 'object' && (val != null) && typeof val === 'object') {
	            extend(out[key], val);
	          } else {
	            out[key] = val;
	          }
	        }
	      }
	    }
	    return out;
	  };

	  avgAmplitude = function(arr) {
	    var count, sum, v, _i, _len;
	    sum = count = 0;
	    for (_i = 0, _len = arr.length; _i < _len; _i++) {
	      v = arr[_i];
	      sum += Math.abs(v);
	      count++;
	    }
	    return sum / count;
	  };

	  getFromDOM = function(key, json) {
	    var data, e, el;
	    if (key == null) {
	      key = 'options';
	    }
	    if (json == null) {
	      json = true;
	    }
	    el = document.querySelector("[data-pace-" + key + "]");
	    if (!el) {
	      return;
	    }
	    data = el.getAttribute("data-pace-" + key);
	    if (!json) {
	      return data;
	    }
	    try {
	      return JSON.parse(data);
	    } catch (_error) {
	      e = _error;
	      return typeof console !== "undefined" && console !== null ? console.error("Error parsing inline pace options", e) : void 0;
	    }
	  };

	  Evented = (function() {
	    function Evented() {}

	    Evented.prototype.on = function(event, handler, ctx, once) {
	      var _base;
	      if (once == null) {
	        once = false;
	      }
	      if (this.bindings == null) {
	        this.bindings = {};
	      }
	      if ((_base = this.bindings)[event] == null) {
	        _base[event] = [];
	      }
	      return this.bindings[event].push({
	        handler: handler,
	        ctx: ctx,
	        once: once
	      });
	    };

	    Evented.prototype.once = function(event, handler, ctx) {
	      return this.on(event, handler, ctx, true);
	    };

	    Evented.prototype.off = function(event, handler) {
	      var i, _ref, _results;
	      if (((_ref = this.bindings) != null ? _ref[event] : void 0) == null) {
	        return;
	      }
	      if (handler == null) {
	        return delete this.bindings[event];
	      } else {
	        i = 0;
	        _results = [];
	        while (i < this.bindings[event].length) {
	          if (this.bindings[event][i].handler === handler) {
	            _results.push(this.bindings[event].splice(i, 1));
	          } else {
	            _results.push(i++);
	          }
	        }
	        return _results;
	      }
	    };

	    Evented.prototype.trigger = function() {
	      var args, ctx, event, handler, i, once, _ref, _ref1, _results;
	      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	      if ((_ref = this.bindings) != null ? _ref[event] : void 0) {
	        i = 0;
	        _results = [];
	        while (i < this.bindings[event].length) {
	          _ref1 = this.bindings[event][i], handler = _ref1.handler, ctx = _ref1.ctx, once = _ref1.once;
	          handler.apply(ctx != null ? ctx : this, args);
	          if (once) {
	            _results.push(this.bindings[event].splice(i, 1));
	          } else {
	            _results.push(i++);
	          }
	        }
	        return _results;
	      }
	    };

	    return Evented;

	  })();

	  Pace = window.Pace || {};

	  window.Pace = Pace;

	  extend(Pace, Evented.prototype);

	  options = Pace.options = extend({}, defaultOptions, window.paceOptions, getFromDOM());

	  _ref = ['ajax', 'document', 'eventLag', 'elements'];
	  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	    source = _ref[_i];
	    if (options[source] === true) {
	      options[source] = defaultOptions[source];
	    }
	  }

	  NoTargetError = (function(_super) {
	    __extends(NoTargetError, _super);

	    function NoTargetError() {
	      _ref1 = NoTargetError.__super__.constructor.apply(this, arguments);
	      return _ref1;
	    }

	    return NoTargetError;

	  })(Error);

	  Bar = (function() {
	    function Bar() {
	      this.progress = 0;
	    }

	    Bar.prototype.getElement = function() {
	      var targetElement;
	      if (this.el == null) {
	        targetElement = document.querySelector(options.target);
	        if (!targetElement) {
	          throw new NoTargetError;
	        }
	        this.el = document.createElement('div');
	        this.el.className = "pace pace-active";
	        document.body.className = document.body.className.replace(/pace-done/g, '');
	        document.body.className += ' pace-running';
	        this.el.innerHTML = '<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>';
	        if (targetElement.firstChild != null) {
	          targetElement.insertBefore(this.el, targetElement.firstChild);
	        } else {
	          targetElement.appendChild(this.el);
	        }
	      }
	      return this.el;
	    };

	    Bar.prototype.finish = function() {
	      var el;
	      el = this.getElement();
	      el.className = el.className.replace('pace-active', '');
	      el.className += ' pace-inactive';
	      document.body.className = document.body.className.replace('pace-running', '');
	      return document.body.className += ' pace-done';
	    };

	    Bar.prototype.update = function(prog) {
	      this.progress = prog;
	      return this.render();
	    };

	    Bar.prototype.destroy = function() {
	      try {
	        this.getElement().parentNode.removeChild(this.getElement());
	      } catch (_error) {
	        NoTargetError = _error;
	      }
	      return this.el = void 0;
	    };

	    Bar.prototype.render = function() {
	      var el, key, progressStr, transform, _j, _len1, _ref2;
	      if (document.querySelector(options.target) == null) {
	        return false;
	      }
	      el = this.getElement();
	      transform = "translate3d(" + this.progress + "%, 0, 0)";
	      _ref2 = ['webkitTransform', 'msTransform', 'transform'];
	      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	        key = _ref2[_j];
	        el.children[0].style[key] = transform;
	      }
	      if (!this.lastRenderedProgress || this.lastRenderedProgress | 0 !== this.progress | 0) {
	        el.children[0].setAttribute('data-progress-text', "" + (this.progress | 0) + "%");
	        if (this.progress >= 100) {
	          progressStr = '99';
	        } else {
	          progressStr = this.progress < 10 ? "0" : "";
	          progressStr += this.progress | 0;
	        }
	        el.children[0].setAttribute('data-progress', "" + progressStr);
	      }
	      return this.lastRenderedProgress = this.progress;
	    };

	    Bar.prototype.done = function() {
	      return this.progress >= 100;
	    };

	    return Bar;

	  })();

	  Events = (function() {
	    function Events() {
	      this.bindings = {};
	    }

	    Events.prototype.trigger = function(name, val) {
	      var binding, _j, _len1, _ref2, _results;
	      if (this.bindings[name] != null) {
	        _ref2 = this.bindings[name];
	        _results = [];
	        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	          binding = _ref2[_j];
	          _results.push(binding.call(this, val));
	        }
	        return _results;
	      }
	    };

	    Events.prototype.on = function(name, fn) {
	      var _base;
	      if ((_base = this.bindings)[name] == null) {
	        _base[name] = [];
	      }
	      return this.bindings[name].push(fn);
	    };

	    return Events;

	  })();

	  _XMLHttpRequest = window.XMLHttpRequest;

	  _XDomainRequest = window.XDomainRequest;

	  _WebSocket = window.WebSocket;

	  extendNative = function(to, from) {
	    var e, key, _results;
	    _results = [];
	    for (key in from.prototype) {
	      try {
	        if ((to[key] == null) && typeof from[key] !== 'function') {
	          if (typeof Object.defineProperty === 'function') {
	            _results.push(Object.defineProperty(to, key, {
	              get: function() {
	                return from.prototype[key];
	              },
	              configurable: true,
	              enumerable: true
	            }));
	          } else {
	            _results.push(to[key] = from.prototype[key]);
	          }
	        } else {
	          _results.push(void 0);
	        }
	      } catch (_error) {
	        e = _error;
	      }
	    }
	    return _results;
	  };

	  ignoreStack = [];

	  Pace.ignore = function() {
	    var args, fn, ret;
	    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    ignoreStack.unshift('ignore');
	    ret = fn.apply(null, args);
	    ignoreStack.shift();
	    return ret;
	  };

	  Pace.track = function() {
	    var args, fn, ret;
	    fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	    ignoreStack.unshift('track');
	    ret = fn.apply(null, args);
	    ignoreStack.shift();
	    return ret;
	  };

	  shouldTrack = function(method) {
	    var _ref2;
	    if (method == null) {
	      method = 'GET';
	    }
	    if (ignoreStack[0] === 'track') {
	      return 'force';
	    }
	    if (!ignoreStack.length && options.ajax) {
	      if (method === 'socket' && options.ajax.trackWebSockets) {
	        return true;
	      } else if (_ref2 = method.toUpperCase(), __indexOf.call(options.ajax.trackMethods, _ref2) >= 0) {
	        return true;
	      }
	    }
	    return false;
	  };

	  RequestIntercept = (function(_super) {
	    __extends(RequestIntercept, _super);

	    function RequestIntercept() {
	      var monitorXHR,
	        _this = this;
	      RequestIntercept.__super__.constructor.apply(this, arguments);
	      monitorXHR = function(req) {
	        var _open;
	        _open = req.open;
	        return req.open = function(type, url, async) {
	          if (shouldTrack(type)) {
	            _this.trigger('request', {
	              type: type,
	              url: url,
	              request: req
	            });
	          }
	          return _open.apply(req, arguments);
	        };
	      };
	      window.XMLHttpRequest = function(flags) {
	        var req;
	        req = new _XMLHttpRequest(flags);
	        monitorXHR(req);
	        return req;
	      };
	      try {
	        extendNative(window.XMLHttpRequest, _XMLHttpRequest);
	      } catch (_error) {}
	      if (_XDomainRequest != null) {
	        window.XDomainRequest = function() {
	          var req;
	          req = new _XDomainRequest;
	          monitorXHR(req);
	          return req;
	        };
	        try {
	          extendNative(window.XDomainRequest, _XDomainRequest);
	        } catch (_error) {}
	      }
	      if ((_WebSocket != null) && options.ajax.trackWebSockets) {
	        window.WebSocket = function(url, protocols) {
	          var req;
	          if (protocols != null) {
	            req = new _WebSocket(url, protocols);
	          } else {
	            req = new _WebSocket(url);
	          }
	          if (shouldTrack('socket')) {
	            _this.trigger('request', {
	              type: 'socket',
	              url: url,
	              protocols: protocols,
	              request: req
	            });
	          }
	          return req;
	        };
	        try {
	          extendNative(window.WebSocket, _WebSocket);
	        } catch (_error) {}
	      }
	    }

	    return RequestIntercept;

	  })(Events);

	  _intercept = null;

	  getIntercept = function() {
	    if (_intercept == null) {
	      _intercept = new RequestIntercept;
	    }
	    return _intercept;
	  };

	  shouldIgnoreURL = function(url) {
	    var pattern, _j, _len1, _ref2;
	    _ref2 = options.ajax.ignoreURLs;
	    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	      pattern = _ref2[_j];
	      if (typeof pattern === 'string') {
	        if (url.indexOf(pattern) !== -1) {
	          return true;
	        }
	      } else {
	        if (pattern.test(url)) {
	          return true;
	        }
	      }
	    }
	    return false;
	  };

	  getIntercept().on('request', function(_arg) {
	    var after, args, request, type, url;
	    type = _arg.type, request = _arg.request, url = _arg.url;
	    if (shouldIgnoreURL(url)) {
	      return;
	    }
	    if (!Pace.running && (options.restartOnRequestAfter !== false || shouldTrack(type) === 'force')) {
	      args = arguments;
	      after = options.restartOnRequestAfter || 0;
	      if (typeof after === 'boolean') {
	        after = 0;
	      }
	      return setTimeout(function() {
	        var stillActive, _j, _len1, _ref2, _ref3, _results;
	        if (type === 'socket') {
	          stillActive = request.readyState < 2;
	        } else {
	          stillActive = (0 < (_ref2 = request.readyState) && _ref2 < 4);
	        }
	        if (stillActive) {
	          Pace.restart();
	          _ref3 = Pace.sources;
	          _results = [];
	          for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
	            source = _ref3[_j];
	            if (source instanceof AjaxMonitor) {
	              source.watch.apply(source, args);
	              break;
	            } else {
	              _results.push(void 0);
	            }
	          }
	          return _results;
	        }
	      }, after);
	    }
	  });

	  AjaxMonitor = (function() {
	    function AjaxMonitor() {
	      var _this = this;
	      this.elements = [];
	      getIntercept().on('request', function() {
	        return _this.watch.apply(_this, arguments);
	      });
	    }

	    AjaxMonitor.prototype.watch = function(_arg) {
	      var request, tracker, type, url;
	      type = _arg.type, request = _arg.request, url = _arg.url;
	      if (shouldIgnoreURL(url)) {
	        return;
	      }
	      if (type === 'socket') {
	        tracker = new SocketRequestTracker(request);
	      } else {
	        tracker = new XHRRequestTracker(request);
	      }
	      return this.elements.push(tracker);
	    };

	    return AjaxMonitor;

	  })();

	  XHRRequestTracker = (function() {
	    function XHRRequestTracker(request) {
	      var event, size, _j, _len1, _onreadystatechange, _ref2,
	        _this = this;
	      this.progress = 0;
	      if (window.ProgressEvent != null) {
	        size = null;
	        request.addEventListener('progress', function(evt) {
	          if (evt.lengthComputable) {
	            return _this.progress = 100 * evt.loaded / evt.total;
	          } else {
	            return _this.progress = _this.progress + (100 - _this.progress) / 2;
	          }
	        }, false);
	        _ref2 = ['load', 'abort', 'timeout', 'error'];
	        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	          event = _ref2[_j];
	          request.addEventListener(event, function() {
	            return _this.progress = 100;
	          }, false);
	        }
	      } else {
	        _onreadystatechange = request.onreadystatechange;
	        request.onreadystatechange = function() {
	          var _ref3;
	          if ((_ref3 = request.readyState) === 0 || _ref3 === 4) {
	            _this.progress = 100;
	          } else if (request.readyState === 3) {
	            _this.progress = 50;
	          }
	          return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
	        };
	      }
	    }

	    return XHRRequestTracker;

	  })();

	  SocketRequestTracker = (function() {
	    function SocketRequestTracker(request) {
	      var event, _j, _len1, _ref2,
	        _this = this;
	      this.progress = 0;
	      _ref2 = ['error', 'open'];
	      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	        event = _ref2[_j];
	        request.addEventListener(event, function() {
	          return _this.progress = 100;
	        }, false);
	      }
	    }

	    return SocketRequestTracker;

	  })();

	  ElementMonitor = (function() {
	    function ElementMonitor(options) {
	      var selector, _j, _len1, _ref2;
	      if (options == null) {
	        options = {};
	      }
	      this.elements = [];
	      if (options.selectors == null) {
	        options.selectors = [];
	      }
	      _ref2 = options.selectors;
	      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	        selector = _ref2[_j];
	        this.elements.push(new ElementTracker(selector));
	      }
	    }

	    return ElementMonitor;

	  })();

	  ElementTracker = (function() {
	    function ElementTracker(selector) {
	      this.selector = selector;
	      this.progress = 0;
	      this.check();
	    }

	    ElementTracker.prototype.check = function() {
	      var _this = this;
	      if (document.querySelector(this.selector)) {
	        return this.done();
	      } else {
	        return setTimeout((function() {
	          return _this.check();
	        }), options.elements.checkInterval);
	      }
	    };

	    ElementTracker.prototype.done = function() {
	      return this.progress = 100;
	    };

	    return ElementTracker;

	  })();

	  DocumentMonitor = (function() {
	    DocumentMonitor.prototype.states = {
	      loading: 0,
	      interactive: 50,
	      complete: 100
	    };

	    function DocumentMonitor() {
	      var _onreadystatechange, _ref2,
	        _this = this;
	      this.progress = (_ref2 = this.states[document.readyState]) != null ? _ref2 : 100;
	      _onreadystatechange = document.onreadystatechange;
	      document.onreadystatechange = function() {
	        if (_this.states[document.readyState] != null) {
	          _this.progress = _this.states[document.readyState];
	        }
	        return typeof _onreadystatechange === "function" ? _onreadystatechange.apply(null, arguments) : void 0;
	      };
	    }

	    return DocumentMonitor;

	  })();

	  EventLagMonitor = (function() {
	    function EventLagMonitor() {
	      var avg, interval, last, points, samples,
	        _this = this;
	      this.progress = 0;
	      avg = 0;
	      samples = [];
	      points = 0;
	      last = now();
	      interval = setInterval(function() {
	        var diff;
	        diff = now() - last - 50;
	        last = now();
	        samples.push(diff);
	        if (samples.length > options.eventLag.sampleCount) {
	          samples.shift();
	        }
	        avg = avgAmplitude(samples);
	        if (++points >= options.eventLag.minSamples && avg < options.eventLag.lagThreshold) {
	          _this.progress = 100;
	          return clearInterval(interval);
	        } else {
	          return _this.progress = 100 * (3 / (avg + 3));
	        }
	      }, 50);
	    }

	    return EventLagMonitor;

	  })();

	  Scaler = (function() {
	    function Scaler(source) {
	      this.source = source;
	      this.last = this.sinceLastUpdate = 0;
	      this.rate = options.initialRate;
	      this.catchup = 0;
	      this.progress = this.lastProgress = 0;
	      if (this.source != null) {
	        this.progress = result(this.source, 'progress');
	      }
	    }

	    Scaler.prototype.tick = function(frameTime, val) {
	      var scaling;
	      if (val == null) {
	        val = result(this.source, 'progress');
	      }
	      if (val >= 100) {
	        this.done = true;
	      }
	      if (val === this.last) {
	        this.sinceLastUpdate += frameTime;
	      } else {
	        if (this.sinceLastUpdate) {
	          this.rate = (val - this.last) / this.sinceLastUpdate;
	        }
	        this.catchup = (val - this.progress) / options.catchupTime;
	        this.sinceLastUpdate = 0;
	        this.last = val;
	      }
	      if (val > this.progress) {
	        this.progress += this.catchup * frameTime;
	      }
	      scaling = 1 - Math.pow(this.progress / 100, options.easeFactor);
	      this.progress += scaling * this.rate * frameTime;
	      this.progress = Math.min(this.lastProgress + options.maxProgressPerFrame, this.progress);
	      this.progress = Math.max(0, this.progress);
	      this.progress = Math.min(100, this.progress);
	      this.lastProgress = this.progress;
	      return this.progress;
	    };

	    return Scaler;

	  })();

	  sources = null;

	  scalers = null;

	  bar = null;

	  uniScaler = null;

	  animation = null;

	  cancelAnimation = null;

	  Pace.running = false;

	  handlePushState = function() {
	    if (options.restartOnPushState) {
	      return Pace.restart();
	    }
	  };

	  if (window.history.pushState != null) {
	    _pushState = window.history.pushState;
	    window.history.pushState = function() {
	      handlePushState();
	      return _pushState.apply(window.history, arguments);
	    };
	  }

	  if (window.history.replaceState != null) {
	    _replaceState = window.history.replaceState;
	    window.history.replaceState = function() {
	      handlePushState();
	      return _replaceState.apply(window.history, arguments);
	    };
	  }

	  SOURCE_KEYS = {
	    ajax: AjaxMonitor,
	    elements: ElementMonitor,
	    document: DocumentMonitor,
	    eventLag: EventLagMonitor
	  };

	  (init = function() {
	    var type, _j, _k, _len1, _len2, _ref2, _ref3, _ref4;
	    Pace.sources = sources = [];
	    _ref2 = ['ajax', 'elements', 'document', 'eventLag'];
	    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
	      type = _ref2[_j];
	      if (options[type] !== false) {
	        sources.push(new SOURCE_KEYS[type](options[type]));
	      }
	    }
	    _ref4 = (_ref3 = options.extraSources) != null ? _ref3 : [];
	    for (_k = 0, _len2 = _ref4.length; _k < _len2; _k++) {
	      source = _ref4[_k];
	      sources.push(new source(options));
	    }
	    Pace.bar = bar = new Bar;
	    scalers = [];
	    return uniScaler = new Scaler;
	  })();

	  Pace.stop = function() {
	    Pace.trigger('stop');
	    Pace.running = false;
	    bar.destroy();
	    cancelAnimation = true;
	    if (animation != null) {
	      if (typeof cancelAnimationFrame === "function") {
	        cancelAnimationFrame(animation);
	      }
	      animation = null;
	    }
	    return init();
	  };

	  Pace.restart = function() {
	    Pace.trigger('restart');
	    Pace.stop();
	    return Pace.start();
	  };

	  Pace.go = function() {
	    var start;
	    Pace.running = true;
	    bar.render();
	    start = now();
	    cancelAnimation = false;
	    return animation = runAnimation(function(frameTime, enqueueNextFrame) {
	      var avg, count, done, element, elements, i, j, remaining, scaler, scalerList, sum, _j, _k, _len1, _len2, _ref2;
	      remaining = 100 - bar.progress;
	      count = sum = 0;
	      done = true;
	      for (i = _j = 0, _len1 = sources.length; _j < _len1; i = ++_j) {
	        source = sources[i];
	        scalerList = scalers[i] != null ? scalers[i] : scalers[i] = [];
	        elements = (_ref2 = source.elements) != null ? _ref2 : [source];
	        for (j = _k = 0, _len2 = elements.length; _k < _len2; j = ++_k) {
	          element = elements[j];
	          scaler = scalerList[j] != null ? scalerList[j] : scalerList[j] = new Scaler(element);
	          done &= scaler.done;
	          if (scaler.done) {
	            continue;
	          }
	          count++;
	          sum += scaler.tick(frameTime);
	        }
	      }
	      avg = sum / count;
	      bar.update(uniScaler.tick(frameTime, avg));
	      if (bar.done() || done || cancelAnimation) {
	        bar.update(100);
	        Pace.trigger('done');
	        return setTimeout(function() {
	          bar.finish();
	          Pace.running = false;
	          return Pace.trigger('hide');
	        }, Math.max(options.ghostTime, Math.max(options.minTime - (now() - start), 0)));
	      } else {
	        return enqueueNextFrame();
	      }
	    });
	  };

	  Pace.start = function(_options) {
	    extend(options, _options);
	    Pace.running = true;
	    try {
	      bar.render();
	    } catch (_error) {
	      NoTargetError = _error;
	    }
	    if (!document.querySelector('.pace')) {
	      return setTimeout(Pace.start, 50);
	    } else {
	      Pace.trigger('start');
	      return Pace.go();
	    }
	  };

	  if (typeof define === 'function' && define.amd) {
	    define(['pace'], function() {
	      return Pace;
	    });
	  } else if (typeof exports === 'object') {
	    module.exports = Pace;
	  } else {
	    if (options.startOnPageLoad) {
	      Pace.start();
	    }
	  }

	}).call(this);


/* == jquery mousewheel plugin == Version: 3.1.13, License: MIT License (MIT) */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});
/* == malihu jquery custom scrollbar plugin == Version: 3.1.5, License: MIT License (MIT) */
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):"undefined"!=typeof module&&module.exports?module.exports=e:e(jQuery,window,document)}(function(e){!function(t){var o="function"==typeof define&&define.amd,a="undefined"!=typeof module&&module.exports,n="https:"==document.location.protocol?"https:":"http:",i="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";o||(a?require("jquery-mousewheel")(e):e.event.special.mousewheel||e("head").append(decodeURI("%3Cscript src="+n+"//"+i+"%3E%3C/script%3E"))),t()}(function(){var t,o="mCustomScrollbar",a="mCS",n=".mCustomScrollbar",i={setTop:0,setLeft:0,axis:"y",scrollbarPosition:"inside",scrollInertia:950,autoDraggerLength:!0,alwaysShowScrollbar:0,snapOffset:0,mouseWheel:{enable:!0,scrollAmount:"auto",axis:"y",deltaFactor:"auto",disableOver:["select","option","keygen","datalist","textarea"]},scrollButtons:{scrollType:"stepless",scrollAmount:"auto"},keyboard:{enable:!0,scrollType:"stepless",scrollAmount:"auto"},contentTouchScroll:25,documentTouchScroll:!0,advanced:{autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",updateOnContentResize:!0,updateOnImageLoad:"auto",autoUpdateTimeout:60},theme:"light",callbacks:{onTotalScrollOffset:0,onTotalScrollBackOffset:0,alwaysTriggerOffsets:!0}},r=0,l={},s=window.attachEvent&&!window.addEventListener?1:0,c=!1,d=["mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar","mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer","mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"],u={init:function(t){var t=e.extend(!0,{},i,t),o=f.call(this);if(t.live){var s=t.liveSelector||this.selector||n,c=e(s);if("off"===t.live)return void m(s);l[s]=setTimeout(function(){c.mCustomScrollbar(t),"once"===t.live&&c.length&&m(s)},500)}else m(s);return t.setWidth=t.set_width?t.set_width:t.setWidth,t.setHeight=t.set_height?t.set_height:t.setHeight,t.axis=t.horizontalScroll?"x":p(t.axis),t.scrollInertia=t.scrollInertia>0&&t.scrollInertia<17?17:t.scrollInertia,"object"!=typeof t.mouseWheel&&1==t.mouseWheel&&(t.mouseWheel={enable:!0,scrollAmount:"auto",axis:"y",preventDefault:!1,deltaFactor:"auto",normalizeDelta:!1,invert:!1}),t.mouseWheel.scrollAmount=t.mouseWheelPixels?t.mouseWheelPixels:t.mouseWheel.scrollAmount,t.mouseWheel.normalizeDelta=t.advanced.normalizeMouseWheelDelta?t.advanced.normalizeMouseWheelDelta:t.mouseWheel.normalizeDelta,t.scrollButtons.scrollType=g(t.scrollButtons.scrollType),h(t),e(o).each(function(){var o=e(this);if(!o.data(a)){o.data(a,{idx:++r,opt:t,scrollRatio:{y:null,x:null},overflowed:null,contentReset:{y:null,x:null},bindEvents:!1,tweenRunning:!1,sequential:{},langDir:o.css("direction"),cbOffsets:null,trigger:null,poll:{size:{o:0,n:0},img:{o:0,n:0},change:{o:0,n:0}}});var n=o.data(a),i=n.opt,l=o.data("mcs-axis"),s=o.data("mcs-scrollbar-position"),c=o.data("mcs-theme");l&&(i.axis=l),s&&(i.scrollbarPosition=s),c&&(i.theme=c,h(i)),v.call(this),n&&i.callbacks.onCreate&&"function"==typeof i.callbacks.onCreate&&i.callbacks.onCreate.call(this),e("#mCSB_"+n.idx+"_container img:not(."+d[2]+")").addClass(d[2]),u.update.call(null,o)}})},update:function(t,o){var n=t||f.call(this);return e(n).each(function(){var t=e(this);if(t.data(a)){var n=t.data(a),i=n.opt,r=e("#mCSB_"+n.idx+"_container"),l=e("#mCSB_"+n.idx),s=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")];if(!r.length)return;n.tweenRunning&&Q(t),o&&n&&i.callbacks.onBeforeUpdate&&"function"==typeof i.callbacks.onBeforeUpdate&&i.callbacks.onBeforeUpdate.call(this),t.hasClass(d[3])&&t.removeClass(d[3]),t.hasClass(d[4])&&t.removeClass(d[4]),l.css("max-height","none"),l.height()!==t.height()&&l.css("max-height",t.height()),_.call(this),"y"===i.axis||i.advanced.autoExpandHorizontalScroll||r.css("width",x(r)),n.overflowed=y.call(this),M.call(this),i.autoDraggerLength&&S.call(this),b.call(this),T.call(this);var c=[Math.abs(r[0].offsetTop),Math.abs(r[0].offsetLeft)];"x"!==i.axis&&(n.overflowed[0]?s[0].height()>s[0].parent().height()?B.call(this):(G(t,c[0].toString(),{dir:"y",dur:0,overwrite:"none"}),n.contentReset.y=null):(B.call(this),"y"===i.axis?k.call(this):"yx"===i.axis&&n.overflowed[1]&&G(t,c[1].toString(),{dir:"x",dur:0,overwrite:"none"}))),"y"!==i.axis&&(n.overflowed[1]?s[1].width()>s[1].parent().width()?B.call(this):(G(t,c[1].toString(),{dir:"x",dur:0,overwrite:"none"}),n.contentReset.x=null):(B.call(this),"x"===i.axis?k.call(this):"yx"===i.axis&&n.overflowed[0]&&G(t,c[0].toString(),{dir:"y",dur:0,overwrite:"none"}))),o&&n&&(2===o&&i.callbacks.onImageLoad&&"function"==typeof i.callbacks.onImageLoad?i.callbacks.onImageLoad.call(this):3===o&&i.callbacks.onSelectorChange&&"function"==typeof i.callbacks.onSelectorChange?i.callbacks.onSelectorChange.call(this):i.callbacks.onUpdate&&"function"==typeof i.callbacks.onUpdate&&i.callbacks.onUpdate.call(this)),N.call(this)}})},scrollTo:function(t,o){if("undefined"!=typeof t&&null!=t){var n=f.call(this);return e(n).each(function(){var n=e(this);if(n.data(a)){var i=n.data(a),r=i.opt,l={trigger:"external",scrollInertia:r.scrollInertia,scrollEasing:"mcsEaseInOut",moveDragger:!1,timeout:60,callbacks:!0,onStart:!0,onUpdate:!0,onComplete:!0},s=e.extend(!0,{},l,o),c=Y.call(this,t),d=s.scrollInertia>0&&s.scrollInertia<17?17:s.scrollInertia;c[0]=X.call(this,c[0],"y"),c[1]=X.call(this,c[1],"x"),s.moveDragger&&(c[0]*=i.scrollRatio.y,c[1]*=i.scrollRatio.x),s.dur=ne()?0:d,setTimeout(function(){null!==c[0]&&"undefined"!=typeof c[0]&&"x"!==r.axis&&i.overflowed[0]&&(s.dir="y",s.overwrite="all",G(n,c[0].toString(),s)),null!==c[1]&&"undefined"!=typeof c[1]&&"y"!==r.axis&&i.overflowed[1]&&(s.dir="x",s.overwrite="none",G(n,c[1].toString(),s))},s.timeout)}})}},stop:function(){var t=f.call(this);return e(t).each(function(){var t=e(this);t.data(a)&&Q(t)})},disable:function(t){var o=f.call(this);return e(o).each(function(){var o=e(this);if(o.data(a)){o.data(a);N.call(this,"remove"),k.call(this),t&&B.call(this),M.call(this,!0),o.addClass(d[3])}})},destroy:function(){var t=f.call(this);return e(t).each(function(){var n=e(this);if(n.data(a)){var i=n.data(a),r=i.opt,l=e("#mCSB_"+i.idx),s=e("#mCSB_"+i.idx+"_container"),c=e(".mCSB_"+i.idx+"_scrollbar");r.live&&m(r.liveSelector||e(t).selector),N.call(this,"remove"),k.call(this),B.call(this),n.removeData(a),$(this,"mcs"),c.remove(),s.find("img."+d[2]).removeClass(d[2]),l.replaceWith(s.contents()),n.removeClass(o+" _"+a+"_"+i.idx+" "+d[6]+" "+d[7]+" "+d[5]+" "+d[3]).addClass(d[4])}})}},f=function(){return"object"!=typeof e(this)||e(this).length<1?n:this},h=function(t){var o=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],a=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],n=["minimal","minimal-dark"],i=["minimal","minimal-dark"],r=["minimal","minimal-dark"];t.autoDraggerLength=e.inArray(t.theme,o)>-1?!1:t.autoDraggerLength,t.autoExpandScrollbar=e.inArray(t.theme,a)>-1?!1:t.autoExpandScrollbar,t.scrollButtons.enable=e.inArray(t.theme,n)>-1?!1:t.scrollButtons.enable,t.autoHideScrollbar=e.inArray(t.theme,i)>-1?!0:t.autoHideScrollbar,t.scrollbarPosition=e.inArray(t.theme,r)>-1?"outside":t.scrollbarPosition},m=function(e){l[e]&&(clearTimeout(l[e]),$(l,e))},p=function(e){return"yx"===e||"xy"===e||"auto"===e?"yx":"x"===e||"horizontal"===e?"x":"y"},g=function(e){return"stepped"===e||"pixels"===e||"step"===e||"click"===e?"stepped":"stepless"},v=function(){var t=e(this),n=t.data(a),i=n.opt,r=i.autoExpandScrollbar?" "+d[1]+"_expand":"",l=["<div id='mCSB_"+n.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+n.idx+"_scrollbar mCS-"+i.theme+" mCSB_scrollTools_vertical"+r+"'><div class='"+d[12]+"'><div id='mCSB_"+n.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+n.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+n.idx+"_scrollbar mCS-"+i.theme+" mCSB_scrollTools_horizontal"+r+"'><div class='"+d[12]+"'><div id='mCSB_"+n.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],s="yx"===i.axis?"mCSB_vertical_horizontal":"x"===i.axis?"mCSB_horizontal":"mCSB_vertical",c="yx"===i.axis?l[0]+l[1]:"x"===i.axis?l[1]:l[0],u="yx"===i.axis?"<div id='mCSB_"+n.idx+"_container_wrapper' class='mCSB_container_wrapper' />":"",f=i.autoHideScrollbar?" "+d[6]:"",h="x"!==i.axis&&"rtl"===n.langDir?" "+d[7]:"";i.setWidth&&t.css("width",i.setWidth),i.setHeight&&t.css("height",i.setHeight),i.setLeft="y"!==i.axis&&"rtl"===n.langDir?"989999px":i.setLeft,t.addClass(o+" _"+a+"_"+n.idx+f+h).wrapInner("<div id='mCSB_"+n.idx+"' class='mCustomScrollBox mCS-"+i.theme+" "+s+"'><div id='mCSB_"+n.idx+"_container' class='mCSB_container' style='position:relative; top:"+i.setTop+"; left:"+i.setLeft+";' dir='"+n.langDir+"' /></div>");var m=e("#mCSB_"+n.idx),p=e("#mCSB_"+n.idx+"_container");"y"===i.axis||i.advanced.autoExpandHorizontalScroll||p.css("width",x(p)),"outside"===i.scrollbarPosition?("static"===t.css("position")&&t.css("position","relative"),t.css("overflow","visible"),m.addClass("mCSB_outside").after(c)):(m.addClass("mCSB_inside").append(c),p.wrap(u)),w.call(this);var g=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")];g[0].css("min-height",g[0].height()),g[1].css("min-width",g[1].width())},x=function(t){var o=[t[0].scrollWidth,Math.max.apply(Math,t.children().map(function(){return e(this).outerWidth(!0)}).get())],a=t.parent().width();return o[0]>a?o[0]:o[1]>a?o[1]:"100%"},_=function(){var t=e(this),o=t.data(a),n=o.opt,i=e("#mCSB_"+o.idx+"_container");if(n.advanced.autoExpandHorizontalScroll&&"y"!==n.axis){i.css({width:"auto","min-width":0,"overflow-x":"scroll"});var r=Math.ceil(i[0].scrollWidth);3===n.advanced.autoExpandHorizontalScroll||2!==n.advanced.autoExpandHorizontalScroll&&r>i.parent().width()?i.css({width:r,"min-width":"100%","overflow-x":"inherit"}):i.css({"overflow-x":"inherit",position:"absolute"}).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({width:Math.ceil(i[0].getBoundingClientRect().right+.4)-Math.floor(i[0].getBoundingClientRect().left),"min-width":"100%",position:"relative"}).unwrap()}},w=function(){var t=e(this),o=t.data(a),n=o.opt,i=e(".mCSB_"+o.idx+"_scrollbar:first"),r=oe(n.scrollButtons.tabindex)?"tabindex='"+n.scrollButtons.tabindex+"'":"",l=["<a href='#' class='"+d[13]+"' "+r+" />","<a href='#' class='"+d[14]+"' "+r+" />","<a href='#' class='"+d[15]+"' "+r+" />","<a href='#' class='"+d[16]+"' "+r+" />"],s=["x"===n.axis?l[2]:l[0],"x"===n.axis?l[3]:l[1],l[2],l[3]];n.scrollButtons.enable&&i.prepend(s[0]).append(s[1]).next(".mCSB_scrollTools").prepend(s[2]).append(s[3])},S=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")],l=[n.height()/i.outerHeight(!1),n.width()/i.outerWidth(!1)],c=[parseInt(r[0].css("min-height")),Math.round(l[0]*r[0].parent().height()),parseInt(r[1].css("min-width")),Math.round(l[1]*r[1].parent().width())],d=s&&c[1]<c[0]?c[0]:c[1],u=s&&c[3]<c[2]?c[2]:c[3];r[0].css({height:d,"max-height":r[0].parent().height()-10}).find(".mCSB_dragger_bar").css({"line-height":c[0]+"px"}),r[1].css({width:u,"max-width":r[1].parent().width()-10})},b=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")],l=[i.outerHeight(!1)-n.height(),i.outerWidth(!1)-n.width()],s=[l[0]/(r[0].parent().height()-r[0].height()),l[1]/(r[1].parent().width()-r[1].width())];o.scrollRatio={y:s[0],x:s[1]}},C=function(e,t,o){var a=o?d[0]+"_expanded":"",n=e.closest(".mCSB_scrollTools");"active"===t?(e.toggleClass(d[0]+" "+a),n.toggleClass(d[1]),e[0]._draggable=e[0]._draggable?0:1):e[0]._draggable||("hide"===t?(e.removeClass(d[0]),n.removeClass(d[1])):(e.addClass(d[0]),n.addClass(d[1])))},y=function(){var t=e(this),o=t.data(a),n=e("#mCSB_"+o.idx),i=e("#mCSB_"+o.idx+"_container"),r=null==o.overflowed?i.height():i.outerHeight(!1),l=null==o.overflowed?i.width():i.outerWidth(!1),s=i[0].scrollHeight,c=i[0].scrollWidth;return s>r&&(r=s),c>l&&(l=c),[r>n.height(),l>n.width()]},B=function(){var t=e(this),o=t.data(a),n=o.opt,i=e("#mCSB_"+o.idx),r=e("#mCSB_"+o.idx+"_container"),l=[e("#mCSB_"+o.idx+"_dragger_vertical"),e("#mCSB_"+o.idx+"_dragger_horizontal")];if(Q(t),("x"!==n.axis&&!o.overflowed[0]||"y"===n.axis&&o.overflowed[0])&&(l[0].add(r).css("top",0),G(t,"_resetY")),"y"!==n.axis&&!o.overflowed[1]||"x"===n.axis&&o.overflowed[1]){var s=dx=0;"rtl"===o.langDir&&(s=i.width()-r.outerWidth(!1),dx=Math.abs(s/o.scrollRatio.x)),r.css("left",s),l[1].css("left",dx),G(t,"_resetX")}},T=function(){function t(){r=setTimeout(function(){e.event.special.mousewheel?(clearTimeout(r),W.call(o[0])):t()},100)}var o=e(this),n=o.data(a),i=n.opt;if(!n.bindEvents){if(I.call(this),i.contentTouchScroll&&D.call(this),E.call(this),i.mouseWheel.enable){var r;t()}P.call(this),U.call(this),i.advanced.autoScrollOnFocus&&H.call(this),i.scrollButtons.enable&&F.call(this),i.keyboard.enable&&q.call(this),n.bindEvents=!0}},k=function(){var t=e(this),o=t.data(a),n=o.opt,i=a+"_"+o.idx,r=".mCSB_"+o.idx+"_scrollbar",l=e("#mCSB_"+o.idx+",#mCSB_"+o.idx+"_container,#mCSB_"+o.idx+"_container_wrapper,"+r+" ."+d[12]+",#mCSB_"+o.idx+"_dragger_vertical,#mCSB_"+o.idx+"_dragger_horizontal,"+r+">a"),s=e("#mCSB_"+o.idx+"_container");n.advanced.releaseDraggableSelectors&&l.add(e(n.advanced.releaseDraggableSelectors)),n.advanced.extraDraggableSelectors&&l.add(e(n.advanced.extraDraggableSelectors)),o.bindEvents&&(e(document).add(e(!A()||top.document)).unbind("."+i),l.each(function(){e(this).unbind("."+i)}),clearTimeout(t[0]._focusTimeout),$(t[0],"_focusTimeout"),clearTimeout(o.sequential.step),$(o.sequential,"step"),clearTimeout(s[0].onCompleteTimeout),$(s[0],"onCompleteTimeout"),o.bindEvents=!1)},M=function(t){var o=e(this),n=o.data(a),i=n.opt,r=e("#mCSB_"+n.idx+"_container_wrapper"),l=r.length?r:e("#mCSB_"+n.idx+"_container"),s=[e("#mCSB_"+n.idx+"_scrollbar_vertical"),e("#mCSB_"+n.idx+"_scrollbar_horizontal")],c=[s[0].find(".mCSB_dragger"),s[1].find(".mCSB_dragger")];"x"!==i.axis&&(n.overflowed[0]&&!t?(s[0].add(c[0]).add(s[0].children("a")).css("display","block"),l.removeClass(d[8]+" "+d[10])):(i.alwaysShowScrollbar?(2!==i.alwaysShowScrollbar&&c[0].css("display","none"),l.removeClass(d[10])):(s[0].css("display","none"),l.addClass(d[10])),l.addClass(d[8]))),"y"!==i.axis&&(n.overflowed[1]&&!t?(s[1].add(c[1]).add(s[1].children("a")).css("display","block"),l.removeClass(d[9]+" "+d[11])):(i.alwaysShowScrollbar?(2!==i.alwaysShowScrollbar&&c[1].css("display","none"),l.removeClass(d[11])):(s[1].css("display","none"),l.addClass(d[11])),l.addClass(d[9]))),n.overflowed[0]||n.overflowed[1]?o.removeClass(d[5]):o.addClass(d[5])},O=function(t){var o=t.type,a=t.target.ownerDocument!==document&&null!==frameElement?[e(frameElement).offset().top,e(frameElement).offset().left]:null,n=A()&&t.target.ownerDocument!==top.document&&null!==frameElement?[e(t.view.frameElement).offset().top,e(t.view.frameElement).offset().left]:[0,0];switch(o){case"pointerdown":case"MSPointerDown":case"pointermove":case"MSPointerMove":case"pointerup":case"MSPointerUp":return a?[t.originalEvent.pageY-a[0]+n[0],t.originalEvent.pageX-a[1]+n[1],!1]:[t.originalEvent.pageY,t.originalEvent.pageX,!1];case"touchstart":case"touchmove":case"touchend":var i=t.originalEvent.touches[0]||t.originalEvent.changedTouches[0],r=t.originalEvent.touches.length||t.originalEvent.changedTouches.length;return t.target.ownerDocument!==document?[i.screenY,i.screenX,r>1]:[i.pageY,i.pageX,r>1];default:return a?[t.pageY-a[0]+n[0],t.pageX-a[1]+n[1],!1]:[t.pageY,t.pageX,!1]}},I=function(){function t(e,t,a,n){if(h[0].idleTimer=d.scrollInertia<233?250:0,o.attr("id")===f[1])var i="x",s=(o[0].offsetLeft-t+n)*l.scrollRatio.x;else var i="y",s=(o[0].offsetTop-e+a)*l.scrollRatio.y;G(r,s.toString(),{dir:i,drag:!0})}var o,n,i,r=e(this),l=r.data(a),d=l.opt,u=a+"_"+l.idx,f=["mCSB_"+l.idx+"_dragger_vertical","mCSB_"+l.idx+"_dragger_horizontal"],h=e("#mCSB_"+l.idx+"_container"),m=e("#"+f[0]+",#"+f[1]),p=d.advanced.releaseDraggableSelectors?m.add(e(d.advanced.releaseDraggableSelectors)):m,g=d.advanced.extraDraggableSelectors?e(!A()||top.document).add(e(d.advanced.extraDraggableSelectors)):e(!A()||top.document);m.bind("contextmenu."+u,function(e){e.preventDefault()}).bind("mousedown."+u+" touchstart."+u+" pointerdown."+u+" MSPointerDown."+u,function(t){if(t.stopImmediatePropagation(),t.preventDefault(),ee(t)){c=!0,s&&(document.onselectstart=function(){return!1}),L.call(h,!1),Q(r),o=e(this);var a=o.offset(),l=O(t)[0]-a.top,u=O(t)[1]-a.left,f=o.height()+a.top,m=o.width()+a.left;f>l&&l>0&&m>u&&u>0&&(n=l,i=u),C(o,"active",d.autoExpandScrollbar)}}).bind("touchmove."+u,function(e){e.stopImmediatePropagation(),e.preventDefault();var a=o.offset(),r=O(e)[0]-a.top,l=O(e)[1]-a.left;t(n,i,r,l)}),e(document).add(g).bind("mousemove."+u+" pointermove."+u+" MSPointerMove."+u,function(e){if(o){var a=o.offset(),r=O(e)[0]-a.top,l=O(e)[1]-a.left;if(n===r&&i===l)return;t(n,i,r,l)}}).add(p).bind("mouseup."+u+" touchend."+u+" pointerup."+u+" MSPointerUp."+u,function(){o&&(C(o,"active",d.autoExpandScrollbar),o=null),c=!1,s&&(document.onselectstart=null),L.call(h,!0)})},D=function(){function o(e){if(!te(e)||c||O(e)[2])return void(t=0);t=1,b=0,C=0,d=1,y.removeClass("mCS_touch_action");var o=I.offset();u=O(e)[0]-o.top,f=O(e)[1]-o.left,z=[O(e)[0],O(e)[1]]}function n(e){if(te(e)&&!c&&!O(e)[2]&&(T.documentTouchScroll||e.preventDefault(),e.stopImmediatePropagation(),(!C||b)&&d)){g=K();var t=M.offset(),o=O(e)[0]-t.top,a=O(e)[1]-t.left,n="mcsLinearOut";if(E.push(o),W.push(a),z[2]=Math.abs(O(e)[0]-z[0]),z[3]=Math.abs(O(e)[1]-z[1]),B.overflowed[0])var i=D[0].parent().height()-D[0].height(),r=u-o>0&&o-u>-(i*B.scrollRatio.y)&&(2*z[3]<z[2]||"yx"===T.axis);if(B.overflowed[1])var l=D[1].parent().width()-D[1].width(),h=f-a>0&&a-f>-(l*B.scrollRatio.x)&&(2*z[2]<z[3]||"yx"===T.axis);r||h?(U||e.preventDefault(),b=1):(C=1,y.addClass("mCS_touch_action")),U&&e.preventDefault(),w="yx"===T.axis?[u-o,f-a]:"x"===T.axis?[null,f-a]:[u-o,null],I[0].idleTimer=250,B.overflowed[0]&&s(w[0],R,n,"y","all",!0),B.overflowed[1]&&s(w[1],R,n,"x",L,!0)}}function i(e){if(!te(e)||c||O(e)[2])return void(t=0);t=1,e.stopImmediatePropagation(),Q(y),p=K();var o=M.offset();h=O(e)[0]-o.top,m=O(e)[1]-o.left,E=[],W=[]}function r(e){if(te(e)&&!c&&!O(e)[2]){d=0,e.stopImmediatePropagation(),b=0,C=0,v=K();var t=M.offset(),o=O(e)[0]-t.top,a=O(e)[1]-t.left;if(!(v-g>30)){_=1e3/(v-p);var n="mcsEaseOut",i=2.5>_,r=i?[E[E.length-2],W[W.length-2]]:[0,0];x=i?[o-r[0],a-r[1]]:[o-h,a-m];var u=[Math.abs(x[0]),Math.abs(x[1])];_=i?[Math.abs(x[0]/4),Math.abs(x[1]/4)]:[_,_];var f=[Math.abs(I[0].offsetTop)-x[0]*l(u[0]/_[0],_[0]),Math.abs(I[0].offsetLeft)-x[1]*l(u[1]/_[1],_[1])];w="yx"===T.axis?[f[0],f[1]]:"x"===T.axis?[null,f[1]]:[f[0],null],S=[4*u[0]+T.scrollInertia,4*u[1]+T.scrollInertia];var y=parseInt(T.contentTouchScroll)||0;w[0]=u[0]>y?w[0]:0,w[1]=u[1]>y?w[1]:0,B.overflowed[0]&&s(w[0],S[0],n,"y",L,!1),B.overflowed[1]&&s(w[1],S[1],n,"x",L,!1)}}}function l(e,t){var o=[1.5*t,2*t,t/1.5,t/2];return e>90?t>4?o[0]:o[3]:e>60?t>3?o[3]:o[2]:e>30?t>8?o[1]:t>6?o[0]:t>4?t:o[2]:t>8?t:o[3]}function s(e,t,o,a,n,i){e&&G(y,e.toString(),{dur:t,scrollEasing:o,dir:a,overwrite:n,drag:i})}var d,u,f,h,m,p,g,v,x,_,w,S,b,C,y=e(this),B=y.data(a),T=B.opt,k=a+"_"+B.idx,M=e("#mCSB_"+B.idx),I=e("#mCSB_"+B.idx+"_container"),D=[e("#mCSB_"+B.idx+"_dragger_vertical"),e("#mCSB_"+B.idx+"_dragger_horizontal")],E=[],W=[],R=0,L="yx"===T.axis?"none":"all",z=[],P=I.find("iframe"),H=["touchstart."+k+" pointerdown."+k+" MSPointerDown."+k,"touchmove."+k+" pointermove."+k+" MSPointerMove."+k,"touchend."+k+" pointerup."+k+" MSPointerUp."+k],U=void 0!==document.body.style.touchAction&&""!==document.body.style.touchAction;I.bind(H[0],function(e){o(e)}).bind(H[1],function(e){n(e)}),M.bind(H[0],function(e){i(e)}).bind(H[2],function(e){r(e)}),P.length&&P.each(function(){e(this).bind("load",function(){A(this)&&e(this.contentDocument||this.contentWindow.document).bind(H[0],function(e){o(e),i(e)}).bind(H[1],function(e){n(e)}).bind(H[2],function(e){r(e)})})})},E=function(){function o(){return window.getSelection?window.getSelection().toString():document.selection&&"Control"!=document.selection.type?document.selection.createRange().text:0}function n(e,t,o){d.type=o&&i?"stepped":"stepless",d.scrollAmount=10,j(r,e,t,"mcsLinearOut",o?60:null)}var i,r=e(this),l=r.data(a),s=l.opt,d=l.sequential,u=a+"_"+l.idx,f=e("#mCSB_"+l.idx+"_container"),h=f.parent();f.bind("mousedown."+u,function(){t||i||(i=1,c=!0)}).add(document).bind("mousemove."+u,function(e){if(!t&&i&&o()){var a=f.offset(),r=O(e)[0]-a.top+f[0].offsetTop,c=O(e)[1]-a.left+f[0].offsetLeft;r>0&&r<h.height()&&c>0&&c<h.width()?d.step&&n("off",null,"stepped"):("x"!==s.axis&&l.overflowed[0]&&(0>r?n("on",38):r>h.height()&&n("on",40)),"y"!==s.axis&&l.overflowed[1]&&(0>c?n("on",37):c>h.width()&&n("on",39)))}}).bind("mouseup."+u+" dragend."+u,function(){t||(i&&(i=0,n("off",null)),c=!1)})},W=function(){function t(t,a){if(Q(o),!z(o,t.target)){var r="auto"!==i.mouseWheel.deltaFactor?parseInt(i.mouseWheel.deltaFactor):s&&t.deltaFactor<100?100:t.deltaFactor||100,d=i.scrollInertia;if("x"===i.axis||"x"===i.mouseWheel.axis)var u="x",f=[Math.round(r*n.scrollRatio.x),parseInt(i.mouseWheel.scrollAmount)],h="auto"!==i.mouseWheel.scrollAmount?f[1]:f[0]>=l.width()?.9*l.width():f[0],m=Math.abs(e("#mCSB_"+n.idx+"_container")[0].offsetLeft),p=c[1][0].offsetLeft,g=c[1].parent().width()-c[1].width(),v="y"===i.mouseWheel.axis?t.deltaY||a:t.deltaX;else var u="y",f=[Math.round(r*n.scrollRatio.y),parseInt(i.mouseWheel.scrollAmount)],h="auto"!==i.mouseWheel.scrollAmount?f[1]:f[0]>=l.height()?.9*l.height():f[0],m=Math.abs(e("#mCSB_"+n.idx+"_container")[0].offsetTop),p=c[0][0].offsetTop,g=c[0].parent().height()-c[0].height(),v=t.deltaY||a;"y"===u&&!n.overflowed[0]||"x"===u&&!n.overflowed[1]||((i.mouseWheel.invert||t.webkitDirectionInvertedFromDevice)&&(v=-v),i.mouseWheel.normalizeDelta&&(v=0>v?-1:1),(v>0&&0!==p||0>v&&p!==g||i.mouseWheel.preventDefault)&&(t.stopImmediatePropagation(),t.preventDefault()),t.deltaFactor<5&&!i.mouseWheel.normalizeDelta&&(h=t.deltaFactor,d=17),G(o,(m-v*h).toString(),{dir:u,dur:d}))}}if(e(this).data(a)){var o=e(this),n=o.data(a),i=n.opt,r=a+"_"+n.idx,l=e("#mCSB_"+n.idx),c=[e("#mCSB_"+n.idx+"_dragger_vertical"),e("#mCSB_"+n.idx+"_dragger_horizontal")],d=e("#mCSB_"+n.idx+"_container").find("iframe");d.length&&d.each(function(){e(this).bind("load",function(){A(this)&&e(this.contentDocument||this.contentWindow.document).bind("mousewheel."+r,function(e,o){t(e,o)})})}),l.bind("mousewheel."+r,function(e,o){t(e,o)})}},R=new Object,A=function(t){var o=!1,a=!1,n=null;if(void 0===t?a="#empty":void 0!==e(t).attr("id")&&(a=e(t).attr("id")),a!==!1&&void 0!==R[a])return R[a];if(t){try{var i=t.contentDocument||t.contentWindow.document;n=i.body.innerHTML}catch(r){}o=null!==n}else{try{var i=top.document;n=i.body.innerHTML}catch(r){}o=null!==n}return a!==!1&&(R[a]=o),o},L=function(e){var t=this.find("iframe");if(t.length){var o=e?"auto":"none";t.css("pointer-events",o)}},z=function(t,o){var n=o.nodeName.toLowerCase(),i=t.data(a).opt.mouseWheel.disableOver,r=["select","textarea"];return e.inArray(n,i)>-1&&!(e.inArray(n,r)>-1&&!e(o).is(":focus"))},P=function(){var t,o=e(this),n=o.data(a),i=a+"_"+n.idx,r=e("#mCSB_"+n.idx+"_container"),l=r.parent(),s=e(".mCSB_"+n.idx+"_scrollbar ."+d[12]);s.bind("mousedown."+i+" touchstart."+i+" pointerdown."+i+" MSPointerDown."+i,function(o){c=!0,e(o.target).hasClass("mCSB_dragger")||(t=1)}).bind("touchend."+i+" pointerup."+i+" MSPointerUp."+i,function(){c=!1}).bind("click."+i,function(a){if(t&&(t=0,e(a.target).hasClass(d[12])||e(a.target).hasClass("mCSB_draggerRail"))){Q(o);var i=e(this),s=i.find(".mCSB_dragger");if(i.parent(".mCSB_scrollTools_horizontal").length>0){if(!n.overflowed[1])return;var c="x",u=a.pageX>s.offset().left?-1:1,f=Math.abs(r[0].offsetLeft)-u*(.9*l.width())}else{if(!n.overflowed[0])return;var c="y",u=a.pageY>s.offset().top?-1:1,f=Math.abs(r[0].offsetTop)-u*(.9*l.height())}G(o,f.toString(),{dir:c,scrollEasing:"mcsEaseInOut"})}})},H=function(){var t=e(this),o=t.data(a),n=o.opt,i=a+"_"+o.idx,r=e("#mCSB_"+o.idx+"_container"),l=r.parent();r.bind("focusin."+i,function(){var o=e(document.activeElement),a=r.find(".mCustomScrollBox").length,i=0;o.is(n.advanced.autoScrollOnFocus)&&(Q(t),clearTimeout(t[0]._focusTimeout),t[0]._focusTimer=a?(i+17)*a:0,t[0]._focusTimeout=setTimeout(function(){var e=[ae(o)[0],ae(o)[1]],a=[r[0].offsetTop,r[0].offsetLeft],s=[a[0]+e[0]>=0&&a[0]+e[0]<l.height()-o.outerHeight(!1),a[1]+e[1]>=0&&a[0]+e[1]<l.width()-o.outerWidth(!1)],c="yx"!==n.axis||s[0]||s[1]?"all":"none";"x"===n.axis||s[0]||G(t,e[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:c,dur:i}),"y"===n.axis||s[1]||G(t,e[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:c,dur:i})},t[0]._focusTimer))})},U=function(){var t=e(this),o=t.data(a),n=a+"_"+o.idx,i=e("#mCSB_"+o.idx+"_container").parent();i.bind("scroll."+n,function(){0===i.scrollTop()&&0===i.scrollLeft()||e(".mCSB_"+o.idx+"_scrollbar").css("visibility","hidden")})},F=function(){var t=e(this),o=t.data(a),n=o.opt,i=o.sequential,r=a+"_"+o.idx,l=".mCSB_"+o.idx+"_scrollbar",s=e(l+">a");s.bind("contextmenu."+r,function(e){e.preventDefault()}).bind("mousedown."+r+" touchstart."+r+" pointerdown."+r+" MSPointerDown."+r+" mouseup."+r+" touchend."+r+" pointerup."+r+" MSPointerUp."+r+" mouseout."+r+" pointerout."+r+" MSPointerOut."+r+" click."+r,function(a){function r(e,o){i.scrollAmount=n.scrollButtons.scrollAmount,j(t,e,o)}if(a.preventDefault(),ee(a)){var l=e(this).attr("class");switch(i.type=n.scrollButtons.scrollType,a.type){case"mousedown":case"touchstart":case"pointerdown":case"MSPointerDown":if("stepped"===i.type)return;c=!0,o.tweenRunning=!1,r("on",l);break;case"mouseup":case"touchend":case"pointerup":case"MSPointerUp":case"mouseout":case"pointerout":case"MSPointerOut":if("stepped"===i.type)return;c=!1,i.dir&&r("off",l);break;case"click":if("stepped"!==i.type||o.tweenRunning)return;r("on",l)}}})},q=function(){function t(t){function a(e,t){r.type=i.keyboard.scrollType,r.scrollAmount=i.keyboard.scrollAmount,"stepped"===r.type&&n.tweenRunning||j(o,e,t)}switch(t.type){case"blur":n.tweenRunning&&r.dir&&a("off",null);break;case"keydown":case"keyup":var l=t.keyCode?t.keyCode:t.which,s="on";if("x"!==i.axis&&(38===l||40===l)||"y"!==i.axis&&(37===l||39===l)){if((38===l||40===l)&&!n.overflowed[0]||(37===l||39===l)&&!n.overflowed[1])return;"keyup"===t.type&&(s="off"),e(document.activeElement).is(u)||(t.preventDefault(),t.stopImmediatePropagation(),a(s,l))}else if(33===l||34===l){if((n.overflowed[0]||n.overflowed[1])&&(t.preventDefault(),t.stopImmediatePropagation()),"keyup"===t.type){Q(o);var f=34===l?-1:1;if("x"===i.axis||"yx"===i.axis&&n.overflowed[1]&&!n.overflowed[0])var h="x",m=Math.abs(c[0].offsetLeft)-f*(.9*d.width());else var h="y",m=Math.abs(c[0].offsetTop)-f*(.9*d.height());G(o,m.toString(),{dir:h,scrollEasing:"mcsEaseInOut"})}}else if((35===l||36===l)&&!e(document.activeElement).is(u)&&((n.overflowed[0]||n.overflowed[1])&&(t.preventDefault(),t.stopImmediatePropagation()),"keyup"===t.type)){if("x"===i.axis||"yx"===i.axis&&n.overflowed[1]&&!n.overflowed[0])var h="x",m=35===l?Math.abs(d.width()-c.outerWidth(!1)):0;else var h="y",m=35===l?Math.abs(d.height()-c.outerHeight(!1)):0;G(o,m.toString(),{dir:h,scrollEasing:"mcsEaseInOut"})}}}var o=e(this),n=o.data(a),i=n.opt,r=n.sequential,l=a+"_"+n.idx,s=e("#mCSB_"+n.idx),c=e("#mCSB_"+n.idx+"_container"),d=c.parent(),u="input,textarea,select,datalist,keygen,[contenteditable='true']",f=c.find("iframe"),h=["blur."+l+" keydown."+l+" keyup."+l];f.length&&f.each(function(){e(this).bind("load",function(){A(this)&&e(this.contentDocument||this.contentWindow.document).bind(h[0],function(e){t(e)})})}),s.attr("tabindex","0").bind(h[0],function(e){t(e)})},j=function(t,o,n,i,r){function l(e){u.snapAmount&&(f.scrollAmount=u.snapAmount instanceof Array?"x"===f.dir[0]?u.snapAmount[1]:u.snapAmount[0]:u.snapAmount);var o="stepped"!==f.type,a=r?r:e?o?p/1.5:g:1e3/60,n=e?o?7.5:40:2.5,s=[Math.abs(h[0].offsetTop),Math.abs(h[0].offsetLeft)],d=[c.scrollRatio.y>10?10:c.scrollRatio.y,c.scrollRatio.x>10?10:c.scrollRatio.x],m="x"===f.dir[0]?s[1]+f.dir[1]*(d[1]*n):s[0]+f.dir[1]*(d[0]*n),v="x"===f.dir[0]?s[1]+f.dir[1]*parseInt(f.scrollAmount):s[0]+f.dir[1]*parseInt(f.scrollAmount),x="auto"!==f.scrollAmount?v:m,_=i?i:e?o?"mcsLinearOut":"mcsEaseInOut":"mcsLinear",w=!!e;return e&&17>a&&(x="x"===f.dir[0]?s[1]:s[0]),G(t,x.toString(),{dir:f.dir[0],scrollEasing:_,dur:a,onComplete:w}),e?void(f.dir=!1):(clearTimeout(f.step),void(f.step=setTimeout(function(){l()},a)))}function s(){clearTimeout(f.step),$(f,"step"),Q(t)}var c=t.data(a),u=c.opt,f=c.sequential,h=e("#mCSB_"+c.idx+"_container"),m="stepped"===f.type,p=u.scrollInertia<26?26:u.scrollInertia,g=u.scrollInertia<1?17:u.scrollInertia;switch(o){case"on":if(f.dir=[n===d[16]||n===d[15]||39===n||37===n?"x":"y",n===d[13]||n===d[15]||38===n||37===n?-1:1],Q(t),oe(n)&&"stepped"===f.type)return;l(m);break;case"off":s(),(m||c.tweenRunning&&f.dir)&&l(!0)}},Y=function(t){var o=e(this).data(a).opt,n=[];return"function"==typeof t&&(t=t()),t instanceof Array?n=t.length>1?[t[0],t[1]]:"x"===o.axis?[null,t[0]]:[t[0],null]:(n[0]=t.y?t.y:t.x||"x"===o.axis?null:t,n[1]=t.x?t.x:t.y||"y"===o.axis?null:t),"function"==typeof n[0]&&(n[0]=n[0]()),"function"==typeof n[1]&&(n[1]=n[1]()),n},X=function(t,o){if(null!=t&&"undefined"!=typeof t){var n=e(this),i=n.data(a),r=i.opt,l=e("#mCSB_"+i.idx+"_container"),s=l.parent(),c=typeof t;o||(o="x"===r.axis?"x":"y");var d="x"===o?l.outerWidth(!1)-s.width():l.outerHeight(!1)-s.height(),f="x"===o?l[0].offsetLeft:l[0].offsetTop,h="x"===o?"left":"top";switch(c){case"function":return t();case"object":var m=t.jquery?t:e(t);if(!m.length)return;return"x"===o?ae(m)[1]:ae(m)[0];case"string":case"number":if(oe(t))return Math.abs(t);if(-1!==t.indexOf("%"))return Math.abs(d*parseInt(t)/100);if(-1!==t.indexOf("-="))return Math.abs(f-parseInt(t.split("-=")[1]));if(-1!==t.indexOf("+=")){var p=f+parseInt(t.split("+=")[1]);return p>=0?0:Math.abs(p)}if(-1!==t.indexOf("px")&&oe(t.split("px")[0]))return Math.abs(t.split("px")[0]);if("top"===t||"left"===t)return 0;if("bottom"===t)return Math.abs(s.height()-l.outerHeight(!1));if("right"===t)return Math.abs(s.width()-l.outerWidth(!1));if("first"===t||"last"===t){var m=l.find(":"+t);return"x"===o?ae(m)[1]:ae(m)[0]}return e(t).length?"x"===o?ae(e(t))[1]:ae(e(t))[0]:(l.css(h,t),void u.update.call(null,n[0]))}}},N=function(t){function o(){return clearTimeout(f[0].autoUpdate),0===l.parents("html").length?void(l=null):void(f[0].autoUpdate=setTimeout(function(){return c.advanced.updateOnSelectorChange&&(s.poll.change.n=i(),s.poll.change.n!==s.poll.change.o)?(s.poll.change.o=s.poll.change.n,void r(3)):c.advanced.updateOnContentResize&&(s.poll.size.n=l[0].scrollHeight+l[0].scrollWidth+f[0].offsetHeight+l[0].offsetHeight+l[0].offsetWidth,s.poll.size.n!==s.poll.size.o)?(s.poll.size.o=s.poll.size.n,void r(1)):!c.advanced.updateOnImageLoad||"auto"===c.advanced.updateOnImageLoad&&"y"===c.axis||(s.poll.img.n=f.find("img").length,s.poll.img.n===s.poll.img.o)?void((c.advanced.updateOnSelectorChange||c.advanced.updateOnContentResize||c.advanced.updateOnImageLoad)&&o()):(s.poll.img.o=s.poll.img.n,void f.find("img").each(function(){n(this)}))},c.advanced.autoUpdateTimeout))}function n(t){function o(e,t){return function(){
return t.apply(e,arguments)}}function a(){this.onload=null,e(t).addClass(d[2]),r(2)}if(e(t).hasClass(d[2]))return void r();var n=new Image;n.onload=o(n,a),n.src=t.src}function i(){c.advanced.updateOnSelectorChange===!0&&(c.advanced.updateOnSelectorChange="*");var e=0,t=f.find(c.advanced.updateOnSelectorChange);return c.advanced.updateOnSelectorChange&&t.length>0&&t.each(function(){e+=this.offsetHeight+this.offsetWidth}),e}function r(e){clearTimeout(f[0].autoUpdate),u.update.call(null,l[0],e)}var l=e(this),s=l.data(a),c=s.opt,f=e("#mCSB_"+s.idx+"_container");return t?(clearTimeout(f[0].autoUpdate),void $(f[0],"autoUpdate")):void o()},V=function(e,t,o){return Math.round(e/t)*t-o},Q=function(t){var o=t.data(a),n=e("#mCSB_"+o.idx+"_container,#mCSB_"+o.idx+"_container_wrapper,#mCSB_"+o.idx+"_dragger_vertical,#mCSB_"+o.idx+"_dragger_horizontal");n.each(function(){Z.call(this)})},G=function(t,o,n){function i(e){return s&&c.callbacks[e]&&"function"==typeof c.callbacks[e]}function r(){return[c.callbacks.alwaysTriggerOffsets||w>=S[0]+y,c.callbacks.alwaysTriggerOffsets||-B>=w]}function l(){var e=[h[0].offsetTop,h[0].offsetLeft],o=[x[0].offsetTop,x[0].offsetLeft],a=[h.outerHeight(!1),h.outerWidth(!1)],i=[f.height(),f.width()];t[0].mcs={content:h,top:e[0],left:e[1],draggerTop:o[0],draggerLeft:o[1],topPct:Math.round(100*Math.abs(e[0])/(Math.abs(a[0])-i[0])),leftPct:Math.round(100*Math.abs(e[1])/(Math.abs(a[1])-i[1])),direction:n.dir}}var s=t.data(a),c=s.opt,d={trigger:"internal",dir:"y",scrollEasing:"mcsEaseOut",drag:!1,dur:c.scrollInertia,overwrite:"all",callbacks:!0,onStart:!0,onUpdate:!0,onComplete:!0},n=e.extend(d,n),u=[n.dur,n.drag?0:n.dur],f=e("#mCSB_"+s.idx),h=e("#mCSB_"+s.idx+"_container"),m=h.parent(),p=c.callbacks.onTotalScrollOffset?Y.call(t,c.callbacks.onTotalScrollOffset):[0,0],g=c.callbacks.onTotalScrollBackOffset?Y.call(t,c.callbacks.onTotalScrollBackOffset):[0,0];if(s.trigger=n.trigger,0===m.scrollTop()&&0===m.scrollLeft()||(e(".mCSB_"+s.idx+"_scrollbar").css("visibility","visible"),m.scrollTop(0).scrollLeft(0)),"_resetY"!==o||s.contentReset.y||(i("onOverflowYNone")&&c.callbacks.onOverflowYNone.call(t[0]),s.contentReset.y=1),"_resetX"!==o||s.contentReset.x||(i("onOverflowXNone")&&c.callbacks.onOverflowXNone.call(t[0]),s.contentReset.x=1),"_resetY"!==o&&"_resetX"!==o){if(!s.contentReset.y&&t[0].mcs||!s.overflowed[0]||(i("onOverflowY")&&c.callbacks.onOverflowY.call(t[0]),s.contentReset.x=null),!s.contentReset.x&&t[0].mcs||!s.overflowed[1]||(i("onOverflowX")&&c.callbacks.onOverflowX.call(t[0]),s.contentReset.x=null),c.snapAmount){var v=c.snapAmount instanceof Array?"x"===n.dir?c.snapAmount[1]:c.snapAmount[0]:c.snapAmount;o=V(o,v,c.snapOffset)}switch(n.dir){case"x":var x=e("#mCSB_"+s.idx+"_dragger_horizontal"),_="left",w=h[0].offsetLeft,S=[f.width()-h.outerWidth(!1),x.parent().width()-x.width()],b=[o,0===o?0:o/s.scrollRatio.x],y=p[1],B=g[1],T=y>0?y/s.scrollRatio.x:0,k=B>0?B/s.scrollRatio.x:0;break;case"y":var x=e("#mCSB_"+s.idx+"_dragger_vertical"),_="top",w=h[0].offsetTop,S=[f.height()-h.outerHeight(!1),x.parent().height()-x.height()],b=[o,0===o?0:o/s.scrollRatio.y],y=p[0],B=g[0],T=y>0?y/s.scrollRatio.y:0,k=B>0?B/s.scrollRatio.y:0}b[1]<0||0===b[0]&&0===b[1]?b=[0,0]:b[1]>=S[1]?b=[S[0],S[1]]:b[0]=-b[0],t[0].mcs||(l(),i("onInit")&&c.callbacks.onInit.call(t[0])),clearTimeout(h[0].onCompleteTimeout),J(x[0],_,Math.round(b[1]),u[1],n.scrollEasing),!s.tweenRunning&&(0===w&&b[0]>=0||w===S[0]&&b[0]<=S[0])||J(h[0],_,Math.round(b[0]),u[0],n.scrollEasing,n.overwrite,{onStart:function(){n.callbacks&&n.onStart&&!s.tweenRunning&&(i("onScrollStart")&&(l(),c.callbacks.onScrollStart.call(t[0])),s.tweenRunning=!0,C(x),s.cbOffsets=r())},onUpdate:function(){n.callbacks&&n.onUpdate&&i("whileScrolling")&&(l(),c.callbacks.whileScrolling.call(t[0]))},onComplete:function(){if(n.callbacks&&n.onComplete){"yx"===c.axis&&clearTimeout(h[0].onCompleteTimeout);var e=h[0].idleTimer||0;h[0].onCompleteTimeout=setTimeout(function(){i("onScroll")&&(l(),c.callbacks.onScroll.call(t[0])),i("onTotalScroll")&&b[1]>=S[1]-T&&s.cbOffsets[0]&&(l(),c.callbacks.onTotalScroll.call(t[0])),i("onTotalScrollBack")&&b[1]<=k&&s.cbOffsets[1]&&(l(),c.callbacks.onTotalScrollBack.call(t[0])),s.tweenRunning=!1,h[0].idleTimer=0,C(x,"hide")},e)}}})}},J=function(e,t,o,a,n,i,r){function l(){S.stop||(x||m.call(),x=K()-v,s(),x>=S.time&&(S.time=x>S.time?x+f-(x-S.time):x+f-1,S.time<x+1&&(S.time=x+1)),S.time<a?S.id=h(l):g.call())}function s(){a>0?(S.currVal=u(S.time,_,b,a,n),w[t]=Math.round(S.currVal)+"px"):w[t]=o+"px",p.call()}function c(){f=1e3/60,S.time=x+f,h=window.requestAnimationFrame?window.requestAnimationFrame:function(e){return s(),setTimeout(e,.01)},S.id=h(l)}function d(){null!=S.id&&(window.requestAnimationFrame?window.cancelAnimationFrame(S.id):clearTimeout(S.id),S.id=null)}function u(e,t,o,a,n){switch(n){case"linear":case"mcsLinear":return o*e/a+t;case"mcsLinearOut":return e/=a,e--,o*Math.sqrt(1-e*e)+t;case"easeInOutSmooth":return e/=a/2,1>e?o/2*e*e+t:(e--,-o/2*(e*(e-2)-1)+t);case"easeInOutStrong":return e/=a/2,1>e?o/2*Math.pow(2,10*(e-1))+t:(e--,o/2*(-Math.pow(2,-10*e)+2)+t);case"easeInOut":case"mcsEaseInOut":return e/=a/2,1>e?o/2*e*e*e+t:(e-=2,o/2*(e*e*e+2)+t);case"easeOutSmooth":return e/=a,e--,-o*(e*e*e*e-1)+t;case"easeOutStrong":return o*(-Math.pow(2,-10*e/a)+1)+t;case"easeOut":case"mcsEaseOut":default:var i=(e/=a)*e,r=i*e;return t+o*(.499999999999997*r*i+-2.5*i*i+5.5*r+-6.5*i+4*e)}}e._mTween||(e._mTween={top:{},left:{}});var f,h,r=r||{},m=r.onStart||function(){},p=r.onUpdate||function(){},g=r.onComplete||function(){},v=K(),x=0,_=e.offsetTop,w=e.style,S=e._mTween[t];"left"===t&&(_=e.offsetLeft);var b=o-_;S.stop=0,"none"!==i&&d(),c()},K=function(){return window.performance&&window.performance.now?window.performance.now():window.performance&&window.performance.webkitNow?window.performance.webkitNow():Date.now?Date.now():(new Date).getTime()},Z=function(){var e=this;e._mTween||(e._mTween={top:{},left:{}});for(var t=["top","left"],o=0;o<t.length;o++){var a=t[o];e._mTween[a].id&&(window.requestAnimationFrame?window.cancelAnimationFrame(e._mTween[a].id):clearTimeout(e._mTween[a].id),e._mTween[a].id=null,e._mTween[a].stop=1)}},$=function(e,t){try{delete e[t]}catch(o){e[t]=null}},ee=function(e){return!(e.which&&1!==e.which)},te=function(e){var t=e.originalEvent.pointerType;return!(t&&"touch"!==t&&2!==t)},oe=function(e){return!isNaN(parseFloat(e))&&isFinite(e)},ae=function(e){var t=e.parents(".mCSB_container");return[e.offset().top-t.offset().top,e.offset().left-t.offset().left]},ne=function(){function e(){var e=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var t=0;t<e.length;t++)if(e[t]+"Hidden"in document)return e[t]+"Hidden";return null}var t=e();return t?document[t]:!1};e.fn[o]=function(t){return u[t]?u[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):u.init.apply(this,arguments)},e[o]=function(t){return u[t]?u[t].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof t&&t?void e.error("Method "+t+" does not exist"):u.init.apply(this,arguments)},e[o].defaults=i,window[o]=!0,e(window).bind("load",function(){e(n)[o](),e.extend(e.expr[":"],{mcsInView:e.expr[":"].mcsInView||function(t){var o,a,n=e(t),i=n.parents(".mCSB_container");if(i.length)return o=i.parent(),a=[i[0].offsetTop,i[0].offsetLeft],a[0]+ae(n)[0]>=0&&a[0]+ae(n)[0]<o.height()-n.outerHeight(!1)&&a[1]+ae(n)[1]>=0&&a[1]+ae(n)[1]<o.width()-n.outerWidth(!1)},mcsInSight:e.expr[":"].mcsInSight||function(t,o,a){var n,i,r,l,s=e(t),c=s.parents(".mCSB_container"),d="exact"===a[3]?[[1,0],[1,0]]:[[.9,.1],[.6,.4]];if(c.length)return n=[s.outerHeight(!1),s.outerWidth(!1)],r=[c[0].offsetTop+ae(s)[0],c[0].offsetLeft+ae(s)[1]],i=[c.parent()[0].offsetHeight,c.parent()[0].offsetWidth],l=[n[0]<i[0]?d[0]:d[1],n[1]<i[1]?d[0]:d[1]],r[0]-i[0]*l[0][0]<0&&r[0]+n[0]-i[0]*l[0][1]>=0&&r[1]-i[1]*l[1][0]<0&&r[1]+n[1]-i[1]*l[1][1]>=0},mcsOverflow:e.expr[":"].mcsOverflow||function(t){var o=e(t).data(a);if(o)return o.overflowed[0]||o.overflowed[1]}})})})});

