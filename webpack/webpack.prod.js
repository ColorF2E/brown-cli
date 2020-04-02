const path = require('path');
const { resolveCwd, isPlainObject } = require('./lib/utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const config = require('./config').build;
let baseWebpackConfig = require('./webpack.base')(config);

function getAssetsPath(_path) {
    return path.posix.join(config.assetsSubDirectory, _path);
}

const colorc = require('../lib/get-config')();
let chunks = ['vendor', 'colo'];

if (colorc && colorc.webpack && isPlainObject(colorc.webpack)) {
    baseWebpackConfig = merge(baseWebpackConfig, colorc.webpack);
}

if (colorc && colorc.entries) {
    for (let item in colorc.entries) {
        if (item != 'app') {
            chunks.push(item);
        }
    }
}

chunks.push('manifest');

const webpackConfig = merge(baseWebpackConfig, {
    devtool: config.productionSourceMap ? '#source-map' : false,
    output: {
        path: config.assetsRoot,
        filename: getAssetsPath('js/[name].[chunkhash].js'),
        chunkFilename: getAssetsPath('js/[id].[chunkhash].js')
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.env
        }),
        new MiniCssExtractPlugin({
            filename: getAssetsPath('css/[name].[contenthash].css')
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new HtmlWebpackPlugin({
            title: require(resolveCwd('config')).title,
            filename: config.index,
            template: 'template.html',
            inject: true,
            minify: {
                removeComments: true,
                removeAttributeQuotes: true
            },
            // html-webpack-plugin 4.0.4 弃用
            // chunksSortMode: 'dependency'
        }),

        // webpack 4.x 弃用
        // new webpack.optimize.CommonsChunkPlugin({
        //     names: chunks,
        //     minChunks: 2
        // }),
        new CopyWebpackPlugin([{
            from: resolveCwd('static'),
            to: config.assetsSubDirectory,
            ignore: ['.*']
        }]),
        new VueLoaderPlugin(),
    ],
    performance: { hints: config.performance }, // 是否显示单个资源超过250kb的提示
    mode: config.mode, // 模式
    optimization: {
        splitChunks: {
            chunks: 'all',
            name: true,
            minChunks: 2,
        },
    },
});

module.exports = webpackConfig;