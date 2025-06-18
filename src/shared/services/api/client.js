// src/shared/services/api/client.js
const DEFAULT_TIMEOUT = 10000;
const MAX_RETRIES = 3;

/**
 * 개선된 API 클라이언트 (쿠키 기반 인증)
 */
export const apiClient = async (
  url,
  { params, timeout = DEFAULT_TIMEOUT, retries = MAX_RETRIES, ...opts } = {}
) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  if (!baseUrl) {
    throw new Error(
      "API_BASE_URL이 설정되지 않았습니다. 환경변수를 확인해주세요."
    );
  }

  const qs = params ? "?" + new URLSearchParams(params) : "";
  const fullUrl = baseUrl + url + qs;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const executeRequest = async (attempt = 1) => {
    try {
      const response = await fetch(fullUrl, {
        headers: {
          "Content-Type": "application/json",
          ...opts.headers,
        },
        // 쿠키를 포함하여 요청
        credentials: "include",
        signal: controller.signal,
        ...opts,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;

        switch (response.status) {
          case 400:
            errorMessage = "잘못된 요청입니다.";
            break;
          case 401:
            errorMessage = "인증이 필요합니다.";
            // 401 에러시 SSO 로그인 페이지로 리다이렉트
            const currentUrl = window.location.href;
            const ssoUrl = `${baseUrl}/sso?target=${encodeURIComponent(
              currentUrl
            )}`;
            window.location.href = ssoUrl;
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

      if (error.name === "AbortError") {
        throw new Error(`요청 시간이 초과되었습니다. (${timeout}ms)`);
      }

      if (attempt < retries && isRetryableError(error)) {
        console.warn(
          `API 요청 실패 (${attempt}/${retries}): ${error.message}. 재시도 중...`
        );
        await delay(Math.pow(2, attempt) * 1000);
        return executeRequest(attempt + 1);
      }

      throw error;
    }
  };

  return executeRequest();
};

function isRetryableError(error) {
  if (error.status === 401) return false;
  return (
    !error.status ||
    error.status >= 500 ||
    error.status === 408 ||
    error.status === 429
  );
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
