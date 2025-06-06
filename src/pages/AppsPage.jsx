import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Globe,
  Star,
  Filter,
  FileText,
  Shield,
  Database,
  BarChart,
} from "lucide-react";

// 회사 내부 앱/웹사이트 데이터
const appsData = [
  {
    id: 1,
    name: "ERP System",
    category: "업무시스템",
    rating: 4.2,
    users: "전체 직원",
    icon: "📊",
    description: "전사 자원 관리 시스템. 재무, 인사, 구매 등 통합 관리",
    screenshots: [],
    price: "무료",
    webUrl: "https://erp.company.local",
    downloadUrl: "/downloads/apps/ERP_Setup_v3.2.1.exe",
    lastUpdated: "2025-01-15",
    size: "156 MB",
    version: "3.2.1",
  },
  {
    id: 2,
    name: "HR Portal",
    category: "인사관리",
    rating: 4.5,
    users: "전체 직원",
    icon: "👥",
    description: "급여명세서, 휴가신청, 증명서 발급 등 인사 업무 처리",
    price: "무료",
    webUrl: "https://hr.company.local",
    downloadUrl: null,
    lastUpdated: "2025-01-20",
    isWebOnly: true,
  },
  {
    id: 3,
    name: "VPN Client",
    category: "보안도구",
    rating: 4.0,
    users: "재택근무자",
    icon: "🔒",
    description: "안전한 원격 접속을 위한 회사 VPN 클라이언트",
    price: "무료",
    webUrl: null,
    downloadUrl: "/downloads/apps/CompanyVPN_v2.1.0.exe",
    lastUpdated: "2025-01-10",
    size: "45 MB",
    version: "2.1.0",
    requirements: "Windows 10 이상",
  },
  {
    id: 4,
    name: "품질관리 시스템",
    category: "생산관리",
    rating: 4.3,
    users: "생산팀, 품질팀",
    icon: "✅",
    description: "제품 품질 검사 데이터 입력 및 분석 시스템",
    price: "무료",
    webUrl: "https://qms.company.local",
    downloadUrl: "/downloads/apps/QMS_Client_v1.5.2.exe",
    lastUpdated: "2025-01-18",
    size: "89 MB",
    version: "1.5.2",
  },
  {
    id: 5,
    name: "메신저 Plus",
    category: "커뮤니케이션",
    rating: 4.6,
    users: "전체 직원",
    icon: "💬",
    description: "사내 메신저. 파일 공유, 화상회의 기능 포함",
    price: "무료",
    webUrl: null,
    downloadUrl: "/downloads/apps/MessengerPlus_v4.0.1.exe",
    lastUpdated: "2025-01-22",
    size: "120 MB",
    version: "4.0.1",
  },
  {
    id: 6,
    name: "문서보안 솔루션",
    category: "보안도구",
    rating: 3.8,
    users: "전체 직원",
    icon: "🛡️",
    description: "기밀문서 암호화 및 권한 관리 프로그램",
    price: "무료",
    webUrl: null,
    downloadUrl: "/downloads/apps/DocSecurity_v2.3.0.exe",
    lastUpdated: "2025-01-12",
    size: "67 MB",
    version: "2.3.0",
    requirements: "Windows 10 이상, 관리자 권한 필요",
  },
  {
    id: 7,
    name: "재고관리 시스템",
    category: "생산관리",
    rating: 4.1,
    users: "물류팀, 구매팀",
    icon: "📦",
    description: "실시간 재고 현황 조회 및 입출고 관리",
    price: "무료",
    webUrl: "https://inventory.company.local",
    lastUpdated: "2025-01-19",
    isWebOnly: true,
  },
  {
    id: 8,
    name: "업무일지 작성기",
    category: "업무시스템",
    rating: 4.4,
    users: "전체 직원",
    icon: "📝",
    description: "일일 업무 보고서 작성 및 관리 도구",
    price: "무료",
    webUrl: "https://report.company.local",
    downloadUrl: "/downloads/apps/WorkReport_v1.2.0.exe",
    lastUpdated: "2025-01-21",
    size: "32 MB",
    version: "1.2.0",
  },
];

const categories = [
  "전체",
  "업무시스템",
  "인사관리",
  "생산관리",
  "보안도구",
  "커뮤니케이션",
];

