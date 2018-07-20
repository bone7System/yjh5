var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin')
var argv = require('yargs').argv;

//判断当前运行环境是开发模式还是生产模式
const nodeEnv = process.env.NODE_ENV || 'development';
const isPro = nodeEnv === 'production';



const extractModuleCSS = new ExtractTextPlugin('cssModuleStyles.css');
const extractGlobalCSS = new ExtractTextPlugin('cssGlobalStyles.css');
const extractLESS = new ExtractTextPlugin('lessStyles.css');

var plugins = [
    extractGlobalCSS,
    extractModuleCSS,
    extractLESS,
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module) {
            // 该配置假定你引入的 vendor 存在于 node_modules 目录中
            return module.context && module.context.indexOf('node_modules') !== -1;
        }
    }),
    new webpack.DefinePlugin({
        // 定义全局变量
        'process.env':{
            'NODE_ENV': JSON.stringify(nodeEnv)
        }
    }),
    new HtmlWebpackPlugin({
        filename: path.resolve(__dirname, './build/index.html'),
        template: 'index.html',
        inject: true,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
        },
        // necessary to consistently work with multiple chunks via CommonsChunkPlugin
        chunksSortMode: 'dependency'
    })
]
var app = ['./index']
if (isPro) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            comments: false
        })
    );
} else {
    app.unshift('react-hot-loader/patch', 'webpack-dev-server/client?http://127.0.0.1:80', 'webpack/hot/only-dev-server')
    plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    );
}

app.unshift("babel-polyfill")
module.exports = {
    context: path.resolve(__dirname, 'src'),
    devtool: isPro ? 'source-map' : 'inline-source-map',
    entry: {
        app: app
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'build'),
        //publicPath: isPro ? './build/' : '/build/',
        //publicPath:'./',
        chunkFilename: '[name].js'
    },
    // BASE_URL是全局的api接口访问地址
    plugins,
    // alias是配置全局的路径入口名称，只要涉及到下面配置的文件路径，可以直接用定义的单个字母表示整个路径
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.scss', '.css'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.join(__dirname, './src')
        ]

    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader?cacheDirectory=true'
            }
        },{
            test: /\.css$/,
            include: isPro?/(src\/components|src\/containers)/:/(src\\components|src\\containers)/,
            use:extractModuleCSS.extract({
                use: [{
                    loader: "css-loader?modules&localIdentName=[path][name]-[local]-[hash:base64:5]"
                    // loader: "css-loader"
                },{
                    loader: "postcss-loader"
                }]
            })
        },{
            test: /\.css$/,
            include: isPro?/(src\/styles)/:/(src\\styles)/,
            use:extractGlobalCSS.extract({
                use: [{
                    loader: "css-loader"
                },{
                    loader: "postcss-loader"
                }]
            })
        },{
            test: /\.less$/,
            include: /node_modules/,
            use:extractLESS.extract({
                use: [{
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            })
        },{
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use: ['url-loader?limit=10000&name=files/[md5:hash:base64:10].[ext]']
        }]
    },
    devServer: {
        hot: true,
        compress: true,
        port: 80,
        historyApiFallback: true,
        contentBase: path.resolve(__dirname),
        publicPath: '/build/',
        proxy: {
            //此方法直接调用本地的服务
            '/api/zhxg-lxxt/*': {
                  target: 'http://127.0.0.1:6332',
                  secure: false, // 接受 运行在 https 上的服务
                  changeOrigin: true,
                  pathRewrite:{'^/api/zhxg-lxxt':''}
              },
            '/api/zhxg-lxxs/*': {
                target: 'http://127.0.0.1:6342/',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true,
                pathRewrite:{'^/api/zhxg-lxxs':''}
            },
            '/api/zhxg-xtgl/*': {
                target: 'http://127.0.0.1:6022',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true,
                pathRewrite:{'^/api/zhxg-xtgl':''}
            },
            '/front/zhxg-unauth/*': {
                target: 'http://127.0.0.1:6062',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true,
                pathRewrite:{'^/front/zhxg-unauth':''}
            },
            '/api/zhxg-fwgl/*': {
                target: 'http://127.0.0.1:6002/',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true,
                pathRewrite:{'^/api/zhxg-fwgl':''}
            },
            '/api/zhxg-xgdw/*': {
                target: 'http://127.0.0.1:6032/',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true,
                pathRewrite:{'^/api/zhxg-xgdw':''}
            },
            '/api/pub-stuinfo/*': {
                target: 'http://127.0.0.1:6042/',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true,
                pathRewrite:{'^/api/pub-stuinfo':''}
            },
            '/api/docrepo/*':{
                target: 'http://192.168.35.112:1430',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true,
                pathRewrite:{'^/api/docrepo':''}
            },
            '/api/sys/*': {
                target: 'http://192.168.35.112:1470/',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true,
                pathRewrite:{'^/api/sys':''}
            },
            '/login': {
                target: 'http://192.168.35.118:1100/',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true
            },
            '/logout': {
                target: 'http://192.168.35.118:1100/',
                secure: false, // 接受 运行在 https 上的服务
                changeOrigin: true
            },
            '/tryLoginUserInfo': {
                target: 'http://192.168.35.118:1100/',
                secure: false,
                changeOrigin: true
            }
        },
        stats: {
            modules: false,
            chunks: false
        },
    },
};