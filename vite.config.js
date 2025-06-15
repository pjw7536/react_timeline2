import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@features": path.resolve(__dirname, "src/features"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@layouts": path.resolve(__dirname, "src/layouts"),
      "@app": path.resolve(__dirname, "src/app"),
    },
  },

  server: {
    host: "0.0.0.0", // LAN 공유 필요 없으면 지워도 무방
    port: 5173, // 기본값 5173, 충돌 시 변경
  },

  // 선택) 환경변수 프리픽스 늘리기
  envPrefix: ["VITE_", "PUBLIC_"],

  // 선택) 빌드 출력 경로·크기 경고
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 800,
  },
});
