import {defineConfig} from "cypress";
import dotenv from "dotenv";

dotenv.config();

const REQUEST_TIMEOUT = 10000;

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:5173/#",
    requestTimeout: REQUEST_TIMEOUT,
  },
  env: {
    REACT_APP_TEST_STUDENT1_PASSWORD:
      process.env.REACT_APP_TEST_STUDENT1_PASSWORD!,
    REACT_APP_TEST_TEACHER1_PASSWORD:
      process.env.REACT_APP_TEST_TEACHER1_PASSWORD!,
    REACT_APP_TEST_MANAGER1_PASSWORD:
      process.env.REACT_APP_TEST_MANAGER1_PASSWORD!,
  },
});
