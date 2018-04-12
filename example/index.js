'use strict';

var fs = require('fs');
var postcss = require('postcss');
var px2viewport = require('..');
var css = fs.readFileSync('./example/main.css', 'utf8');
var options = {
  propertyBlackList: ['font-size']
};
var processedCss = postcss(px2viewport(options)).process(css).css;

fs.writeFile('./example/main-viewport.css', processedCss, function (err) {
  if (err) {
    throw err;
  }
  console.log('File with viewport units written.');
});
