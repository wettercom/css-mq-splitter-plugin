# CSS Media Query splitter plugin for webpack

## Usage example

If you have the following CSS:

``` css
.test {
  color: red;
}

@media screen and (min-width: 720px) {
  .test {
    color: blue;
    font-size: 2em;
  }
}

@media screen and (min-width: 720px) {
  .test2 {
    background: blue;
  }
}

@media screen and (min-width: 1200px) {
  .test {
    color: green;
    font-size: 3em;
  }
}
```

And you configure your webpack to use this plugin:

``` javascript
var CSSMQSplitterPlugin = require("css-mq-splitter-plugin");
module.exports = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", "css")
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("bundle.css"),
    new CSSMQSplitterPlugin({
      "screen and (min-width: 720px)": 'tablet',
      "screen and (min-width: 1200px)": 'desktop'
    })
  ]
}
```

This configuration will create the following files

* bundle.css
* bundle.tablet.css
* bundle.desktop.css

You can then use the following following files to be included in your html like so:
<link rel="stylesheet" href="bundle.css" />
<link rel="stylesheet" media="screen and (min-width: 720px)" href="bundle.tablet.css" />
<link rel="stylesheet" media="screen and (min-width: 1200px)": 'desktop" href="bundle.desktop.css" />
