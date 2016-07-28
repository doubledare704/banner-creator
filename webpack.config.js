var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: "./client/js/app.js",
    resolve: {
        root: '/usr/local/lib/node_modules',
    },
    resolveLoader: {
        root: '/usr/local/lib/node_modules',
    },
    output: {
        path: __dirname,
        filename: "server/static/bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader'),
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("server/static/styles.css")
    ]
};
