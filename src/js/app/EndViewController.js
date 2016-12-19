"use strict";

var TD = require('./TD'),
    Config = require('./Config'),
    Preload = require('./Preload'),
    KeyAnimation = require('./KeyAnimation');

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