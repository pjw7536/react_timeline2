import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@features/auth/contexts/AuthContext";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  PhoneIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";

import owlImageLight from "@assets/owl_lightmode.png";
import owlImageDark from "@assets/owl_darkmode.png";

// "Product" 드롭다운에 사용될 예시 데이터
const products = [
  {
    name: "Analytics",
    description: "트래픽 분석",
    href: "#",
    icon: ChartPieIcon,
  },
  {
    name: "Engagement",
    description: "고객 소통",
    href: "#",
    icon: CursorArrowRaysIcon,
  },
  {
    name: "Security",
    description: "데이터 보안",
    href: "#",
    icon: FingerPrintIcon,
  },
  {
    name: "Integrations",
    description: "외부 연동",
    href: "#",
    icon: SquaresPlusIcon,
  },
  {
    name: "Automations",
    description: "자동화",
    href: "#",
    icon: ArrowPathIcon,
  },
];
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

export default function Navbar() {
  // 모바일 메뉴와 다크모드 상태를 관리
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // 컴포넌트가 처음 마운트될 때, localStorage나 OS 기본 테마를 기준으로 다크모드 설정을 결정
  useEffect(() => {
    const isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // 다크모드 토글 (버튼 클릭 시 실행)
  const toggleDarkMode = () => {
    // Tailwind 공식 권장 방식: classList.toggle 로 결과값을 그대로 사용
    const isDark = document.documentElement.classList.toggle("dark");
    setDarkMode(isDark);

    // 사용자가 '라이트' 모드를 선택한 경우 key 자체를 지워 두면
    // 다음 방문 시 OS 선호도(prefers-color-scheme)가 다시 적용됩니다.
    if (isDark) {
      localStorage.theme = "dark";
    } else {
      localStorage.removeItem("theme");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 h-15">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between py-5 px-10 lg:px-2 h-15"
      >
        {/* 로고: 메인 페이지로 이동 */}
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img
              alt="Company Logo"
              src={darkMode ? owlImageDark : owlImageLight}
              className="h-15 w-auto"
            />
          </Link>
        </div>
        {/* 모바일 메뉴 버튼 (작은 화면에서만 보임) */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-300"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        {/* 데스크탑 메뉴: Product, Timeline 등 네비게이션 */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-xs/6 font-semibold text-gray-900 dark:text-gray-100 focus:outline-none">
              Product
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 flex-none text-gray-400 dark:text-gray-500"
              />
            </PopoverButton>
            {/* Product 드롭다운 패널 */}
            <PopoverPanel
              transition
              className="absolute top-full -left-8 z-20 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/10 transition"
            >
              <div className="p-4">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-xs/6 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600">
                      <item.icon
                        aria-hidden="true"
                        className="size-6 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                      />
                    </div>
                    <div className="flex-auto">
                      <a
                        href={item.href}
                        className="block font-semibold text-gray-900 dark:text-gray-100"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                      <p className="mt-1 text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* 하단 액션 버튼 */}
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 dark:divide-white/10 bg-gray-50 dark:bg-gray-700/50">
                {callsToAction.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-xs/6 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <item.icon
                      aria-hidden="true"
                      className="size-5 flex-none text-gray-400 dark:text-gray-500"
                    />
                    {item.name}
                  </a>
                ))}
              </div>
            </PopoverPanel>
          </Popover>
          {/* 타임라인 페이지로 이동하는 메뉴 */}
          <Link
            to="/timeline"
            className="text-xs/6 font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Timeline
          </Link>
          <Link
            to="/appstore"
            className="text-xs/6 font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            App Store
          </Link>
          <a
            href="#"
            className="text-xs/6 font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Company
          </a>
        </PopoverGroup>
        {/* 데스크탑: 다크모드 토글 + 사용자 정보 */}
        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-6">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <SunIcon className="size-5" />
            ) : (
              <MoonIcon className="size-5" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-x-4">
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {user?.username} ({user?.deptname})
              </span>
            </div>
          ) : (
            <Link
              to="/"
              className="text-xs/6 font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              로그인 <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </div>
      </nav>
      {/* 모바일 메뉴 다이얼로그: 작은 화면에서만 열림 */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-20" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6 sm:max-w-xs sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-white/10">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-300"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700">
              <div className="space-y-2 py-6">
                {/* Product 드롭다운 (모바일) */}
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700">
                    Product
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none text-gray-400 dark:text-gray-500 group-data-open:rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {[...products, ...callsToAction].map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                {/* 주요 메뉴들 */}
                <Link
                  to="/timeline"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Timeline
                </Link>
                <Link
                  to="/appstore"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  App Store
                </Link>
                <a
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Company
                </a>
              </div>
              <div className="py-6">
                {/* 다크모드 토글 (모바일) */}
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setMobileMenuOpen(false);
                  }}
                  className="-mx-3 flex items-center gap-x-2 w-full rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <SunIcon className="size-5 flex-none text-gray-400 dark:text-gray-500" />
                  ) : (
                    <MoonIcon className="size-5 flex-none text-gray-400 dark:text-gray-500" />
                  )}
                  {darkMode ? "라이트 모드" : "다크 모드"}
                </button>

                {/* 사용자 정보 또는 로그인 (모바일) */}
                {isAuthenticated ? (
                  <div className="-mx-3 space-y-2">
                    <div className="block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 dark:text-gray-100">
                      {user?.username} ({user?.deptname})
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    로그인
                  </Link>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
