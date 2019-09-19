const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env) => {
  const { ID, mode = 'development' } = env
  console.log(`Building -> ${ID} ...`)
  return {
    target: 'web',
    mode,
    entry: [`./src/${ID}/index.js`],

    output: {
      path: path.join(__dirname, '../dist'),
      publicPath: './',
      filename: `bundle.${ID}.js`
    },

    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-transform-spread',
              '@babel/plugin-transform-async-to-generator'
            ],
            presets: ['@babel/preset-env']
          }
        }
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }, {
        loader: 'file-loader',
        test: /\.(png|jpg|gif|svg|mp4|mp3|fnt)$/,
        options: {
          name: '[name].[ext]?[hash]'
        }
      }, {
        test: /\.(glsl|frag|vert)$/, use: 'raw-loader', exclude: /node_modules/
      }]
    },

    plugins: [

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      }),

      new HtmlWebpackPlugin({
        filename: `${ID}.html`,
        title: `${ID}`,
        template: './internals/proto-template.html'
      })

    ],

    externals: [ 'canvas' ],

    devtool: 'cheap-module-source-map'
  }
}
