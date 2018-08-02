module.exports = {
  entry: './src/queryBuilder.ts',
  output: {
    filename: 'index.js'
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },

  module: {
    rules: [
      { test: /\.tsx?$/, use: [{ loader: 'awesome-typescript-loader' }],  exclude: /(node_modules)/, },
      { enforce: 'pre', test: /\.js$/, use: [{ loader: 'source-map-loader' }], exclude: /(node_modules)/ }
    ]
  }
};
