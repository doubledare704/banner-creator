var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: {
        admin: "./client/js/app.js",
        editor: "./client/js/app_editor.js"
    },
    output: {
        path: __dirname,
        filename: "server/static/[name]bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.styl$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!stylus-loader'),
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("server/static/styles.css")
    ]
};