import react from "@vitejs/plugin-react";
import path from "path";
import {defineConfig, loadEnv} from "vite";
import istanbul from "vite-plugin-istanbul";

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      istanbul({
        include: "src/**/*",
        exclude: ["node_modules", "cypress/**", "coverage/**"],
        extension: [".js", ".jsx", ".ts", ".tsx"],
        requireEnv: false,
      }),
    ],
    define: {
      "process.env": env,
    },
    optimizeDeps: {
      entries: ["cypress/**/*", "src/**/*"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "build",
    },
    server: {
      watch: {
        ignored: ["!**/node_modules/**", "!**/coverage/**"],
      },
    },
  };
});
