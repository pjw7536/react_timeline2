import React from "react";

/**
 * 재사용 가능한 에러 메시지 컴포넌트
 * @param {Object} props
 * @param {Error|string} props.error - 에러 객체 또는 에러 메시지
 * @param {Function} props.onRetry - 재시도 함수 (선택적)
 * @param {string} props.title - 에러 제목 (선택적)
 */
export default function ErrorMessage({
  error,
  onRetry,
  title = "오류가 발생했습니다",
}) {
  const errorMessage =
    error?.message || error || "알 수 없는 오류가 발생했습니다.";

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
        {title}
      </h3>
      <p className="text-red-600 dark:text-red-400 text-center mb-4 max-w-md">
        {errorMessage}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
