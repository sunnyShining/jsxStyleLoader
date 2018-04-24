const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const px2rem = require('postcss-px2rem-exclude');
const autoprefixer = require('autoprefixer')
const baseWebpackConfig = require('./webpack.base.conf')
const packageConfig = require('../package.json')
const config = require('../config')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

let createNotifierCallback = () => {
    const notifier = require('node-notifier')
    return (severity, errors) => {
        if (severity !== 'error') return
        const error = errors[0]
        const filename = error.file && error.file.split('!').pop()
        notifier.notify({
            title: packageConfig.name,
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: path.join(__dirname, 'logo.png')
        })
    }
}


const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: [
             {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            }, {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
            },
        ]
    },
    devtool: config.dev.devtool,
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
            ],
        },
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: true,
        overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll,
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    px2rem({
                        remUnit: 100,
                        exclude: /node_modules/i
                    }),
                    autoprefixer({ browsers: ['iOS >= 7', 'Android >= 4.1'] })
                ]
            }
        }),
        // copy custom static assets
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: config.dev.assetsSubDirectory,
            ignore: ['.*']
        }])
    ]
});

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(
            	new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                    },
                    onErrors: createNotifierCallback()
                }),
            )
            resolve(devWebpackConfig)
        }
    })
})
