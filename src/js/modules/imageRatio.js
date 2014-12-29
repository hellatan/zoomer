/**
 * User: hella
 * Date: 12/27/14
 * Time: 3:09 PM
 * Copyright 1stdibs.com, Inc. 2014. All Rights Reserved.
 */

'use strict';

/**
 *
 * @param {number} maxW
 * @param {number} maxH
 * @param {number} imgW
 * @param {number} imgH
 * @returns {{w: number, h: number}}
 */
function createImageRatioSize(maxW, maxH, imgW, imgH) {
    var ratio = imgH / imgW;
    if (imgW >= maxW && ratio <= 1){
        imgW = maxW;
        imgH = imgW * ratio;
    } else if(imgH >= maxH){
        imgH = maxH;
        imgW = imgH / ratio;
    } else if (ratio !== 1) {
        if (imgW > imgH) {
            imgW = maxW;
            imgH = imgW * ratio;
        } else {
            imgH = maxH;
            imgW = imgH / ratio;
        }
    }

    return {
        w: imgW,
        h: imgH
    };
}

module.exports = createImageRatioSize;