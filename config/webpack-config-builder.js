const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const nodeEnv = process.env.NODE_ENV || "development";
const isdev = nodeEnv == "development";
const mode = isdev ? "development" : "production";

module.exports = (dir, props) => {

  const packageJson = require(path.join(dir, "package.json"));

  const { devhost } = props || {};

  const sharedPlugins = [
    new webpack.DefinePlugin({
      "window.__build_info": {
        version: JSON.stringify(packageJson.version),
        built: JSON.stringify((new Date()).toISOString()),
        mode: JSON.stringify(mode)
      },
      "window.esp32m": JSON.stringify({ backend: { host: isdev ? devhost : undefined } }),
    }),
    new HtmlWebpackPlugin({
      title: 'app',
      template: 'src/index.html'
    }),
  ];

  const pluginsMap = {
    development: [...sharedPlugins],
    production: [...sharedPlugins,
    new CleanWebpackPlugin({}),
    new CompressionPlugin({
      test: /\.(js|css|html|svg)$/,
      algorithm: 'gzip',
    }),
    ...(nodeEnv == "analyze" ? [new BundleAnalyzerPlugin()] : []),
    ]
  }

  return {
    mode,
    entry: {
      main: ["./src/index.ts"]
    },
    devtool: isdev ? "source-map" : "hidden-source-map",
    devServer: {
      historyApiFallback: true,
      port: 9000
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["babel-loader"]
        },
      ]
    },
    optimization: {
      minimize: !isdev,
      minimizer: [new TerserPlugin({ parallel: true, terserOptions: { output: { comments: false } } })]
    },
    performance: {
      maxEntrypointSize: 8000000,
      maxAssetSize: 8000000
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        
      },
      // modules: [path.resolve(dir, 'node_modules'), 'node_modules'],
    },
    plugins: pluginsMap[mode],
    output: {
      path: path.resolve(dir, 'dist'),
    },
  };

}
