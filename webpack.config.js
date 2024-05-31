const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    entry: {
        pages: './src/pages.js',
        'block-options': './src/block-options.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build',
    },
};
