import React from "react";
import { Routes, Route } from "react-router-dom";
import { TimelinePage } from "@features/timeline";
import { AppStorePage } from "@features/appstore";

const HomePage = () => (
  <div className="p-6 text-center">
    <h1 className="text-2xl font-bold">홈페이지 🎉</h1>
    {/* ... */}
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/timeline" element={<TimelinePage />} />
      <Route path="/timeline/:lineId/:eqpId" element={<TimelinePage />} />
      <Route path="/appstore" element={<AppStorePage />} />
    </Routes>
  );
}
