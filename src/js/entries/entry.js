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
var canvas = new fabric.Canvas('zoom', {
    width: $(window).width(),
    height: $(window).height()
});
var maxW = $win.width();
var maxH = $win.height();
var $img = $('.main-img > img');
var imgElement = $img[0];
var imageSize = imageRatio(maxW, maxH, $img.width(), $img.height());
var imgW = imageSize.w;
var imgH = imageSize.h;
var origH = imgH;
var origW = imgW;

var rectInstance = new fabric.Rect({
    opacity: 0.5,
    height: 20,
    width: 300,
    top: maxH - 50,
    left: ($win.width() / 2) - 150,
    hasControls: false,
    hasBorders: false
});

var innerRectInstance = new fabric.Rect({
    fill: 'rgb(90, 90, 90)',
    opacity: 0.7,
    height: 4,
    width: 294,
    top: maxH - 50 + 3,
    left: ($win.width() / 2) - 150 + 3,
    hasControls: false,
    hasBorders: false,
    hoverCursor: 'cursor'
});

var circleHandleInstanceRight = new fabric.Circle({
    fill: 'rgb(255, 255, 255)',
    opacity: 0.7,
    radius: 15,
    top: maxH - 50,
    left: ($win.width() / 2) - (25),
    hasControls: false,
    hasBorders: false,
    lockMovementY: true,
    hoverCursor: 'pointer'
});

circleHandleInstanceRight.on('moving', function () {
    console.log('circle: ', this)
});

var imgInstance = new fabric.Image(imgElement, {
    left: ($win.width() / 2) - (imgW / 2),
    top: 0,
    height: imgH,
    width: imgW,
    hasControls: false,
    centeredScaling: true,
    lockUniScaling: true,
    lockRotation: true,
    hasBorders: false,
    hoverCursor: 'cursor'
});

var boundingRect = imgInstance.getBoundingRect()
console.log('boudning rect: ', boundingRect);


var newCenter = function () {

};

module.exports = {
    init: function () {
        canvas.add(imgInstance, rectInstance, innerRectInstance, circleHandleInstanceRight);
        canvas.bringToFront(rectInstance);
        canvas.bringToFront(innerRectInstance);
        canvas.bringToFront(circleHandleInstanceRight);
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