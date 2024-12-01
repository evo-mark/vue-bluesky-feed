import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 3000,
    },
    build: {
        lib: {
            formats: ["es"],
            entry: ["./src/main.ts", "./src/plugins/tailwind.ts"],
        },
        target: "esnext",
        rollupOptions: {
            external: ["vue"],
        },
        cssCodeSplit: false,
    },
});
