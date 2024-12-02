import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { analyzer } from "vite-bundle-analyzer";

export default defineConfig({
  plugins: [vue() /* , analyzer() */],
  build: {
    lib: {
      formats: ["es"],
      entry: ["./src/main.ts", "./src/plugins/tailwind.ts"],
    },
    target: "esnext",
    rollupOptions: {
      external: ["vue"],
      output: {
        manualChunks: {
          hls: ["hls.js/dist/hls.light.min.js"],
          atProto: ["@atproto/api/src/index"],
        },
      },
    },
    cssCodeSplit: false,
  },
});
