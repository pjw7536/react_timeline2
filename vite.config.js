import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // ✅ v4용 Vite 플러그인
import path from "node:path";

export default defineConfig({
  plugins: [
    react({
      // 선택) React Fast-Refresh & props-on-export 경고 제어 등
    }),
    tailwindcss(), // ← PostCSS도 자동 연결
  ],

  resolve: {
    // '@/foo' → 'src/foo'
    alias: { "@": path.resolve(__dirname, "src") },
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
