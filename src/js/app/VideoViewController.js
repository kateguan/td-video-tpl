"use strict";

var TD = require('./TD'),
    Config = require('./Config'),
    Preload = require('./Preload'),
    KeyAnimation = require('./KeyAnimation');

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