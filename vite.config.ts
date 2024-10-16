import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Polyfill buffer
      buffer: "buffer",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Enable esbuild polyfills for Node.js globals and modules
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  build: {
    target: "esnext",
    assetsDir: "assets",
    modulePreload: {
      polyfill: false,
    },
  },
});
