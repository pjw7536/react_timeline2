import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Drawer({ isOpen, onClose, title, children }) {
  return (
    <>
      {/* 배경 오버레이 - 완전 투명 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      )}

      {/* 드로어 패널 - navbar 아래부터 시작 */}
      <div
        className={`fixed right-0 top-[125px] h-[calc(100vh-150px)] w-80 bg-white dark:bg-slate-800 shadow-xl z-40 rounded-l-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-4 overflow-y-auto h-[calc(100%-4rem)] scrollbar-thin">
          {children}
        </div>
      </div>
    </>
  );
}
