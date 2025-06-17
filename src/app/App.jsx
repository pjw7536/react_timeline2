import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "@layouts/MainLayout/Navbar";
import { LoadingSpinner } from "@shared/components";
import { AutoLoginGate, LoginSuccess, ProtectedRoute } from "@features/auth";

const TimelinePage = lazy(() =>
  import("@features/timeline/pages/TimelinePage")
);
const AppStorePage = lazy(() =>
  import("@features/appstore/pages/AppStorePage")
);

const HomePage = () => (
  <div className="p-6 text-center">
    <h1 className="text-2xl font-bold">홈페이지 🎉</h1>
  </div>
);

export default function App() {
  return (
    <Routes>
      {/* 로그인 성공 처리 라우트 */}
      <Route path="/login-success" element={<LoginSuccess />} />

      {/* 메인 앱 라우트 */}
      <Route
        path="/*"
        element={
          <AutoLoginGate>
            <div className="h-screen flex flex-col overflow-hidden">
              <Navbar />
              <div className="flex-1 overflow-hidden px-4">
                <Routes>
                  <Route path="/" element={<HomePage />} />

                  {/* Timeline 페이지는 보호된 라우트 */}
                  <Route
                    path="/timeline"
                    element={
                      <ProtectedRoute>
                        <Suspense
                          fallback={
                            <div className="flex items-center justify-center h-[80vh]">
                              <LoadingSpinner />
                            </div>
                          }
                        >
                          <TimelinePage />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/timeline/:lineId/:eqpId"
                    element={
                      <ProtectedRoute>
                        <Suspense
                          fallback={
                            <div className="flex items-center justify-center h-[80vh]">
                              <LoadingSpinner />
                            </div>
                          }
                        >
                          <TimelinePage />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />

                  {/* App Store 페이지도 보호된 라우트 */}
                  <Route
                    path="/appstore"
                    element={
                      <ProtectedRoute>
                        <Suspense
                          fallback={
                            <div className="flex items-center justify-center h-[80vh]">
                              <LoadingSpinner />
                            </div>
                          }
                        >
                          <AppStorePage />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </div>
          </AutoLoginGate>
        }
      />
    </Routes>
  );
}
