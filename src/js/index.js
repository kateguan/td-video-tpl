"use strict";

//引入的包根据实际情况而定
var TD = require('./app/TD'),
    Config = require('./app/Config'),
    Preload = require('./app/Preload'),
    KeyAnimation = require('./app/KeyAnimation'),
    LoadViewController = require('./app/LoadViewController'),
    EndViewController = require('./app/EndViewController'),
    VideoViewController = require('./app/VideoViewController');

/*
 *
 *  引入lib库文件和LESS文件
 *  必须要引入,过滤器会过滤lib文件夹里面的JS文件,做一个简单的复制
 *  复制到相应的文件夹
 *  引入的less会对less进行编译存放到css文件夹
 * */
require('zepto');

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

