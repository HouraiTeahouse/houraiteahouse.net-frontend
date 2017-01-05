// Environment Variables
const PRODUCTION_MODE = (process.env.NODE_ENV === 'production');
const TEST_MODE = (process.env.NODE_ENV === 'test');
const DEVELOPMENT_MODE = (!PRODUCTION_MODE && !TEST_MODE);

// Imports
let path = require('path');
let webpack = require('webpack');

// Webpack Entry Path
const ENTRY_DIR = 'src', ENTRY_BASENAME = 'main';

// Webpack Base Config
const WEBPACK_CONFIG = {
    resolve: {
        root: __dirname + path.sep + ENTRY_DIR,
        modulesDirectories: ['node_modules']
    },
    module: {
        preLoaders: [
            { test: /\.js$/, loader: 'eslint-loader', include: new RegExp(ENTRY_DIR), exclude: /node_modules/ }
        ],
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', include: new RegExp(ENTRY_DIR), exclude: /node_modules/ }
        ],
        postLoaders: []
    },
    target: 'web',
    plugins: []
};

// Customize Webpack Config
if (TEST_MODE) {
    WEBPACK_CONFIG.devtool = 'inline-source-map';
}

if (!TEST_MODE) {
    const OUTPUT_DIR = PRODUCTION_MODE ? 'dist' : 'dist',
        OUTPUT_BASENAME = 'main';

    WEBPACK_CONFIG.entry = {
        polyfills: [
            'core-js/es6',
            'babel-regenerator-runtime/runtime'
        ],
        [OUTPUT_BASENAME]: `./${ENTRY_DIR}/${ENTRY_BASENAME}.js`
    };

    WEBPACK_CONFIG.output = {
        path: __dirname + path.sep + '..' + path.sep + OUTPUT_DIR,
        filename: '[name].js'
    };
}

if (DEVELOPMENT_MODE) {
    WEBPACK_CONFIG.output.sourceMapFilename = '[file].map';
    WEBPACK_CONFIG.output.devtoolModuleFilenameTemplate = '[resource-path]';
    WEBPACK_CONFIG.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: 'polyfills',
            filename: 'polyfills.js',
            minChunks: Infinity
        })
    );
    WEBPACK_CONFIG.devtool = 'source-map';
}

if (PRODUCTION_MODE) {
    WEBPACK_CONFIG.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: 'polyfills',
            filename: 'polyfills.js',
            minChunks: Infinity
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false
        })
    );
}

// Export Webpack Config
module.exports = WEBPACK_CONFIG;
