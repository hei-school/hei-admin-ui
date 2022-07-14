import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    video: false,
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
      webpackConfig: require('./webpack.config')
    },
    viewportWidth: 500,
    viewportHeight: 844,
    defaultCommandTimeout: 10000,

    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      return config
    }
  }
})
