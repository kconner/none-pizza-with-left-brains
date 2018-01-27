var WriteFilePlugin = require('write-file-webpack-plugin');

var path = require('path');

module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist/static",
        publicPath: '/static/'
    },
    plugins: [
        new WriteFilePlugin()
    ],
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' as resolvable extensions.
        extensions: [".ts", ".js", ".json"],
        alias: {
            pixi: path.join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
            phaser: path.join(__dirname, 'node_modules/phaser-ce/build/custom/phaser-split.js'),
            p2: path.join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js'),
            beepbox: 'https://www.beepbox.co/beexbox_synth.js',
            assets: path.join(__dirname, 'assets/')
        }
    },

    devServer: {
        contentBase: 'dist',
        compress: true,
        port: 9000,
        inline: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: true,
            ignored: /node_modules/
        }
    },

    module: {
        rules: [
            // All files with a '.ts' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.ts$/, loader: "awesome-typescript-loader" },

            // From https://github.com/rroylance/phaser-npm-webpack-typescript-starter-project/blob/master/webpack.dist.config.js
            { test: /assets(\/|\\)/, loader: 'file-loader?name=assets/[hash].[ext]' },
            { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
            { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
            { test: /p2\.js$/, loader: 'expose-loader?p2' },
            { test: /beepbox\.js$/, loader: 'expose-loader?beepbox' },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            // { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
        ]
    },
    watch: true,


    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "beepbox": "beepbox",
    },
};