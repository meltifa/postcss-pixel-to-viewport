const postcss = require('postcss');

// excluding regex trick: http://www.rexegg.com/regex-best-trick.html
// Not anything inside double quotes
// Not anything inside single quotes
// Not anything inside url()
// Any digit followed by px
// !singlequotes|!doublequotes|!url()|pixelunit
const pxRegex = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)px/ig;

const defaults = {
  viewportWidth: 750,
  propertyBlackList: [],
  minPixelValue: 2,
  mediaQuery: false
};

module.exports = postcss.plugin('postcss-pixel-to-viewport', function (options) {
  const opts = Object.assign({}, defaults, options);
  const pxReplace = createPxReplace(opts.viewportWidth, opts.minPixelValue);

  return function (css) {
    css.walkDecls(function (decl, i) {
      // This should be the fastest test and will remove most declarations
      const next = decl.next();
      const commentText = next && next.type == 'comment' && next.text;
      if (decl.value.indexOf('px') === -1 || commentText === 'px') {
        commentText === 'px' && next.remove();
        return;
      }
      if (commentText === 'vw' || !blacklistedProperty(opts.propertyBlackList, decl.prop)) {
        commentText === 'vw' && next.remove();
        decl.value = decl.value.replace(pxRegex, pxReplace);
      }
    });

    if (opts.mediaQuery) {
      css.walkAtRules('media', function (rule) {
        if (rule.params.indexOf('px') === -1) return;
        rule.params = rule.params.replace(pxRegex, pxReplace);
      });
    }

  };
});

function createPxReplace(viewportSize, minPixelValue) {
  return function (m, $1) {
    if (!$1) return m;
    const pixels = parseFloat($1);
    if (pixels <= minPixelValue) return m;
    return parseFloat((pixels / viewportSize * 100).toFixed(5)) + 'vw';
  };
}

function blacklistedProperty(blacklist, property) {
  if (typeof property !== 'string') return;
  return blacklist.some(function (regex) {
    if (typeof regex === 'string') return property.indexOf(regex) !== -1;
    return property.match(regex);
  });
}
