import react from "@vitejs/plugin-react";
import path from "path";
import {defineConfig, loadEnv} from "vite";
import istanbul from "vite-plugin-istanbul";
import {nodePolyfills} from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      nodePolyfills({include: ["crypto", "os", "path", "stream", "vm"]}),
      istanbul({
        requireEnv: false,
        cypress: true,
        include: "src/*",
        exclude: ["node_modules", "cypress", "src/**/*.cy.*"],
        extension: [".js", ".jsx", ".ts", ".tsx"],
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
      sourcemap: true,
      rollupOptions: {
        output: {
          sourcemap: false,
        },
      },
    },
    server: {
      watch: {
        ignored: ["**/coverage/**"],
      },
    },
  };
});
