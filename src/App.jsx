import React, { Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Navbar from "@/shared/Navbar";
import LoadingSpinner from "@/shared/LoadingSpinner";

const TimelinePage = lazy(() => import("@/pages/TimelinePage"));

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

export default function App() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden px-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
        </Routes>
      </div>
    </div>
  );
}
