import React from "react";

/**
 * 스켈레톤 로딩 컴포넌트
 * @param {Object} props
 * @param {number} props.rows - 행 개수 (기본: 5)
 * @param {string} props.variant - 변형 타입 ('table' | 'timeline' | 'card')
 */
export default function SkeletonLoader({ rows = 5, variant = "table" }) {
  const skeletonBase = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded";

  if (variant === "table") {
    return (
      <div className="space-y-3">
        {/* 테이블 헤더 */}
        <div className="grid grid-cols-5 gap-4 p-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`${skeletonBase} h-4`} />
          ))}
        </div>
        {/* 테이블 행들 */}
        {[...Array(rows)].map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-5 gap-4 p-3 border-b border-gray-200 dark:border-gray-600"
          >
            {[...Array(5)].map((_, colIndex) => (
              <div
                key={colIndex}
                className={`${skeletonBase} h-4`}
                style={{
                  animationDelay: `${(rowIndex * 5 + colIndex) * 50}ms`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (variant === "timeline") {
    return (
      <div className="space-y-6">
        {[...Array(2)].map((_, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            {/* 타임라인 제목 */}
            <div className={`${skeletonBase} h-6 w-48`} />
            {/* 타임라인 영역 */}
            <div className={`${skeletonBase} h-32 w-full`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="space-y-4">
        {[...Array(rows)].map((_, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-3"
          >
            <div className={`${skeletonBase} h-5 w-3/4`} />
            <div className={`${skeletonBase} h-4 w-full`} />
            <div className={`${skeletonBase} h-4 w-5/6`} />
          </div>
        ))}
      </div>
    );
  }

  // 기본 스켈레톤
  return (
    <div className="space-y-2">
      {[...Array(rows)].map((_, index) => (
        <div
          key={index}
          className={`${skeletonBase} h-4 w-full`}
          style={{ animationDelay: `${index * 100}ms` }}
        />
      ))}
    </div>
  );
}
