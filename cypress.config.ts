import codeCoverageTask from "@cypress/code-coverage/task.js";
import {defineConfig} from "cypress";
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
  reporter: "cypress-sonarqube-reporter",
  reporterOptions: {
    overwrite: true,
    outputDir: "dist/test-reports",
    mergeFileName: "test-reports.xml",
  },
  e2e: {
    setupNodeEvents(on, config) {
      on("file:preprocessor", vitePreprocessor());
      codeCoverageTask(on, config);
      return config;
    },
    baseUrl: "http://localhost:5173/",
    specPattern: "cypress/e2e/**/*",
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
    REACT_APP_TEST_ADMIN1_PASSWORD: process.env.REACT_APP_TEST_ADMIN1_PASSWORD,
    REACT_APP_TEST_STAFF1_PASSWORD: process.env.REACT_APP_TEST_STAFF1_PASSWORD,
    REACT_APP_TEST_ORGANIZER1_PASSWORD:
      process.env.REACT_APP_TEST_ORGANIZER1_PASSWORD,
    codeCoverage: {
      exclude: ["cypress/**/*.*", "src/**/*.cy", "src/providers/**/*.*"],
    },
  },
});
