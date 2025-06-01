import { env } from "./src/env";
import path from "path";

import "dotenv/config";

import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    env: env.server,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
