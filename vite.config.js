import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

export default defineConfig({
	plugins: [vue(), dts()],
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
