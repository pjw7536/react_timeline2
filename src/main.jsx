// main.jsx: 리액트 애플리케이션의 진입점 파일입니다.
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "@/App";
import "@/index.css";

// React Query의 QueryClient 인스턴스 생성
const qc = new QueryClient();

// React 애플리케이션을 #root 엘리먼트에 마운트
createRoot(document.getElementById("root")).render(
  // StrictMode: 잠재적 문제를 감지하는 개발 모드용 래퍼
  <StrictMode>
    {/* QueryClientProvider: 전역에서 React Query 사용을 위한 Provider */}
    <QueryClientProvider client={qc}>
      {/* BrowserRouter: 라우팅을 위한 Provider */}
      <BrowserRouter>
        {/* 실제 앱 컴포넌트 */}
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
