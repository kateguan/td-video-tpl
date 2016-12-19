"use strict";

var TD = require('./TD');
var Config = require('./Config');
var KeyAnimation = require('./KeyAnimation');

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
