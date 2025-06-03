export const apiClient = async (url, { params, ...opts } = {}) => {
  // ① 쿼리스트링 만들어 붙이고
  const qs = params ? "?" + new URLSearchParams(params) : "";
  // ② fetch 실행 (기본 JSON 헤더 셋팅)
  const res = await fetch(import.meta.env.VITE_API_BASE_URL + url + qs, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  // ③ 에러 땐 throw → react-query가 캐치
  if (!res.ok) throw new Error((await res.text()) || `API ${res.status}`);
  // ④ 항상 JSON 반환
  return res.json();
};
