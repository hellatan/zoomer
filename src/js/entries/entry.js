/**
 * User: hella
 * Date: 12/26/14
 * Time: 9:47 PM
 * Copyright 1stdibs.com, Inc. 2014. All Rights Reserved.
 */

'use strict';

require('scss/main.scss');

var $ = require('jquery');
var fabric = require('fabric').fabric;
var imageRatio = require('modules/imageRatio');

var $win = $(global);
var winW;
var winH;
var maxW = $win.width();
var maxH = $win.height();
var $canvasContainer = $('.canvas-wrapper');
var containerW = $canvasContainer.width();
var containerH = $canvasContainer.height();
var leftStart = containerW;

console.log('containerH: ', containerH);
console.log('containerW: ', containerW);
var canvas = new fabric.Canvas('zoom', {
    width: containerW,
    height: containerH
});

maxW = containerW;
maxH = containerH;

var $img = $('.main-img > img');
var imgElement = $img[0];
var origH = $img.height();
var origW = $img.width();
var imageSize = imageRatio(maxW, maxH, origW, origH);
var imgW = imageSize.w;
var imgH = imageSize.h;
var initScaleH = imgH / origH;
var initScaleW = imgW / origW;
var originalZoomHandlerCenter;

var rectInstance = new fabric.Rect({
    opacity: 0.5,
    height: 40,
    width: 300,
    left: (leftStart / 2) - 150,
    hasControls: false,
    hasBorders: false,
    hoverCursor: 'cursor',
    lockMovementY: true,
    lockMovementX: true
});

var sliderBar = new fabric.Rect({
    fill: 'rgb(90, 90, 90)',
    opacity: 0.7,
    height: 4,
    width: 294,
    top: maxH - 50 + 3,
    left: (leftStart / 2) - 150 + 3,
    hasControls: false,
    hasBorders: false,
    hoverCursor: 'cursor',
    lockMovementY: true,
    lockMovementX: true
});

var zoomHandlerTop = sliderBar.top - (15 - (sliderBar.height / 2));
var zoomHandler = new fabric.Circle({
    fill: 'rgb(255, 255, 255)',
    opacity: 0.7,
    radius: 15,
    top: zoomHandlerTop,
    left: (leftStart / 2) - (sliderBar.width / 2) + 15,
    hasControls: false,
    hasBorders: false,
    lockMovementY: true,
    hoverCursor: 'pointer'
});

var imgInstance = new fabric.Image(imgElement, {
    left: (leftStart / 2) - (imgW / 2),
    top: 0,
    hasControls: false,
    centeredScaling: true,
    lockUniScaling: true,
    lockRotation: true,
    hasBorders: false,
    hoverCursor: 'cursor',
    lockMovementY: true,
    lockMovementX: true
});

var incrementer = sliderBar.width / 100;
var prevLeft;

imgInstance.on('moving', function (e) {
    // restricts image from moving too far left/right/up/down
    var top = imgInstance.top;
    var bottom = top + imgInstance.height;
    var left = imgInstance.left;
    var right = left + imgInstance.width;

    var imgWidth = imgInstance.getWidth();
    var imgHeight = imgInstance.getHeight();
    var maxLeft = $canvasContainer.width() - imgWidth;
    var maxRight = $canvasContainer.width() + imgWidth;
    var maxTop = $canvasContainer.height() - imgHeight;
    var maxBottom = $canvasContainer.height() + imgHeight;

    console.log('left: ', maxLeft, ' :: ', left);
    console.log('right: ', maxRight, ' :: ', right);
    console.log('top: ', maxTop, ' :: ', top);
    console.log('bottom: ', maxBottom, ' :: ', bottom);

    if (left <= maxLeft) {
        imgInstance.set({
            left: maxLeft
        });
    } else if (left > 0) {
        imgInstance.set({
            left: 0
        });
    }

    if (right >= maxRight) {
        imgInstance.set({
            right: maxRight
        });
    } else if (right < $(window).width()) {
        imgInstance.set({
            right: $(window).width()
        });
    }

    if (top <= maxTop) {
        imgInstance.set({
            top: maxTop
        });
    } else if (top > 0) {
        imgInstance.set({
            top: 0
        });
    }

    if (bottom >= maxBottom) {
        imgInstance.set({
            bottom: maxBottom
        });
    } else if (bottom < $(window).height()) {
        imgInstance.set({
            bottom: $(window).height()
        });
    }

//    imgInstance.setCoords();

});

