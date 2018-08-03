const DtsBundleWebpack = require('dts-bundle-webpack')
module.exports = {
  entry: './src/queryBuilder.ts',
  output: {
    filename: 'index.js',
    libraryTarget: 'umd'
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },

  module: {
    rules: [
      { test: /\.tsx?$/, use: [{ loader: 'awesome-typescript-loader' }] },
      {
        enforce: 'pre',
        test: /\.js$/,
        use: [{ loader: 'source-map-loader' }],
        exclude: /(node_modules)/
      }
    ]
 
  },
  plugins: [
    new DtsBundleWebpack({
      name: 'QueryBuilder',
      main:  'dist/**/*.d.ts',
      out: 'index.d.ts',
      removeSource: true,
      outputAsModuleFolder: true,
    })
  ],
  optimization: {
    // We no not want to minimize our code.
    minimize: true
  }
};