var path = require('path');

module.exports = {
    context: path.join(__dirname, "/src"),
    entry: "./swipe",
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015'],
                }
            }
        ]
    },
    output: {
        path: __dirname,
        filename: "swipe.min.js"
    }
}