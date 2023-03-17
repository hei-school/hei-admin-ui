const { startDevServer } = require('@cypress/webpack-dev-server')
const findReactScriptsWebpackConfig = require('@cypress/react/plugins/react-scripts/findReactScriptsWebpackConfig')

// https://github.com/cypress-io/code-coverage/issues/461
const customDevServer = (
  on,
  config,
  { webpackConfigPath } = {
    webpackConfigPath: 'react-scripts/config/webpack.config'
  }
) => {
  on('dev-server:start', async options => {
    const webpackConfig = findReactScriptsWebpackConfig(config, {
      webpackConfigPath
    })
    const rules = webpackConfig.module.rules.find(rule => !!rule.oneOf).oneOf
    const babelRule = rules.find(rule => /babel-loader/.test(rule.loader))
    babelRule.options.plugins.push(require.resolve('babel-plugin-istanbul'))
    return startDevServer({
      options,
      webpackConfig
    })
  })

  config.env.reactDevtools = true

  return config
}

module.exports = (on, config) => {
  customDevServer(on, config)
  require('@cypress/code-coverage/task')(on, config)
  on('after:run', results => {
    return require('cypress-sonarqube-reporter/mergeReports')(results)
  })

  return config
}
