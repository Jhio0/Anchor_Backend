import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";
import path, { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    globals: false,
    environment: "node",

    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", "build", "dist"],

    setupFiles: [],

    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "src/test/", "build/", "dist/"],
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
