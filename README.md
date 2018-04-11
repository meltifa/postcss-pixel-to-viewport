# postcss-pixel-to-viewport

A plugin for [PostCSS](https://github.com/ai/postcss) that generates viewport units (vw) from pixel units.

## Usage

If your project involves a fixed width, this script will help to convert pixels into viewport units.

### Input/Output

```css
// input

.class {
  margin: -10px .5vh;
  padding: 5vmin 9.5px 1px;
  border: 3px solid black;
  border-bottom-width: 1px;
  font-size: 14px;/*vw*/
  line-height: 20px;/*px*/
}

.class2 {
  border: 1px solid black;
  margin-bottom: 1px;
  font-size: 20px;
  line-height: 30px;
}

@media (min-width: 750px) {
  .class3 {
    font-size: 16px;
    line-height: 22px;
  }
}

// output

.class {
  margin: -1.33333vw .5vh;
  padding: 5vmin 1.26667vw 1px;
  border: 0.4vw solid black;
  border-bottom-width: 1px;
  font-size: 1.86667vw;
  line-height: 20px;
}

.class2 {
  border: 1px solid black;
  margin-bottom: 1px;
  font-size: 20px;
  line-height: 4vw;
}

@media (min-width: 750px) {
  .class3 {
    font-size: 16px;
    line-height: 2.93333vw;
  }
}
```

### Example

```js
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
```

### Options

Default:
```js
{
  viewportWidth: 750,
  propertyBlackList: [],
  minPixelValue: 2,
  mediaQuery: false
}
```
- `viewportWidth` (Number) The width of the viewport.
- `propertyBlackList` (Array) The propertys to ignore and leave as px.
    - If value is string, it checks to see if property contains the string.
        - `['font']` will match `font-size`
    - If value is regexp, it checks to see if the property matches the regexp.
        - `[/^font$/]` will match `font` but not `font-size`
- `minPixelValue` (Number) Set the minimum pixel value to replace.
- `mediaQuery` (Boolean) Allow px to be converted in media queries.

### Use comment to enable/disable transform some property's px value

- `font-size: 14px;/*px*/` will not transform px to vw.
- `font-size: 14px;/*vw*/` will transform px to vw, if `font-size` is in your property blackList but you want to transform this property specifically.

### Use with gulp-postcss

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var px2vw = require('postcss-pixel-to-viewport');

gulp.task('css', function () {

    var processors = [
        px2vw({
            viewportWidth: 750
        })
    ];

    return gulp.src(['build/css/**/*.css'])
        .pipe(postcss(processors))
        .pipe(gulp.dest('build/css'));
});
```
