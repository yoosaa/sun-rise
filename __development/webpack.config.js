const path = require('path');

module.exports = {
  mode: 'production',
  // エントリーポイント
  entry: './_js/app.js',
  // 出力
  output: {
    // ファイル名
    filename: 'js/app.js',
    // 出力先
    path: path.join(__dirname, '../')
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',   //loader名
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: 3,
                },
              ],
            ],
          }
        }
      }
    ]
  }
};