var rework = require('rework');
var splitMedia = require('rework-split-media');
var moveMedia = require('rework-move-media');
var stringify = require('css-stringify');
var RawSource = require('webpack-sources').RawSource;

function CSSMQSplitterPlugin(options = {}) {
  this.options = options;
}

CSSMQSplitterPlugin.prototype.apply = function(compiler) {
  const options = this.options;
  compiler.plugin('this-compilation', (compilation) => {
    compilation.plugin('optimize-chunk-assets', (chunks, done) => {
      chunks.map((chunk) => {
        // Filter out only css files.
        const files = chunk.files.filter(function(path) {
          return path.match(/\.css$/);
        });
        // Go through each file of the chunk.
        files.map((file) => {
          // Grab the source of the css.
          let source = compilation.assets[file].source();
          // Process with rework and split it by media queries.
          let css = splitMedia(rework(source).use(moveMedia()));
          // Extract the non media query css and remove it from processing.
          var originalSource = stringify(css['']);
          delete css[''];
          Object.keys(css).map((mediaQuery) => {
            // If the media query is in the options, then create a new file for it.
            if (options[mediaQuery]) {
              let source = stringify(css[mediaQuery]);
              let newFile = file.replace(/(\.css)$/, '.' + options[mediaQuery] + '.css');
              compilation.assets[newFile] = new RawSource(source);
            }
          });
          compilation.assets[file] = new RawSource(originalSource);
          done();
        });
      });
    });
  });
};

module.exports = CSSMQSplitterPlugin;
