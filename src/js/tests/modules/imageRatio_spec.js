/**
 * User: hella
 * Date: 12/28/14
 * Time: 3:24 PM
 * Copyright 1stdibs.com, Inc. 2014. All Rights Reserved.
 */

'use strict';

var imageRatio = require('modules/imageRatio');

describe('imageRatio', function () {
    it('should return values based on the height', function () {
        var dims = imageRatio(100, 150, 100, 100);
        console.log(dims);
    });
});