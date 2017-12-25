var webpack = require('webpack');
var path = require('path');
const CompressionPlugin = require("compression-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
	"babel-polyfill",
    './src/app.js'
  ],
  externals: {
    'cheerio': 'window'
  },
  plugins: [
    new webpack.ProvidePlugin({
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
		new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CompressionPlugin({
			asset: "bundle.gz.js",
			algorithm: "gzip",
			test: /bundle.js$/,
			//threshold: 10240,
			minRatio: 0.8
		}),
    new ExtractTextPlugin('bundle.css')
  ],
  output: {
    path: __dirname + '/public/',
    filename: 'bundle.js'
  },
  resolve: {
    modules: [
      __dirname,
      'node_modules',
      './app'
    ],
    alias: {
    },
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/
      },{
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml"
      },{
        test: /\.(scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
               options: {
                 plugins: function () { // post css plugins, can be exported to postcss.config.js
                   return [
                     require('precss'),
                     require('autoprefixer')
                   ];
                 }
               }
             },
            'sass-loader',
          ],
        }),
      },
    ]
  },
  devtool: process.env.NODE_ENV === 'production' ? undefined : 'cheap-module-eval-source-map'
};
