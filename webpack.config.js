const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'omniframe.min.js',
    library: 'omniframe',
    libraryTarget: 'umd'
  }
};