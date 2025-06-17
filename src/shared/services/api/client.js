const DEFAULT_TIMEOUT = 10000; // 10초
const MAX_RETRIES = 3;

/**
 * 개선된 API 클라이언트
 * @param {string} url - API 엔드포인트
 * @param {Object} options - 요청 옵션
 * @param {number} options.timeout - 타임아웃 (ms)
 * @param {number} options.retries - 재시도 횟수
 * @param {Object} options.params - 쿼리 파라미터
 */
export const apiClient = async (
  url,
  { params, timeout = DEFAULT_TIMEOUT, retries = MAX_RETRIES, ...opts } = {}
) => {
  // 기본 URL 유효성 검사
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "API_BASE_URL이 설정되지 않았습니다. 환경변수를 확인해주세요."
    );
  }

  // 쿼리스트링 생성
  const qs = params ? "?" + new URLSearchParams(params) : "";
  const fullUrl = baseUrl + url + qs;

  // JWT 토큰 가져오기
  const token = localStorage.getItem("jwt");

  // AbortController로 타임아웃 처리
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const executeRequest = async (attempt = 1) => {
    try {
      const response = await fetch(fullUrl, {
        headers: {
          "Content-Type": "application/json",
          // JWT 토큰이 있으면 Authorization 헤더에 추가
          ...(token && { Authorization: `Bearer ${token}` }),
          ...opts.headers,
        },
        signal: controller.signal,
        ...opts,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;

        // HTTP 상태 코드별 메시지
        switch (response.status) {
          case 400:
            errorMessage = "잘못된 요청입니다.";
            break;
          case 401:
            errorMessage = "인증이 필요합니다.";
            // 401 에러시 토큰 삭제하고 로그인 페이지로
            localStorage.removeItem("jwt");
            window.location.href = "/";
            break;
          case 403:
            errorMessage = "접근 권한이 없습니다.";
            break;
          case 404:
            errorMessage = "요청한 데이터를 찾을 수 없습니다.";
            break;
          case 500:
            errorMessage = "서버 오류가 발생했습니다.";
            break;
          case 503:
            errorMessage = "서비스를 일시적으로 사용할 수 없습니다.";
            break;
          default:
            errorMessage = errorText || `HTTP ${response.status} 오류`;
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        error.url = fullUrl;
        throw error;
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      // 타임아웃 에러 처리
      if (error.name === "AbortError") {
        throw new Error(`요청 시간이 초과되었습니다. (${timeout}ms)`);
      }

      // 네트워크 에러이고 재시도 가능한 경우
      if (attempt < retries && isRetryableError(error)) {
        console.warn(
          `API 요청 실패 (${attempt}/${retries}): ${error.message}. 재시도 중...`
        );
        await delay(Math.pow(2, attempt) * 1000); // 지수 백오프
        return executeRequest(attempt + 1);
      }

      // 마지막 에러는 그대로 throw
      throw error;
    }
  };

  return executeRequest();
};

/**
 * 재시도 가능한 에러인지 확인
 */
function isRetryableError(error) {
  // 401은 재시도하지 않음
  if (error.status === 401) return false;

  // 네트워크 에러나 5xx 서버 에러는 재시도 가능
  return (
    !error.status || // 네트워크 에러
    error.status >= 500 || // 서버 에러
    error.status === 408 || // Request Timeout
    error.status === 429 // Too Many Requests
  );
}

/**
 * 지연 함수
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
