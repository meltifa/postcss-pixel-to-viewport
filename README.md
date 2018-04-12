# postcss-pixel-to-viewport

A plugin for [PostCSS](https://github.com/postcss/postcss) that generates viewport units (vw, vh, vmin, vmax) from pixel units.

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
  font-size: 14px;/*on*/
  line-height: 20px;/*off*/
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
  margin: -1.33333vmin .5vh;
  padding: 5vmin 1.26667vmin 1px;
  border: 0.4vmin solid black;
  border-bottom-width: 1px;
  font-size: 1.86667vmin;
  line-height: 20px;
}

.class2 {
  border: 1px solid black;
  margin-bottom: 1px;
  font-size: 2.66667vmin;
  line-height: 4vmin;
}

@media (min-width: 750px) {
  .class3 {
    font-size: 2.13333vmin;
    line-height: 2.93333vmin;
  }
}
```

### Example

```js
'use strict';

var fs = require('fs');
var postcss = require('postcss');
var px2viewport = require('..');
var css = fs.readFileSync('main.css', 'utf8');
var options = {
  propertyBlacklist: ['font-size']
};
var processedCss = postcss(px2viewport(options)).process(css).css;

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
  viewportUnit: 'vmin',
  propertyBlacklist: [],
  minPixelValue: 2,
  enableConvertComment: 'on',
  disableConvertComment: 'off',
  mediaQuery: false
}
```
- `viewportWidth` (Number) The width of the viewport.
- `viewportUnit` (String) Expected units.
- `propertyBlacklist` (Array) The propertys to ignore and leave as px.
    - If value is string, it checks to see if property contains the string.
        - `['font']` will match `font-size`
    - If value is regexp, it checks to see if the property matches the regexp.
        - `[/^font$/]` will match `font` but not `font-size`
- `minPixelValue` (Number) Set the minimum pixel value to replace.
- `enableConvertComment` (String) content of comment for enable convert px unit before the declaration.
- `disableConvertComment` (String) content of comment for disable convert px unit before the declaration.
- `mediaQuery` (Boolean) Allow px to be converted in media queries.

### Use comment to enable/disable convert px value for single declaration

- `font-size: 14px;/*on*/` comment before the declaration will convert px to viewport unit, if `font-size` is in your property blacklist but you want to convert this single declaration.
- `font-size: 14px;/*off*/` comment before the declaration will not convert px unit.

### Use with gulp-postcss

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var px2viewport = require('postcss-pixel-to-viewport');

gulp.task('css', function () {
  var processors = [
    px2viewport({
      viewportWidth: 750
    })
  ];
  return gulp.src(['build/css/**/*.css'])
    .pipe(postcss(processors))
    .pipe(gulp.dest('build/css'));
});
```
