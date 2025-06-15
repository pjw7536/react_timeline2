// src/app/App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "@layouts/MainLayout/Navbar";
import { LoadingSpinner } from "@shared/components";

const TimelinePage = lazy(() =>
  import("@features/timeline/pages/TimelinePage")
);
const AppStorePage = lazy(() =>
  import("@features/appstore/pages/AppStorePage")
);

const HomePage = () => (
  <div className="p-6 text-center">
    <h1 className="text-2xl font-bold">홈페이지 🎉</h1>
    {/* ... */}
  </div>
);

export default function App() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-hidden px-4">
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
          <Route path="/appstore" element={<AppStorePage />} />
        </Routes>
      </div>
    </div>
  );
}
