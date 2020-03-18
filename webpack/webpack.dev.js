const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { resolveCwd } = require('./lib/utils');
const config = require('./config').dev;
const baseWebpackConfig = require('./webpack.base')(config);
const hotReload = require('path').resolve(
    __dirname,
    '../node_modules/webpack-hot-middleware/client?reload=true&noInfo=true&quiet=true&autoConnect=false',
);

Object.keys(baseWebpackConfig.entry).forEach((name) => {
    baseWebpackConfig.entry[name] = [hotReload].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
    devtool: 'eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.env
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            title: require(resolveCwd('.colorc.js')).title,
            template: 'template.html',
            inject: true
        }),
        new FriendlyErrorsPlugin(),
        new VueLoaderPlugin(),
    ],
    performance: { hints: config.performance }, // 是否显示单个资源超过250kb的提示
    mode: config.mode, // 模式
});