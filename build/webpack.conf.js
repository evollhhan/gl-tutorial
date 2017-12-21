const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const webpackConfig = {
  entry: {
    app: './src/index.ts'
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].bundle.js',
    publicPath: './'
  },
  resolve: {
    extensions: ['.js', '.ts', '.scss', '.json'],
    alias: {
      "@libs": path.join(__dirname, '../libs')
    }
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'tslint-loader',
          options: {
            configFile: './tslint.json',
            typeCheck: true,
            emitErrors: false,
            formattersDirectory: 'node_modules/custom-tslint-formatters/formatters',
            formatter: 'grouped'
          }
        },
      },
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: ['ts-loader']
      },
      {
        test: /\.scss$/,
        // 抽离单独css文件
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader', 
            {
              loader: 'postcss-loader',
              options: {
                plugins: (loader) => {
                  let plugins = [require('autoprefixer')()]
                  return plugins
                }
              }
            },
            'px2rem-loader',
            'sass-loader'
          ]
        })
      }
    ] 
  },
  plugins: [
    // 分析的时候再用
    // new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    // 抽离重复plguin
    new webpack.optimize.ModuleConcatenationPlugin(),
    // 把css抽成单独文件
    new ExtractTextPlugin({
      filename: '[name].bundle.css',
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: 'index.html'
    }),
  ]
}

// Dev settings
if (process.env.NODE_ENV !== 'production') {
  console.log('Load development env...')
  const { entry, plugins } = webpackConfig;
  webpackConfig.entry.app = ['./build/dev-client', entry.app]
  webpackConfig.output.publicPath = '/'
  webpackConfig.devtool = '#cheap-module-eval-source-map',
  webpackConfig.plugins = [
    new FriendlyErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),    
    ...plugins
  ]
}

module.exports = webpackConfig