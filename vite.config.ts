import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const baseApi = env.BASE_API ?? "http://localhost:3333";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.env.BASE_API": JSON.stringify(baseApi),
    },
    server: {
      port: Number(env.VITE_PORT) || 5173,
      host: false,
    },
  };
});
