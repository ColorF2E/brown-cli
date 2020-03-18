const { resolveCwd } = require('./lib/utils')
// const config = require(resolveCwd('./config.js'));
const config = require(resolveCwd('./.colorc.js'))

module.exports = {
    dev: {
        env: { NODE_ENV: '"development"' },
        port: config.port,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: config.proxy,
        performance: false, // 是否显示单个资源超过250kb的提示
        mode: 'development', // 模式
    },
    build: {
        env: { NODE_ENV: '"production"' },
        index: resolveCwd('./dist/index.html'),
        assetsRoot: resolveCwd('./dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: false, // 是否生成 sourceMap
        performance: false, // 是否显示单个资源超过250kb的提示
        mode: 'production', // 模式
    }
}
