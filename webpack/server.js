require('./lib/check-versions')();

const proc = require('child_process');
const ora = require('ora');
const Koa = require('koa');
const app = new Koa();
const { merge } = require('webpack-merge');
const staticMiddleware = require('koa-static');
const koaWebpack = require('koa-webpack');
const proxy = require('koa-proxies');
const historyFallback = require('koa2-history-api-fallback');
const { resolveCwd, isPlainObject } = require('./lib/utils');
const colorc = require('../lib/get-config')();

module.exports = async (port, peace) => {
    let webpackConfig = require('./webpack.dev');

    if (colorc && colorc.webpack && isPlainObject(colorc.webpack)) {
        webpackConfig = merge(webpackConfig, colorc.webpack);
    }
    if (peace) {
        webpackConfig.module.rules.shift();
    }

    const config = require('./config').dev;
    const webpack = require('webpack');
    const compiler = webpack(webpackConfig);
    const staticPath = resolveCwd(config.assetsPublicPath);

    app.use(staticMiddleware(staticPath));
    app.use(historyFallback());

    const middleware = await koaWebpack({
        compiler,
        hotClient: {
            logLevel: 'error', // 浏览器只显示 error 提示
        },
        devMiddleware: {
            publicPath: webpackConfig.output.publicPath,
        },
    });
    app.use(middleware);

    if (colorc && colorc.proxy) {
        const proxyTable = colorc.proxy;
        Object.keys(proxyTable).forEach(path => {
            app.use(proxy(path, proxyTable[path]));
        });
    }

    const spinner = new ora('等待 webpack 打包完成...');
    spinner.start();

    port = port || (colorc && colorc.port) || 8080;
    const host = (colorc && colorc.href) || 'localhost';
    const url = `http://${host}:${port}`;

    app.listen(port);

    middleware.devMiddleware.waitUntilValid(() => {
        spinner.stop();

        if (colorc._meta.type === 'electron') {
            const child = proc.spawn(
                process.platform === 'win32' ? 'npm.cmd' : 'npm',
                ['run', 'dev'],
                { stdio: 'inherit' }
            )
            child.on('close', function (code) {
                process.exit(code);
            });
        } else {
            require('opn')(url);
        }
    });
};
