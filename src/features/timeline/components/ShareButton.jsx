// src/features/timeline/components/ShareButton.jsx
import React, { useState } from "react";

export default function ShareButton() {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "EQP Timeline",
          text: "타임라인 링크를 공유합니다",
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error("URL 공유 실패:", err);
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        title="현재 페이지 URL 공유"
      >
        Share URL
      </button>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          URL이 클립보드에 복사되었습니다!
        </div>
      )}
    </>
  );
}
