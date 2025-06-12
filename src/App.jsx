// App.jsx: 애플리케이션의 루트 컴포넌트로, 라우팅 및 네비게이션 바를 관리합니다.
import React, { Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "@/shared/Navbar";
import LoadingSpinner from "@/shared/LoadingSpinner";

// 페이지 컴포넌트들을 lazy loading으로 동적 import
const TimelinePage = lazy(() => import("@/pages/TimelinePage"));
const AppsPage = lazy(() => import("@/pages/AppsPage"));

// 홈 화면 컴포넌트
const HomePage = () => (
  <div className="p-6 text-center">
    <h1 className="text-2xl font-bold">홈페이지 🎉</h1>
    <p>
      상단의{" "}
      <Link className="text-indigo-600" to="/timeline">
        Timeline
      </Link>{" "}
      메뉴를 눌러 EQP 로그를 확인하세요.
    </p>
  </div>
);

// 애플리케이션의 메인 컴포넌트
export default function App() {
  return (
    // 전체 화면을 차지하는 flex 레이아웃
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 상단 네비게이션 바 */}
      <Navbar />
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 overflow-hidden px-4">
        {/* 라우팅 설정 */}
        <Routes>
          {/* 홈 라우트 */}
          <Route path="/" element={<HomePage />} />
          {/* 타임라인 페이지 라우트 (lazy loading + Suspense로 로딩 스피너 제공) */}
          <Route
            path="/timeline"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-[80vh]">
                    <LoadingSpinner />
                  </div>
                }
              >
                <TimelinePage />
              </Suspense>
            }
          />
          {/* URL 파라미터를 통한 직접 접근 라우트 */}
          <Route
            path="/timeline/:lineId/:eqpId"
            element={
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-[80vh]">
                    <LoadingSpinner />
                  </div>
                }
              >
                <TimelinePage />
              </Suspense>
            }
          />
          {/* 앱스 페이지 라우트 */}
          <Route path="/apps" element={<AppsPage />} />
        </Routes>
      </div>
    </div>
  );
}