zoomHandler.on('moving', function (e) {
    var top = zoomHandler.top;
    var bottom = top + zoomHandler.height;
    var left = zoomHandler.left;
    var right = left + zoomHandler.width;

    var topBound = sliderBar.top;
    var bottomBound = topBound + sliderBar.height;
    var leftBound = sliderBar.left;
    var rightBound = leftBound + sliderBar.width;
    var zoomHandlerCenterX = zoomHandler.width / 2;

    var xBounds = Math.min(Math.max(left, leftBound - zoomHandlerCenterX), rightBound - zoomHandlerCenterX);
    var yBounds = Math.min(Math.max(top, topBound), bottomBound - ((zoomHandler.height / 2) + (sliderBar.height / 2)));

    // capping logic here
    zoomHandler.setLeft(xBounds);
    zoomHandler.setTop(yBounds);

});

canvas.on("mouse:up", function(e) {
    console.log('mouse up target: ', e.target)
    var left = zoomHandler.left;
    var leftBound = sliderBar.left;
    var rightBound = leftBound + sliderBar.width;
    var zoomHandlerCenterX = zoomHandler.width / 2;

    var xBounds = Math.min(Math.max(left, leftBound - zoomHandlerCenterX), rightBound - zoomHandlerCenterX);

    if (left >= xBounds && left <= xBounds && (e.target && !e.target._element)) {
        if (imgInstance.width) {
            console.log('imgInstance.width: ', imgInstance.width)
            console.log('imgInstance.height: ', imgInstance.height)
            var newLeft = left / 100;
            var newScale = newLeft / incrementer;
            imgInstance.animate('scaleY', newScale, {
                onChange: canvas.renderAll.bind(canvas),
                easing: fabric.util.ease.easeOutQuad
            });
            canvas.renderAll();
            imgInstance.animate('scaleX', newScale, {
                onChange: canvas.renderAll.bind(canvas),
                easing: fabric.util.ease.easeOutQuad
            });
        }
    }
    module.exports.updateImageMovement();
    prevLeft = zoomHandler.left;
});

var scaleControl = $('.scale-control');
scaleControl.onchange = function() {
    imgInstance.scale(parseFloat(this.value)).setCoords();
    canvas.renderAll();
};

module.exports = {
    init: function () {
        rectInstance.set({
            top: maxH - 50
        });



        imgInstance.set({
            scaleY: imgH / origH,
            scaleX: imgW / origW,
            originX: 'center',
            originY: 'center'
        });

        var imgCenterX = imgInstance.getWidth();
        var imgCenterY = imgInstance.getHeight();

        imgInstance.set({
            left: imgCenterX,
            top: imgCenterY / 2
        })


        canvas.add(imgInstance, sliderBar, zoomHandler);
        canvas.bringToFront(sliderBar);
        canvas.bringToFront(zoomHandler);
        originalZoomHandlerCenter = zoomHandler.getCenterPoint();

        winW = $(window).width();
        winH = $(window).height();
    },
    updateImageMovement: function () {
        if (imgInstance.getWidth() > winW) {
            console.log('can move x')
            imgInstance.set({ lockMovementX: false });
        } else {
            console.log('can NOT move x')
            imgInstance.set({ lockMovementX: true });
        }
        if (imgInstance.getHeight() > winH) {
            console.log('can move y')
            imgInstance.set({ lockMovementY: false });
        } else {
            console.log('can NOT move y')
            imgInstance.set({ lockMovementY: true });
        }
    }
};

$(function () {
    module.exports.init();
});

$(window).on('resize', function () {
    var winW = $(window).width();
    var winH = $(window).height();
    canvas.setWidth(winW);
    canvas.setHeight(winH);
    imageSize = imageRatio(winW, winH, imgInstance.getWidth(), imgInstance.getHeight());
    imgInstance.set({
        width: imageSize.w,
        height: imageSize.h
    })
});