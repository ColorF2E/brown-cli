const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolveCwd } = require('./lib/utils')
const getAssetsPath = (_path, config) => {
    return resolveCwd(config.assetsSubDirectory, _path);
};
const resolveCur = function (...p) {
    return path.resolve(__dirname, ...p);
};
const getCssLoaders = (env, inVue, colorc) => {
    let styleLoader = inVue ? 'vue-style-loader' : 'style-loader';

    // 如果是移动端则使用 postcss-pxtorem 打包
    if (colorc._meta.type === 'Mobile') {
        // 设置默认值
        let postcssPlugins = {
            rootValue: 100,
            minPixelValue: 2,
            propWhiteList: [],
        };

        // 判断 .colorc 里是否有 postcssPlugins 对象
        if (colorc.postcssPlugins) {
            postcssPlugins = Object.assign({}, postcssPlugins, colorc.postcssPlugins);
        }

        if (env === 'production') {
            return [
                styleLoader,
                // MiniCssExtractPlugin.loader, // 需要注意的是 MiniCssExtractPlugin.loader 和 style-loader 由于某种原因不能共存。
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: path.posix.join(__dirname, 'postcss.config.js')
                        },
                        plugins: (loader) => [
                            require('autoprefixer')(),
                            require('postcss-pxtorem')(postcssPlugins),
                        ]
                    }
                },
                'sass-loader',
            ];
        } else {
            return [
                styleLoader,
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: path.posix.join(__dirname, 'postcss.config.js')
                        },
                        plugins: (loader) => [
                            require('autoprefixer')(),
                            require('postcss-pxtorem')(postcssPlugins),
                        ]
                    }
                },
                'sass-loader',
            ];
        }
    } else {
        if (env === 'production') {
            return [
                styleLoader,
                // MiniCssExtractPlugin.loader, // 需要注意的是 MiniCssExtractPlugin.loader 和 style-loader 由于某种原因不能共存。
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: path.posix.join(__dirname, 'postcss.config.js')
                        },
                        plugins: (loader) => [
                            require('autoprefixer')(),
                        ]
                    }
                },
                'sass-loader',
            ];
        } else {
            return [
                styleLoader,
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: path.posix.join(__dirname, 'postcss.config.js')
                        },
                        plugins: (loader) => [
                            require('autoprefixer')(),
                        ]
                    }
                },
                'sass-loader',
            ]
        }
    }
}

module.exports = function (config) {
    const env = JSON.parse(config.env.NODE_ENV);
    const colorc = require('../lib/get-config')();
    let entries = {
        app: resolveCwd('src/main.js'),
        vendor: ['vue', 'vue-router', 'vuex'],
    };
    let eslintRules = require('./rules');
    const eslintIgnore = []; // 配置 ESLint 忽略的文件

    // TODO: 打包重点
    if (colorc._meta.type == 'Mobile') {
        entries['colo'] = ['mand-mobile', 'brown-http'];
    } else {
        entries['colo'] = ['brown-ui', 'brown-http'];
    }

    if (colorc) {
        if (colorc.rules) { // enlint规则
            eslintRules = Object.assign({}, eslintRules, colorc.rules);
        }
        if (colorc.entries) {
            entries = Object.assign({}, entries, colorc.entries);
        }
    }

    if (colorc.eslint && colorc.eslint.ignore) {
        colorc.eslint.ignore.forEach(item => {
            eslintIgnore.push(path.join('src', item));
        });
    }

    return {
        entry: entries,
        output: {
            path: resolveCwd('dist'),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: config.assetsPublicPath,
            // library: 'dataAnalysis',
            // libraryTarget: 'window'
        },
        resolveLoader: {
            modules: [resolveCur("../node_modules"), "node_modules"]
        },
        resolve: {
            modules: [resolveCur("../node_modules"), "node_modules"],
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue$': 'vue/dist/vue.common.js'
            },
        },
        module: {
            rules: [
                {
                    test: /\.(vue|js(x)?)$/,
                    enforce: 'pre',
                    loader: 'eslint-loader',
                    include: [resolveCwd('src')],
                    options: {
                        ignorePattern: eslintIgnore,
                        formatter: require("eslint-friendly-formatter"),
                        useEslintrc: false,
                        parser: 'vue-eslint-parser',
                        parserOptions: {
                            parser: "babel-eslint",
                            sourceType: 'module',
                        },
                        env: ['browser'],
                        plugins: [
                            'vue'
                        ],
                        rules: eslintRules,
                    },
                },
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            scss: getCssLoaders(env, true, colorc)
                        }
                    }
                },
                {
                    test: /\.(css|scss)$/,
                    use: getCssLoaders(env, false, colorc)
                },
                {
                    test: /\.js(x)?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    include: [
                        path.resolve('node_modules/resize-detector'), // 例外会报错 https://github.com/Justineo/resize-detector/issues/5
                    ],
                },
                {
                    test: /\.html$/,
                    exclude: [resolveCwd('template.html')],
                    loader: 'vue-html-loader'
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'static/img/[name].[hash:7].[ext]'
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: 'static/font/[name].[hash:7].[ext]'
                    }
                }
            ]
        }
    }
}
