export const module = {
  rules: [
    {
      test: /\.js/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader'
        }
      ]
    }
  ]
}

export const stats = {
  colors: true
}
