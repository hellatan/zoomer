/**
 * User: hella
 * Date: 12/26/14
 * Time: 9:46 PM
 * Copyright 1stdibs.com, Inc. 2014. All Rights Reserved.
 */

'use strict';

var path = require('path');

module.exports = {
    context: __dirname + '/src/js',
    entry: {
        app: ['webpack/hot/dev-server', './entries/entry']
//        app: ['./entries/entry']
    },
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },
    resolve: {
        root: __dirname + '/src',
        alias: {
            modules: path.resolve(__dirname, "./src/js/modules"),
            tests: path.resolve(__dirname, "./src/js/tests")
        }
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
//                loader: "style-loader!css-loader"
//                loader: "style!css!sass?outputStyle=expanded&includePaths[]=" + (path.resolve(__dirname, "./src/scss"))
                loader: "style!css!sass?outputStyle=expanded"
            }

        ]
    }
};