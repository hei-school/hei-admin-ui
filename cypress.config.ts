import codeCoverageTask from "@cypress/code-coverage/task.js";
import {defineConfig} from "cypress";
import mergeReports from "cypress-sonarqube-reporter/mergeReports.js";
import vitePreprocessor from "cypress-vite";
import dotenv from "dotenv";

dotenv.config();

const REQUEST_TIMEOUT = 10000;

export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
  reporter: "cypress-sonarqube-reporter",
  reporterOptions: {
    overwrite: true,
    outputDir: "dist/test-reports",
    mergeFilename: "test-reports.xml",
  },
  e2e: {
    setupNodeEvents(on, config) {
      on("file:preprocessor", vitePreprocessor());
      codeCoverageTask(on, config);
      on("after:run", (results) => {
        mergeReports(results);
      });
      return config;

      // implement node event listeners here
    },
    baseUrl: "http://localhost:5173/",
    requestTimeout: REQUEST_TIMEOUT,
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
      exclude: ["cypress/**/*", "src/**/*.cy.*"],
    },
  },
});
