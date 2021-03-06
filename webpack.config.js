module.exports = {
    entry: './src/index.js',

    output: {
        path: __dirname + '/public/',
        filename: 'bundle.js'
    },

    devServer: {
        inline: true,
        port: 8080,
        contentBase: __dirname + '/public/',
        historyApiFallback: true
    },

    module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        cacheDirectory: true,
                        presets: ['es2016', 'react']
                    }
                },
                {
                    test: /\.less$/,
                    loader: 'style-loader!css-loader!less-loader',
                }
            ]
        }
};
