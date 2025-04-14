import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    fileParallelism: false,
    globals: true,
    include: ["src/http/routes/**/*.spec.ts"],
    setupFiles: ["./test/setup-e2e.ts"],
    env: {
      NODE_ENV: "test",
      JWT_SECRET: "test-secret",
      OPENAI_API_KEY: "test-openai-key",
      SMTP_USER: "test@example.com",
      SMTP_PASSWORD: "test-password",
      DATABASE_URL: "postgresql://docker:docker@localhost:5432/db-arena-park?schema=public",
      WEB_ORIGIN: "http://localhost:5173",
      PORT: "3333",
    },
  },
});
