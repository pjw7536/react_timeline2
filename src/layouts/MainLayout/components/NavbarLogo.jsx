// src/layouts/MainLayout/components/NavbarLogo.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import owlImageLight from "@assets/owl_lightmode.png";
import owlImageDark from "@assets/owl_darkmode.png";
import squirrelImageLight from "@assets/squirrel_lightmode.png";
import squirrelImageDark from "@assets/squirrel_darkmode.png";

import blackOpsFont from "@assets/fonts/BlackOpsOne/black-ops-one-v20-latin-regular.woff2";

export default function NavbarLogo({ darkMode }) {
  const location = useLocation();
  const [animationKey, setAnimationKey] = useState(0);

  // 메인 경로 추출 함수 (useEffect 밖에 정의)
  const getMainPath = (pathname) => {
    const parts = pathname.split("/");
    return "/" + (parts[1] || "");
  };

  // 실제 페이지 경로 변경 감지
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [getMainPath(location.pathname)]); // 메인 경로가 변경될 때만 실행

  // 페이지별 로고 설정
  const logoConfig = {
    "/timeline": {
      light: owlImageLight,
      dark: owlImageDark,
      alt: "Timeline Logo",
      className: "h-12 w-auto mt-1",
      text: "OBSERVER",
      textColor: "text-slate-800 dark:text-slate-200 mb-0.5 ml-1",
      fontClass: "font-blackops",
      textSize: "text-xl",
    },
    "/appstore": {
      light: squirrelImageLight,
      dark: squirrelImageDark,
      alt: "App Store Logo",
      className: "h-14 w-auto",
      text: "APP STORE",
      textColor: "text-slate-800 dark:text-slate-200 mb-1",
      fontClass: "font-blackops",
      textSize: "text-xl",
    },
    "/": {
      alt: "Home Logo",
      className: "h-20 w-auto",
      text: "HOME BASE",
      textColor: "text-gray-900 dark:text-gray-100",
      fontClass: "font-blackops",
      textSize: "text-4xl",
    },
  };

  const getLogoForPath = () => {
    if (logoConfig[location.pathname]) {
      return logoConfig[location.pathname];
    }

    for (const [path, config] of Object.entries(logoConfig)) {
      if (location.pathname.startsWith(path) && path !== "/") {
        return config;
      }
    }

    return logoConfig["/"] || null;
  };

  const currentLogo = getLogoForPath();

  if (!currentLogo || !currentLogo.light || !currentLogo.dark) {
    return (
      <div className="flex lg:flex-1">
        <Link to="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Your Company</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex lg:flex-1">
      <span className="sr-only">Your Company</span>
      <style>
        {`
            @font-face {
              font-family: 'Black Ops One';
              src: url(${blackOpsFont}) format('woff2');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            
            .font-blackops {
              font-family: 'Black Ops One', display !important;
            }
            
            @keyframes logoFadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            .logo-container {
              animation: logoFadeIn 2s ease-in-out;
            }
          `}
      </style>
      <div
        key={`logo-${animationKey}`}
        className="logo-container inline-flex items-end"
      >
        <img
          alt={currentLogo.alt}
          src={darkMode ? currentLogo.dark : currentLogo.light}
          className={currentLogo.className || "h-15 w-auto"}
        />
        {currentLogo.text && (
          <span
            className={`
                font-blackops
                ${currentLogo.textSize || "text-3xl"}
                ${currentLogo.textColor || "text-gray-900 dark:text-gray-100"}
                tracking-wider
                drop-shadow-[2px_2px_2px_rgba(0,0,0,0.3)]
                dark:drop-shadow-[2px_2px_2px_rgba(255,255,255,0.2)]
              `}
          >
            {currentLogo.text}
          </span>
        )}
      </div>
    </div>
  );
}
