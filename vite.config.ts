import path from "path";
import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    define: {
      "process.env": env,
    },
    // /!\ vite randomly causes Cypress to fail with following err:
    //     Failed to fetch dynamically imported module: http://localhost:3000/__cypress/src/cypress/support/component.ts
    //     When Cypress detects uncaught errors originating from your test code it will automatically fail the current test.
    //     Cypress could not associate this error to any specific test.  We dynamically generated a new test to display this failure.
    // There is currently no official fix but This line is what stabilizes it better: https://github.com/cypress-io/cypress/issues/25913#issuecomment-1751222165
    optimizeDeps: {
      entries: ["cypress/**/*", "src/**/*"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
