import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack'
    },
    viewportWidth: 500,
    viewportHeight: 844,
    defaultCommandTimeout: 10000,
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'cypress-sonarqube-reporter',
      mergeFileName: 'test-reports.xml',
      cypressSonarqubeReporterReporterOptions: {
        overwrite: true
      }
    },

    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)
      on('after:run', results => {
        return require('cypress-sonarqube-reporter/mergeReports')(results)
      })
      return config
    }
  }
})
