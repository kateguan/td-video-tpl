/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	//引入的包根据实际情况而定
	var TD = __webpack_require__(1),
	    Config = __webpack_require__(2),
	    Preload = __webpack_require__(3),
	    KeyAnimation = __webpack_require__(4),
	    LoadViewController = __webpack_require__(5),
	    EndViewController = __webpack_require__(6),
	    VideoViewController = __webpack_require__(7);

	/*
	 *
	 *  引入lib库文件和LESS文件
	 *  必须要引入,过滤器会过滤lib文件夹里面的JS文件,做一个简单的复制
	 *  复制到相应的文件夹
	 *  引入的less会对less进行编译存放到css文件夹
	 * */
	__webpack_require__(8);

	//阻止页面滑动
	var stopmove = function () {
	    var touchTime = 0;
	    document.body.addEventListener('touchstart', function (e) {
	        if(touchTime == 0){
	            //touchTime = Date.parse(new Date())/1000;
	            touchTime = new Date().getTime();
	            console.log(touchTime);
	        }else{
	            if(new Date().getTime() - touchTime < 500){
	                e.preventDefault();
	                return false;
	            }
	            else{
	                //touchTime = Date.parse(new Date())/1000;
	                touchTime = new Date().getTime();

	            }
	        }

	    });
	}
	stopmove();

	//页面级对象池
	var pagePool = {
	    loadView: null,
	    videoView: null,
	    endView: null,
	};

	var init = function() {

	    pagePool.loadView = pagePool.loadView || new LoadViewController();
	    var loadView = pagePool.loadView;


	    //Video页面
	    var VideoPageBack = function() {
	        pagePool.videoView = pagePool.videoView || new VideoViewController();

	        var videoView = pagePool.videoView;
	        // videoView.show();

	        videoView.onstop = function () {

	            endPageBack();

	            pagePool.endView.setZIndex();

	            setTimeout(function () {
	                videoView.hide();
	            },200);

	        };

	        videoView.onplay = function(){

	            loadView.hide();

	        };

	        videoView.play();

	    };

	    //end页面
	    var endPageBack = function() {
	        pagePool.endView = pagePool.endView || new EndViewController();
	        var endView = pagePool.endView;

	        endView.show();

	    };

	    loadView.show();
	    loadView.onstart = VideoPageBack;
	    loadView.load();

	};

	//$(window).on('load', init);
	init();