// 앱 카드 컴포넌트
function AppCard({ app, onClick }) {
  const handleWebClick = (e) => {
    e.stopPropagation();
    if (app.webUrl) {
      window.open(app.webUrl, "_blank");
    }
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const downloadLink = app.downloadUrl;

    if (downloadLink) {
      if (
        window.confirm(
          `${app.name} ${
            app.version || ""
          }을(를) 다운로드하시겠습니까?\n\n파일 크기: ${
            app.size || "알 수 없음"
          }`
        )
      ) {
        window.location.href = downloadLink;
      }
    } else if (app.isWebOnly) {
      alert("이 서비스는 웹에서만 이용 가능합니다.");
    }
  };

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow hover:shadow-lg transition-all 
      duration-300 cursor-pointer border border-slate-200 dark:border-slate-700 flex flex-col w-59 h-60 overflow-hidden relative"
      onClick={() => onClick(app)}
    >
      {/* 카테고리 - 왼쪽 상단 */}
      <div className="absolute top-2 left-2">
        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 text-xs">
          {app.category}
        </span>
      </div>

      {/* 버전 - 오른쪽 상단 */}
      {app.version && (
        <div className="absolute top-2 right-2">
          <span className="text-slate-500 dark:text-slate-400 text-xs">
            v{app.version}
          </span>
        </div>
      )}

      <div className="flex flex-col items-center text-center flex-grow overflow-hidden pt-6">
        <div className="text-3xl mb-2">{app.icon}</div>
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1 truncate w-full">
          {app.name}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 px-1 mt-3">
          {app.description}
        </p>
      </div>

      {/* 버튼 영역 - 항상 하단에 고정 */}
      <div className="flex gap-1 mt-2">
        {app.webUrl && (
          <button
            onClick={handleWebClick}
            className="flex-1 flex items-center justify-center gap-0.5 px-1 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
          >
            <Globe className="w-3 h-5" />
            <span className="truncate">웹</span>
          </button>
        )}
        {app.downloadUrl && (
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-0.5 px-1 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
          >
            <Download className="w-3 h-5" />
            <span className="truncate">설치</span>
          </button>
        )}
        {app.isWebOnly && !app.webUrl && (
          <span className="flex-1 text-center px-1 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs">
            웹 전용
          </span>
        )}
      </div>
    </div>
  );
}

// 앱 상세 모달
function AppDetailModal({ app, onClose }) {
  if (!app) return null;

  const handleDownload = () => {
    const downloadLink = app.downloadUrl;
    if (downloadLink) {
      if (
        window.confirm(
          `${app.name} ${
            app.version || ""
          }을(를) 다운로드하시겠습니까?\n\n파일 크기: ${
            app.size || "알 수 없음"
          }`
        )
      ) {
        window.location.href = downloadLink;
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4">
              <div className="text-6xl">{app.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {app.name}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {app.category}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{app.rating}</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400">•</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    사용 대상: {app.users}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                설명
              </h3>
              <p className="text-slate-700 dark:text-slate-300">
                {app.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  버전
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {app.version || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  파일 크기
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {app.size || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  최종 업데이트
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {app.lastUpdated}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  사용 대상
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {app.users}
                </p>
              </div>
            </div>

            {app.requirements && (
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  시스템 요구사항
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {app.requirements}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                접속/다운로드
              </h3>

              {app.webUrl && (
                <button
                  onClick={() => window.open(app.webUrl, "_blank")}
                  className="w-full flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-left"
                >
                  <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      웹 버전 접속
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {app.webUrl}
                    </div>
                  </div>
                </button>
              )}

              {app.downloadUrl && (
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors text-left"
                >
                  <div className="w-6 h-6 text-blue-600">💻</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">
                      Windows 버전
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {app.downloadUrl}
                    </div>
                  </div>
                </button>
              )}

              {app.isWebOnly && (
                <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    이 서비스는 웹 브라우저를 통해서만 이용 가능합니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 메인 앱스토어 컴포넌트
export default function AppsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedApp, setSelectedApp] = useState(null);

  // 필터링된 앱 목록
  const filteredApps = useMemo(() => {
    let apps = appsData.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "전체" || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    return apps;
  }, [searchTerm, selectedCategory]);

  return (
    <div className="flex flex-row h-[calc(100vh-110px)] gap-2 mt-3">
      {/* 왼쪽: 필터 섹션 */}
      <div className="flex flex-col h-full min-h-0 w-[20%] gap-2">
        {/* 안내 메시지 섹션 */}
        <section className="bg-white dark:bg-slate-800 shadow rounded-xl p-3 min-h-0 overflow-auto flex-[1]">
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">보안 안내</p>
                  <p className="text-xs">
                    모든 사내 프로그램은 승인된 기기에서만 설치 가능합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* 검색 및 필터 섹션 */}
        <section className="bg-white dark:bg-slate-800 shadow rounded-xl p-3 flex flex-col flex-[8]">
          <h2 className="text-md font-bold text-slate-900 dark:text-white mb-3">
            🔍 앱 검색
          </h2>

          {/* 검색창 */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="시스템 이름으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <hr className="my-2 border-slate-300 dark:border-slate-600" />

          {/* 카테고리 필터 */}
          <div className="mt-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              카테고리
            </h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* 오른쪽: 앱 목록 */}
      <div className="w-[80%] h-full overflow-hidden bg-white dark:bg-slate-800 shadow rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md font-bold text-slate-900 dark:text-white">
            💼 사내 시스템 & 도구
          </h2>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            Total: {filteredApps.length}
          </span>
        </div>
        <hr className="mb-4 border-slate-300 dark:border-slate-600" />

        {filteredApps.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-slate-600 dark:text-slate-400">
              검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 items-start content-start overflow-y-auto h-[calc(100%-60px)]">
            {filteredApps.map((app) => (
              <AppCard key={app.id} app={app} onClick={setSelectedApp} />
            ))}
          </div>
        )}
      </div>

      {/* 앱 상세 모달 */}
      {selectedApp && (
        <AppDetailModal
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}
    </div>
  );
}
