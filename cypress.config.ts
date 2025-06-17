import codeCoverageTask from "@cypress/code-coverage/task.js";
import {defineConfig} from "cypress";
import mergeReports from "cypress-sonarqube-reporter/mergeReports.js";
import vitePreprocessor from "cypress-vite";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  defaultCommandTimeout: 25_000,
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    reporterEnabled: "spec, cypress-sonarqube-reporter",
    cypressSonarqubeReporterReporterOptions: {
      overwrite: true,
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
      on("file:preprocessor", vitePreprocessor());
      codeCoverageTask(on, config);
      on("after:run", (results) => {
        mergeReports(results, {
          outputDir: "dist/test-reports",
          mergeFileName: "cypress-sonarqube-reports.all.xml",
        });
      });
      return config;

      // implement node event listeners here
    },
    baseUrl: "http://localhost:5173/",
  },
  retries: {
    runMode: 4,
    openMode: 0,
  },
  env: {
    REACT_APP_TEST_STUDENT1_PASSWORD:
      process.env.REACT_APP_TEST_STUDENT1_PASSWORD,
    REACT_APP_TEST_TEACHER1_PASSWORD:
      process.env.REACT_APP_TEST_TEACHER1_PASSWORD,
    REACT_APP_TEST_MANAGER1_PASSWORD:
      process.env.REACT_APP_TEST_MANAGER1_PASSWORD,
    REACT_APP_TEST_MONITOR1_PASSWORD:
      process.env.REACT_APP_TEST_MONITOR1_PASSWORD,
    codeCoverage: {
      exclude: ["cypress/**/*.*", "src/**/*.cy"],
    },
  },
});
