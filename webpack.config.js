const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    entry: {
        pages: './src/pages.js',
        'block-visibility': './src/block-visibility.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build',
    },
};
