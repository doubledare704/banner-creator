var ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
module.exports = {
    entry: {
        admin: "./client/js/app.js",
        editor: "./client/js/app_editor.js"
    },
    output: {
        path: __dirname,
        filename: "server/static/[name]bundle.js"
    },
    eslint: {
        configFile: '.eslintrc.json'
    },
    module: {
        preLoaders: [
            {test: /\.jsx?$/, loader: "eslint-loader", exclude: /node_modules/}
        ],
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
                    presets: ['es2015', 'react', 'stage-0']
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("server/static/styles.css"),

        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })

    ]
}
;
