const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    entry: {
        pages: './src/pages.js',
        'block-editor-extensions': './src/block-editor-extensions.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/build',
    },
};