/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	var TD = {};

	//美林版ajax对应接口
	TD.ajax = function(pm, succback, errorback){
		$.ajax({
			type: pm.type || 'GET',
			url: pm.url,
			dataType: 'json',
			data: pm.data || '',
			success: function(data){
				if (data.status == 1) {
					succback && succback(data.data);
				}else {
					errorback && errorback(data.message);
				}
			},
			error: function(xhr, status, thrown){
				errorback && errorback('网络连接不稳定，请重试或刷新页面！');
			}
		});
	};

	/*data参数说明
	data = {
		title: string, 朋友圈标题，给朋友的描述
		desc: string, 给朋友的标题
		link: string, 链接
		img: string, 图标
		track: string, 分享数据上报地址,post {btn:'1'}朋友或{btn:'2'}朋友圈
	}
	*/
	TD.wxShare = function(data, callback){
		wx.onMenuShareTimeline({
			title: data.title, // 分享标题
			link: data.link, // 分享链接
			imgUrl: data.img, // 分享图标
			success: function () {
				callback && callback();
				//上报朋友圈
				TD.ajax({
					url: 'http://click.treedom.cn/log',
					type: 'POST',
					data: {
						key: 'wechat',
	                    val: 'timeline',
	                    pro: data.proj
					}
				}, function(data){
					console.log(data);
				}, function(msg){
	                console.log(msg);
	            });

	            _czc && _czc.push(['_trackEvent', '分享', "朋友圈"]);
			},
			cancel: function () {
				// 用户取消分享后执行的回调函数
			}
		});
		wx.onMenuShareAppMessage({
	        title: data.title, // 分享标题
	        desc: data.desc, // 分享描述
	        link: data.link, // 分享链接
	        imgUrl: data.img, // 分享图标
	        success: function () {
	            callback && callback();
	            //上报朋友
	            TD.ajax({
	                url: 'http://click.treedom.cn/log',
	                type: 'POST',
	                data: {
	                    key: 'wechat',
	                    val: 'message',
	                    pro: data.proj
	                }
	            }, function(data){

	            }, function(msg){
	                console.log(msg);
	            });

	            _czc && _czc.push(['_trackEvent', '分享', "好友"]);
	        },
	        cancel: function () {
	            // 用户取消分享后执行的回调函数
	        }
	    });
	    wx.onMenuShareQQ({
	        title: data.title, // 分享标题
	        desc: data.desc, // 分享描述
	        link: data.link, // 分享链接
	        imgUrl: data.img, // 分享图标
		    success: function () { 
		       // 用户确认分享后执行的回调函数
		            callback && callback();
		            //上报朋友
		            TD.ajax({
		                url: 'http://click.treedom.cn/log',
		                type: 'POST',
		                data: {
		                    key: 'wechat',
		                    val: 'QQ',
		                    pro: data.proj
		                }
		            }, function(data){

		            }, function(msg){
		                console.log(msg);
		            });

		            _czc && _czc.push(['_trackEvent', '分享', "QQ好友"]);
		    },
		    cancel: function () { 
		       // 用户取消分享后执行的回调函数
		    }
		});

	    wx.onMenuShareQZone({
	        title: data.title, // 分享标题
	        desc: data.desc, // 分享描述
	        link: data.link, // 分享链接
	        imgUrl: data.img, // 分享图标
		    success: function () { 
		       // 用户确认分享后执行的回调函数
		            callback && callback();
		            //上报朋友
		            TD.ajax({
		                url: 'http://click.treedom.cn/log',
		                type: 'POST',
		                data: {
		                    key: 'wechat',
		                    val: 'QZone',
		                    pro: data.proj
		                }
		            }, function(data){

		            }, function(msg){
		                console.log(msg);
		            });

		            _czc && _czc.push(['_trackEvent', '分享', "QZone"]);
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    }
		});
	};

	//初始化微信接口
	//注意，与微信标准data相比，这里多了data.share属性，对应的是初始化页面时有默认的分享数据
	TD.initWxApi = function(shareData, errback, succback){
		//服务器获取验证信息
		TD.ajax({
			url: 'http://click.treedom.cn/wx/signature',
			type: 'POST',
			data: {
				appid: shareData.appid,
	        	url:  encodeURIComponent(shareData.link)
			}
		}, function(data){
			wx.config({
				debug: false,
				appId: data.appId,
				timestamp: data.timestamp,
				nonceStr: data.nonceStr,
				signature: data.signature,
				jsApiList: [
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
		            'onMenuShareQQ',
		            'onMenuShareQZone',
					'startRecord',
					'stopRecord',
					'onVoiceRecordEnd',
					'playVoice',
					'pauseVoice',
					'stopVoice',
					'onVoicePlayEnd',
					'uploadVoice',
					'downloadVoice',
					'chooseImage',
					'previewImage',
					'uploadImage',
					'downloadImage',
					'getNetworkType'
				]
			});
			wx.ready(function(){
				succback && succback();
				TD.wxShare(shareData);
				wx.getNetworkType({
		            success: function (res) {
		                var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
		                _czc && _czc.push(['_trackEvent', networkType, '网络类型']);
		            }
		        });
			});
		},function(err){
			console.log(err);
		});
		
	};

	//元素基于屏幕自适应缩放，dom上有data-response属性的元素都会受它影响
	/*
	config = {
		width: 375,
		height: 600,
		type: 'cover' // 'contain'
	}
	return config定义的scale值
	v1 新增，在dom上增加data-type属性，可选内容有"cover"、"contain"
	*/
	TD.responseBody = function(config) {
		config = config || {};
		config.width = config.width || 375;
		config.height = config.height || 600;
		config.type = config.type || 'cover'; //'cover'、'contain'
		console.log(config);

		var responseList = $('[data-response]');

		var rate;
		var rateCover;
		var rateContain;

		var responseFn = function(){
			var rateX = window.innerWidth / config.width;
			var rateY = window.innerHeight / config.height;

			rateCover = rateX > rateY ? rateX : rateY;
			rateContain = rateX < rateY ? rateX : rateY;

			switch (config.type) {
				case 'cover':
					rate = rateCover;
					break;
				case 'contain':
					rate = rateContain;
					break;
				default:
					rate = 1;
			}

			responseList.each(function(i){
				var type = $(this).attr('data-type');
				var elRate;
				if(type == 'cover'){
					elRate = rateCover;
				}else if(type == 'contain') {
					elRate = rateContain;
				}else {
					elRate = rate;
				}
				this.style.webkitTransform = 'scale(' + elRate + ')';
			});
		};

		responseFn();

		$(window).on('resize', function(){
			responseFn();
		});

		return rate;
	}

	//提示竖屏函数
	TD.portraitTips = function(el) {
		var portraitFloat = (typeof el === 'string') ? $(el) : el ;

		var orientHandler = function(){
			if(window.orientation == 90|| window.orientation == -90){
				portraitFloat.show();
			} else {
				portraitFloat.hide();
			}
		};
		orientHandler();

		$(window).on('resize', function(){
			orientHandler();
		});
	};

	/*检测转屏函数用法
	API：TD.rotateScreen.addListener(callback);//添加事件侦听
		 TD.rotateScreen.removeListener();//取消事件侦听

	example： 
		TD.rotateScreen.addListener(function (data) {
			if(data == 1){
				console.log('左转屏');
				TD.rotateScreen.removeListener();//注销事件侦听
			}

			if(data == 2){
				console.log('右转屏');
			}

			if(data == 3){
				console.log('竖屏');
			}

			if(data == 4){
				console.log('倒屏');
			}
		})*/
	TD.rotateScreen = (function (){
	    var rotate;

	    var add = function (callback) {

	        rotate = function (e) {
	            if( Math.abs(e.beta) < 15 && e.gamma < -40 ){
	                callback && callback(1);//左转屏
	            }
	            if( Math.abs(e.beta) < 15 && e.gamma > 40 ){
	                callback && callback(2);//右转屏
	            }
	            if( e.beta > 40 && Math.abs(e.gamma) < 15 ){
	                callback && callback(3);//竖屏
	            }
	            if( e.beta < -40 && Math.abs(e.gamma) < 15 ){
	                callback && callback(4);//倒屏
	            }
	        }

	        window.addEventListener('deviceorientation',rotate)
	    }

	    var remove = function () {
	        /*解决ios设备会缓存上次移除deviceorientation事件时角度的问题。*/
	        if ( navigator.userAgent.indexOf('Android') > -1 ) {
	            window.removeEventListener('deviceorientation',rotate)
	        }
	    }

	    return {
	        addListener: add,
	        removeListener: remove
	    };
	})(); 

	//网络工具包
	TD.util = {}
	TD.util.getQuery = function(name){
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
	TD.util.setCookie = function (name, value, expiredays) {
	    var exdate = new Date();
	    document.cookie = name + "=" + value + ";expires=" +
	        ((expiredays == null) ? exdate.setDate(exdate.getDate() + expiredays) : exdate.toGMTString())
	        + ";domain=treedom.cn";
	};
	TD.util.getCookie = function (name) {
	    var c_start, c_end;
	    if (document.cookie.length > 0) {
	        c_start = document.cookie.indexOf(name + "=");
	        if (c_start != -1) {
	            c_start = c_start + name.length + 1;
	            c_end = document.cookie.indexOf(";", c_start);
	            if (c_end == -1) c_end = document.cookie.length;
	            return unescape(document.cookie.substring(c_start, c_end))
	        }
	    }
	    return '';
	};

	module.exports = TD;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Preload = __webpack_require__(3);

	var Config = Config || {};

	//ajax请求链接
	Config.requireUrl = '';

	//默认分享语
	Config.defShare = {
		title: '分享标题',
		desc: '分享描述',
		link: location.href,
		//分享配图
		img: 'http://weiqi.treedom.cn/img/share.jpg',
		//项目名，数据查询时候用
		proj: 'kfc05',
		//填写公众号绑定的appid
		appid: 'wx12380ea254191f1b'
	};

	//图片路径前缀
	Config.imgPath = 'dist/img/';

	Config.isAndroid = navigator.userAgent.indexOf('Android') > -1;

	Config.scale = 1;

	Config.audioPath = {
		/*
		audio_bg: Config.imgPath + 'audio_bg.mp3'
		*/
	}

	//把它当全局对象来用
	Config.audio = {};


	Config.Preload = Preload;


	//预加载的图片
	Config.pageImgs = {
		imgs: [
			 {
	             name: 'loading_percent',
	             url: Config.imgPath + 'loading_percent.png'
	         },
			 {
	             name: 'loading_start',
	             url: Config.imgPath + 'loading_start.png'
	         },
			 {
	             name: 'loading',
	             url: Config.imgPath + 'loading.jpg'
	         }
		],
		sprites: [
			/*
			{
				el: $('.m-game .kf-game-video'),
				pathPrefix: Config.imgPath,
				postfix: 'jpg'
			}
			*/
		],
		keyimgs: [
			/*
			{
				el: $('.m-game .kf-game-video'),
				pathPrefix: Config.imgPath,
				postfix: 'jpg'
			}
			*/
		]
	};
		
	module.exports = Config;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var TD = __webpack_require__(1);
	/*
	//全局加载器v.0.2
	pm = {
		imgs: [
			{
				url: url,
				name: name
			},
			{
				url: url2,
				name: name2
			}
		],
		sprites: [
			{
				url: url,
				name: name
			}
		],
		//keyimgs实际是Preload.loadKeyImgs的一个二次包装，参数详情参看preloadImgs方法
		keyimgs: [
			{
				el: elDom,
				pathPrefix: 'img/',
				postfix: 'jpg'
			}
		]
		ajaxs: [
			{
				url: 'xxx.html',
				type: 'POST',
				data: {},
				succback: function(data){
					console.log(data);
				},
				errback: function(msg){
					console.log(msg);
				}
			},
			{
				url: 'xxx.html'
			}
		]
	}

	var x = new Preload(param);
	x.onloading = function(p){
		console.log(p);
	}
	x.onload = function(){
		console.log('succback');
	}
	//默认只有ajax请求不成功才会触发
	x.onfail = function(err){
		console.log(err.url);
		console.log(err.msg);
	}
	//返回当前状态的百分比，完成是100
	x.getProcess();

	//启动
	x.load();

	加载完毕后Preload有一个全局的buffer，里面存了所有图片的键值对，格式如下例子
	Preload.buffer = {
		imgs: {
			bg: imgObj
		},
		sprites: {
			sp: imgObj
		},
		keyimgs: {
			title: Preload.loadKeyImgs.buffer
		}
	}

	*/
	var Preload = function(pm, keyW){
		var that = this;
		
		//预定义回调
		this.onloading = null;
		this.onload = null;
		this.onfail = null;
		
		//预定义全局变量
		var imgsLen = pm.imgs ? pm.imgs.length : 0;
		var spritesLen = pm.sprites ? pm.sprites.length : 0;
		var keyimgsLen = pm.keyimgs ? pm.keyimgs.length : 0;
		var ajaxsLen = pm.ajaxs ? pm.ajaxs.length : 0;
		var keyimgsWeight = keyW || 7;
		var totalLen = imgsLen + spritesLen + keyimgsLen * keyimgsWeight + ajaxsLen;
		var count = 0;
		
		this.getProcess = function(){
			return count;
		}
		
		//载入普通图片
		var loadImg = function(){
			var imgSuccessFn = function(e){
				count++;
				//存入内存中
				Preload.buffer.imgs[this.bufferName] = this;
				if (count == totalLen){
					that.onloading && that.onloading(100);
					that.onload && that.onload();
				}else {
					that.onloading && that.onloading(Math.round(count/totalLen * 100));
				}
			};
			
			for (var i = 0; i < imgsLen; i++) {
				var img = new Image();
				img.onload = img.onerror = imgSuccessFn;
				//加个属性
				img.bufferName = pm.imgs[i].name;
				img.src = pm.imgs[i].url;
			}
		};
		
		//载入雪碧图
		var loadSprite = function(){
			var imgSuccessFn = function(){
				count++;
				//存入内存中
				Preload.buffer.sprites[this.bufferName] = this;
				if (count == totalLen){
					that.onloading && that.onloading(100);
					that.onload && that.onload();
				}else {
					that.onloading && that.onloading(Math.round(count/totalLen * 100));
				}
			};
			
			for (var i = 0; i < spritesLen; i++) {
				var img = new Image();
				img.onload = img.onerror = imgSuccessFn;
				//加个属性
				img.bufferName = pm.sprites[i].name;
				img.src = pm.sprites[i].url;
			}
		};
		
		//载入帧动画图片
		var loadKeyimg = function(){
			var keyimgSuccessFn = function(){
				count = count + keyimgsWeight - this.keyProcess;
				Preload.buffer.keyimgs = Preload.loadKeyImgs.buffer;
				if (count == totalLen) {
					that.onloading && that.onloading(100);
					that.onload && that.onload();
				}else {
					that.onloading && that.onloading(Math.round(count/totalLen * 100));
				}
			};
			
			var keyimgLoadFn = function(p){
				var c = Math.floor(p*keyimgsWeight/100);
				//如果没有变化就不执行
				if (c == this.keyProcess) {
					return;
				}
				var increase = c - this.keyProcess;
				count = count + increase;
				this.keyProcess = c;
				c !== keyimgsWeight && that.onloading && that.onloading(Math.round(count/totalLen * 100));
			};
			
			for (var i = 0; i < keyimgsLen; i++){
				var keyimg = new Preload.loadKeyImgs(pm.keyimgs[i].el, pm.keyimgs[i].pathPrefix, pm.keyimgs[i].pad , pm.keyimgs[i].postfix);
				keyimg.onload = keyimgSuccessFn;
				keyimg.onloading = keyimgLoadFn;
				//加一个对象属性，记录进度
				keyimg.keyProcess = 0;
				keyimg.load();
			}
		};
		
		//载入ajax,加载器只负责加载资源，如果ajax载入不成功，也默认不去阻碍整体流程，但是可以在onfail中处理异常
		//ajax加载失败会在errback和onfail中同时被触发
		var loadAjax = function(){
			//计数器
			var ajaxSuccessFn = function(){
				count++;
				if (count == totalLen) {
					that.onloading && that.onloading(100);
					that.onload && that.onload();
				}else {
					that.onloading && that.onloading(Math.round(count/totalLen * 100));
				}
			};
			
			pm.ajaxs.forEach(function(value){
				TD.ajax({
					url: value.url,
					type: value.type || 'GET',
					data: value.data || '',
				}, (function(v){
					return function(data){
						ajaxSuccessFn();
						v.succback && v.succback(data);
					};
				})(value), (function(v){
					return function(msg){
						ajaxSuccessFn();
						v.errback && v.errback(msg);
						that.onfail && that.onfail({
							msg: msg,
							url: v.url
						});
					};
				})(value));
			});
		};
		
		this.load = function(){
			if (totalLen == 0) {
				this.onload && this.onload();
				return;
			}
			
			imgsLen !== 0 && loadImg();
			spritesLen !== 0 && loadSprite();
			keyimgsLen !== 0 && loadKeyimg();
			ajaxsLen !== 0 && loadAjax();
		};
	};
	Preload.buffer = {
		imgs: {},
		sprites: {},
		keyimgs: {}
	};

	//数字补位函数pad(100, 5) => '00100'
	Preload.pad = (function() {
	    var padLen = 5; //补位常数
	    var tbl = [];
	    return function(num, n) {
	        n = n || padLen;
	        var len = n-num.toString().length;
	        if (len <= 0) return num;
	        if (!tbl[len]) tbl[len] = (new Array(len+1)).join('0');
	        return tbl[len] + num;
	    }
	})();

	//加载单个动画帧
	/*
	dom使用规则：<div class="canvas" data-prefix="title_" data-keyTo="83"></div>
	data-prefix是文件名前缀，也是内存中图片数组的名字，如上例内存中名字是title
	data-keyTo图片命名从0开始，例子中83是最后一张，图片需要数字补齐如title_00083.png

	el：canvas容器，jq对象；
	pathPrefix：图片的url前缀，如'img/'
	pad：图片名序列号补位数，默认是5位，如83补位5就是00083；
	postfix: 图片后缀，默认是png；

	//图片已加载完成回调
	loadKeyImgs.onload = callback;

	//图片加载中回调
	loadKeyImgs.onloading = callback;
	callback = function(p){
		//p是图片加载百分数
	}

	//执行加载，应该要放到上面两个回调函数之后用
	loadKeyImgs.load();

	//所有已经成功加载的图片数组都被存到了Preload.loadKeyImgs对象的buffer中，属性名就是文件前缀，如上例就是Preload.loadKeyImgs.buffer.title
	*/

	Preload.loadKeyImgs = (function(){

	    var fn = function(el, pathPrefix, pad, postfix){
	        var that = this;
	        var prefixName = el.attr('data-prefix');
	        var keyTo = parseInt(el.attr('data-keyTo'));
	        var keyList = [];
	        var count = 0;
	        pad = pad || 5;
	        postfix = postfix || 'png';
	        this.len = keyTo+1;
	        var successFn = function(){
	            count++;

	            that.onloading && that.onloading(Math.floor(count/(keyTo + 1) * 100));

	            if (count == keyTo+1) {
	                //把已经加载好的dom存入内存缓存中方便后续调用:Preload.loadKeyImgs.home_title
	                Preload.loadKeyImgs.buffer[prefixName.slice(0, prefixName.length-1)] = keyList;
	                that.onload && that.onload();
	            }
	        }

	        //写的时候必须先绑定onload，否则有可能从缓存中读取的onload事件会被忽略
	        this.onload = null;
	        this.onloading = null;
	        this.load = function(){
	            //如果在内存中已经保存
				/*
	            if (Preload.loadKeyImgs.buffer[prefixName.slice(0, prefixName.length-1)]) {
	                for(var i = 0; i < keyTo+1; i++){
	                    count++;
	                    that.onloading && that.onloading(100);
	                }
	                that.onload && that.onload();
	                return;
	            };
				*/

	            for(var i = 0; i < keyTo+1; i++){
	                var img = new Image();
	                img.src = pathPrefix + prefixName + Preload.pad(i, pad) + '.' + postfix;
	                img.onload = img.onerror = successFn;
	                keyList.push(img);
	            }
	        }

	    }
	    //把函数当对象使用，存东西
	    fn.buffer = {};
	    return fn;
	})();

	module.exports = Preload;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var TD = __webpack_require__(1);
	//动画帧播放器v.0.3
	/*
	el：canvas容器，jq对象；
	type：图片源模式，'array'和'sprite'模式，array需要后面提供图片对象数组，sprite需要提供基于宽度扩展的单张雪碧图
	imgs：图片帧对象数组或单图，对应不同模式；
	options:{
		cover: 10, //从数组中指定cover，默认是0
		fps: 30, //默认是24
		loop: 10 //初始化默认的循环数，在formTo中可以设置，默认是infinite,
		resolution: 2 //雪碧图模式才需要，图片的高清比例，与@2x相似，默认是2，低清模式是1,
		width: 300, //注意，隐藏元素是拿不到宽度的，所以特殊情况下需要指定宽度
		height: 300
	}
	参数1:启始帧（从0开始），参数2:结束帧数，参数3:循环次数，默认是infinite
	KeyAnimation.fromTo(10, 20, 1, callback);

	参数1:启始帧（从高位开始），参数2:结束帧数（从低位结束），参数3:循环次数，默认是infinite；与fromTo的区别是倒着播放
	KeyAnimation.toFrom(20, 10, 1, callback);

	参数1:启始帧（从0开始），参数2:结束帧数，参数3:循环次数，默认是infinite
	正播过去，再倒播回来
	KeyAnimation.repeatplay(10, 20, 1, callback);

	参数1:启始帧（从0开始），参数2:循环次数，默认是infinite
	KeyAnimation.from(10, 1, callback);

	参数1:结束帧数，参数2:循环次数，默认是infinite
	KeyAnimation.to(20, 1, callback);

	跳到某一帧
	KeyAnimation.goto(10);

	向后一帧或向前一帧，
	KeyAnimation.next();
	KeyAnimation.prev();

	暂停动画，目前只是使计时器内部函数不再运作，不推荐使用该方法
	KeyAnimation.pause();

	停止并回到第一帧或cover帧
	KeyAnimation.stop();

	//从当前位置播放动画，会继承上次使用fromTo、form或to的属性
	KeyAnimation.play(callback);

	//获取当前状态，值有“stop、play”
	KeyAnimation.getState();

	//获取图片数组长度
	KeyAnimation.getLen();

	//销毁对象
	KeyAnimation.destroy();

	*/

	var KeyAnimation = function(el, type, imgs, options){
		if (!el || !imgs) {
			throw new Error('el、imgs是必选填参数');
			return false;
		};
		if (type !== 'array' && type !== 'sprite') {
			throw new Error('只支持"array"和"sprite"模式');
			return false;
		};

		var that = this;

		var imgsLen = null;
		var canvas = null;
		var count = 0;
		var ctx = null;
		var timeMac = null;
		var state = 'stop';
		//用投机取巧的做法试试，这个值基本代表了无限
		var infinite = 1000000000;
		var plusNum = null;
		var plusCount = 0;
		var ispause = false;

		//会有'array'和'sprite'模式
		var mode = type;

		//默认参数
		var defOpt = {
			cover: 0,
			fps: 24,
			loop: 'infinite',
			resolution: 2
		}
		//初始化可选参数
		options = options || defOpt;
		options.cover = options.cover || defOpt.cover,
		options.fps = options.fps || defOpt.fps,
		options.loop = options.loop || defOpt.loop;
		//图片分辨比例，与@2x的概念相似，只有sprite需要该选项，默认为2
		options.resolution = options.resolution || defOpt.resolution;


		//记录上一次播放行为
		var recordFrom = 0;
		var recordTo = null;
		var recordInf = options.loop;

		var createCanvas = function(){
			canvas = $('<canvas>').get(0);
			ctx = canvas.getContext('2d');
			canvas.width = options.width * 2 || el.width() * 2;
			canvas.height = options.height * 2 || el.height() * 2;
			canvas.style.display = 'block';
			canvas.style.width = '100%';
			canvas.style.height = '100%';
			el.append(canvas);
		};

		//drawImg
		var drawImg = function(n){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			if (mode == 'array') {
				//先判断图片有没有宽度，如果没有，一般是图片没有加载下来
				if (imgs[n].width != 0) {
					ctx.drawImage(imgs[n], 0, 0, canvas.width, canvas.height);
				};
			}else if (mode == 'sprite') {
				var imgWidth = imgs.width / imgsLen;
				ctx.drawImage(imgs, imgWidth * n , 0, imgWidth, imgs.height, 0, 0, canvas.width, canvas.height);
			}else {
				console.log('没有匹配模式');
			}
		};

		var showCover = function(){
			drawImg(options.cover);
		};

		var init = function(){
			createCanvas();

			if (mode === 'array') {
				imgsLen = imgs.length;
			}else {
				//计算出有多少张雪碧图
				imgsLen = Math.round((2 * imgs.width) / (canvas.width * options.resolution));
			}
			console.log('current mode is:' + mode);
			recordTo = imgsLen - 1;

			showCover();
		};


		//API list

		this.goto = function(n){
			drawImg(n);
			count = n;
		};

		this.next = function(){
			var n = (count + 1 + imgsLen - 1) % (imgsLen - 1);
			this.goto(n);
		};

		this.prev = function(){
			var n = (count - 1 + imgsLen - 1) % (imgsLen - 1);
			this.goto(n);
		};

		this.fromTo = function(from, to, loop, callback){
			//每次调用前先清理上次未执行完的动画
			clearInterval(timeMac);

			var that = this;
			var keyCount = from;
			var timeFn = function(){
				if (ispause) {
					return;
				};
				if (plusNum <= plusCount) {
					clearInterval(timeMac);
					timeMac = null;
					plusCount = 0;
					plusNum = 0;
					state = 'stop';
					callback && callback();
					return;
				}else {
					if (keyCount > to) {
						keyCount = from;
					};
					that.goto(keyCount);
					//帧计数器
					keyCount++;
					//总量计数器
					plusCount++;
				}
				//播放进度回调
				that.playBack && that.playBack(keyCount/imgsLen);
			}
			plusCount = 0;
			state = 'play';
			loop = !loop || loop == 'infinite' ? infinite : loop;
			//总量
			plusNum = (to - from + 1) * loop;
			ispause = false;

			//做一下记录
			recordFrom = from;
			recordTo = to;
			recordInf = loop;

			timeFn();
			timeMac = setInterval(timeFn, 1000/options.fps);
		};
		
		//倒着播，特殊运用
		this.toFrom = function(to, from, loop, callback){
			//每次调用前先清理上次未执行完的动画
			clearInterval(timeMac);

			var that = this;
			var keyCount = to;
			var timeFn = function(){
				if (ispause) {
					return;
				};
				if (plusNum <= plusCount) {
					clearInterval(timeMac);
					timeMac = null;
					plusCount = 0;
					plusNum = 0;
					state = 'stop';
					callback && callback();
					return;
				}else {
					if (keyCount < from) {
						keyCount = to;
					};
					that.goto(keyCount);
					//帧计数器
					keyCount--;
					//总量计数器
					plusCount++;
				}
				//播放进度回调
				that.playBack && that.playBack(keyCount/imgsLen);
			}
			plusCount = 0;
			state = 'play';
			loop = !loop || loop == 'infinite' ? infinite : loop;
			//总量
			plusNum = (to - from + 1) * loop;
			ispause = false;

			//做一下记录
			recordFrom = from;
			recordTo = to;
			recordInf = loop;

			timeFn();
			timeMac = setInterval(timeFn, 1000/options.fps);
		}
		
		this.repeatplay = function(from, to, loop, callback){
			var that = this;
			var count = 0;
			
			loop = !loop || loop == 'infinite' ? infinite : loop;
			
			var toBack = function(){
				count++;
				if(count == loop){
					callback && callback();
				}else {
					that.fromTo(from, to, 1, fromBack);
				}
			}
			
			var fromBack = function(){
				that.toFrom(to, from, 1, toBack);
			}
			
			this.fromTo(from, to, 1, fromBack);
			
		}

		this.from = function(from, loop, callback){
			var to = imgsLen - 1;
			this.fromTo(from, to, loop, callback)
		};

		this.to = function(to, loop, callback){
			var from = 0;
			this.fromTo(from, to, loop, callback)
		}

		this.pause = function(){
			ispause = true;
			state = 'stop';
		}

		this.play = function(callback){
			if (state == 'play') {
				return;
			};
			if (!ispause) {
				this.fromTo(recordFrom, recordTo, recordInf, callback);
			}else {
				ispause = false;
			}
		}

		this.stop = function(){
			clearInterval(timeMac);
			state = 'stop';
			plusNum = null;
			plusCount = 0;
			ispause = false;

			//重置纪录
			recordFrom = 0;
			recordTo = imgsLen - 1;
			recordInf = options.loop;

			drawImg(options.cover);
		}

		this.getState = function(){
			return state;
		}

		this.getLen = function(){
			return imgsLen;
		}

		this.destroy = function(){
			clearInterval(timeMac);
			timeMac = null;
			ctx = null;
			$(canvas).remove();
			canvas = null;

			for(var key in this){
				delete this[key];
			}
		}
		
		init();
	};

	module.exports = KeyAnimation;
		

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var TD = __webpack_require__(1);
	var Config = __webpack_require__(2);
	var KeyAnimation = __webpack_require__(4);

	//项目初始化的一些函数
	var initProject = function(){

	    //初始化微信接口
	    TD.initWxApi(Config.defShare);
		
		$(document.documentElement).on('touchmove', function(e) {
			e.preventDefault();
		});
	    
	};

	//加载页对象
	var LoadViewController = function(){
	    
	    //公共变量
	    var _that = this;
	    
	    //私有变量
	    var _private = {};
	    
	    _private.pageEl = $('.m-loading');

	    _private.btnPercent = _private.pageEl.find('.loadProcess');

	    _private.btnPlay = _private.pageEl.find('.btn-play');
	    
	    _private.isInit = false;
	    
	    //初始化，包括整体页面
	    _private.init = function(){
	        if (_private.isInit === true) {
	            return;
	        }

	        initProject();
	        
	        //加载体现在页面上
	        _private.processLineEl = _private.pageEl.find('.loadProcess .inner');
	        
	        _private.gload = new Config.Preload(Config.pageImgs);
	        
	        _private.gload.onloading = function(p){
	    		console.log(p);
	            // _private.processLineEl.css('height', p + '%');
	            _private.processLineEl.html(p);

	        };
	        
	        _private.gload.onload = function(){

	            _private.btnPercent.hide();

	            _private.btnPlay.show();

	            //ios自动播放
	            var u = navigator.userAgent;
	            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	            if(isAndroid){
	                console.log('android');
	                _private.pageEl.on('touchstart', function () {

	                    _that.onstart && _that.onstart();

	                })
	            }else{
	                console.log('ios');

	                _that.onstart && _that.onstart();

	            }


	           /* // 手动播放
	            _private.pageEl.on('touchstart', function () {

	                _that.onstart && _that.onstart();

	            });*/



	    	};
	        
	        _private.gload.onfail = function(msg){
	            console.log(msg);
	        };
	        
	        // _private.loadAudio();
	        
	        _private.isInit = true;
	        
	        
	    };
	    
	    //显示
	    _that.show = function(){ //
	        _private.pageEl.show();
	    };
	    
	    //隐藏
	    _that.hide = function(){ //
	        _private.pageEl.hide();
	        
	        _that.onhide && _that.onhide();//
	    };
	    
	    //执行加载
	    _that.load = function(){ //
	        _private.gload.load();
	    };
	    
	    _private.init();
	    
	};
		
	module.exports = LoadViewController;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var TD = __webpack_require__(1),
	    Config = __webpack_require__(2),
	    Preload = __webpack_require__(3),
	    KeyAnimation = __webpack_require__(4);

	//加载页对象
	var EndViewController = function(){

	    //公共变量
	    var _that = this;

	    //私有变量
	    var _private = {};

	    _private.pageEl = $('.m-end');

	    _private.btnSeeAgain = _private.pageEl.find('.btn-seeAgain');

	    _private.btnToShare = _private.pageEl.find('.btn-toShare');

	    _private.shareWrap = _private.pageEl.find('.share-wrap');

	    _private.isInit = false;

	    var gamma = 0;

	    //初始化，包括整体页面
	    _private.init = function(){

	        if (_private.isInit === true) {
	            return;
	        }

	        _private.isInit = true;

	        _private.btnToShare.on("touchstart",function (e) {
	            _private.shareWrap.show();
	            return false;
	        })

	        _private.shareWrap.on('touchstart',function (e) {
	            $(this).hide();
	        })

	    };

	    //显示
	    _that.show = function(){

	        _private.pageEl.show();


	    };

	    //隐藏
	    _that.hide = function(){ //
	        _that.onhide && _that.onhide();//
	        _private.pageEl.hide();
	    };

	    _that.setZIndex = function () {

	        _private.pageEl.css({
	            'opacity':1
	        });

	    }

	    _private.init();

	};

	module.exports = EndViewController;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var TD = __webpack_require__(1),
	    Config = __webpack_require__(2),
	    Preload = __webpack_require__(3),
	    KeyAnimation = __webpack_require__(4);

	//加载页对象
	var VideoViewController = function(){

	    //公共变量
	    var _that = this;

	    //私有变量
	    var _private = {};

	    _private.pageEl = $('.m-video');

	    _private.videoBox = _private.pageEl.find('.video-main');


	    _private.isInit = false;

	    var gamma = 0;

	    //初始化，包括整体页面
	    _private.init = function(){

	        if (_private.isInit === true) {
	            return;
	        }

	        _private.videoBox.on('ended', function () {

	            _that.onstop && _that.onstop();

	            setTimeout(function () {
	                _that.hide();
	            },500);

	        });

	        var resizeVideo = function (config) {

	            config = config || {};
	            config.width = config.width || 750;
	            config.height = config.height || 1200;
	            config.type = config.type || 'contain';
	            console.log(config);



	            console.log("resizeVideo");

	            var resizeGo = function () {

	                if(this.currentTime > 0){

	                    var width = config.width/100;

	                    var height = config.height/100;

	                    if(config.type == 'cover'){
	                        _private.videoBox.css({
	                            top: '50%',
	                            left: '50%',
	                            width: width+'rem',
	                            height: height+'rem',
	                            margin: -height/2 + 'rem 0 0 ' + -width/2 + 'rem'
	                        });
	                    }else if(config.type == 'contain'){
	                        _private.videoBox.css({
	                            width: '100%',
	                            height: '100%'
	                        })
	                    }else{
	                        console.log('error:type=cover/contain');
	                        _private.videoBox.off('timeupdate', resizeGo);
	                        return false

	                    }

	                    _private.videoBox.off('timeupdate', resizeGo);

	                    _that.onplay && _that.onplay();

	                }

	            };

	            _private.videoBox.on('timeupdate', resizeGo);

	        };
	        //视频配置
	        resizeVideo({
	            width: 750,
	            height: 1200,
	            type: 'contain'/*cover/contain*/
	        });

	        _private.isInit = true;

	    };


	    //播放
	    _that.play = function(){
	        _private.videoBox.get(0).play();
	    }


	    //显示
	    _that.show = function(){
	        _private.pageEl.show();

	    };

	    //隐藏
	    _that.hide = function(){ //
	        _that.onhide && _that.onhide();//
	        _private.pageEl.hide();
	    };

	    _private.init();

	};

	module.exports = VideoViewController;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "/dist/js/lib/zepto.min.js";

/***/ }
/******/ ]);