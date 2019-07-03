const path = require('path')
const webpack = require('webpack')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SwPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')

const apiUrl = process.env.API_URL || 'http://localhost:8080'
const timestamp = Date.now()

module.exports = {
  target: 'web',
  mode: process.env.NODE_ENV,
  entry: {
    index: ['./index'],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](axios|bignumber\.js|dayjs|emotion|history|react|react-dom|react-router|react-router-dom)[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  output: {
    path: path.resolve('./build'),
    filename: `assets/${timestamp}/app-[name].js`,
    chunkFilename: `assets/${timestamp}/app-[name].js`,
    publicPath: '/',
  },
  context: path.resolve('./src'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'awesome-typescript-loader',
            options: {
              silent: true,
              configFileName: 'tsconfig.webpack.json',
            },
          },
        ],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `assets/${timestamp}/image-[name].[ext]`,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true,
            },
          },
        ],
      },
      {
        test: /\.i18n$/,
        use: [{ loader: '@choffmeister/react-i18next-loader' }],
      },
      {
        test: /\.md$/,
        use: 'raw-loader',
      },
    ],
  },
  plugins: [
    process.env.NODE_ENV === 'production' &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'generateStatsFile',
        generateStatsFile: true,
        statsFilename: 'webpack-stats.json',
        statsOptions: {
          source: false,
        },
      }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: path.resolve('./src'),
      },
    }),
    new HtmlWebpackPlugin({
      template: './index.html.ejs',
      inject: false,
      minify:
        process.env.NODE_ENV === 'production'
          ? {
              collapseWhitespace: true,
              minifyCSS: true,
            }
          : false,
    }),
    process.env.NODE_ENV === 'production' &&
      new SwPrecacheWebpackPlugin({
        // By default, a cache-busting query parameter is appended to requests
        // used to populate the caches, to ensure the responses are fresh.
        // If a URL is already hashed by Webpack, then there is no concern
        // about it being stale, and the cache-busting can be skipped.
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        logger: message => {
          if (message.indexOf('Total precache size is') === 0) {
            // This message occurs for every build and is a bit too noisy.
            return
          }
          if (message.indexOf('Skipping static resource') === 0) {
            // This message obscures real errors so we ignore it.
            // https://github.com/facebookincubator/create-react-app/issues/2612
            return
          }
          console.log(message)
        },
        minify: true,
        // For unknown URLs, fallback to the index page
        navigateFallback: '/',
        // Ignores URLs starting from /__ (useful for Firebase):
        // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
        navigateFallbackWhitelist: [/^(?!\/__).*/],
        // Don't precache sourcemaps (they're large) and build asset manifest:
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
      }),
  ].filter(plugin => Boolean(plugin)),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  devtool: '#sourcemap',
  devServer: {
    host: process.env.WEBPACK_HOST || undefined,
    port: parseInt(process.env.WEBPACK_PORT || 8000),
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api/*': {
        target: apiUrl,
        secure: false,
      },
    },
    stats: 'errors-only',
  },
}
