'use strict';

var fs = require('fs');
var postcss = require('postcss');
var px2vw = require('..');
var css = fs.readFileSync('main.css', 'utf8');
var options = {
    propertyBlackList: ['font-size']
};
var processedCss = postcss(px2vw(options)).process(css).css;

fs.writeFile('main-viewport.css', processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('File with viewport units written.');
});
