// src/features/auth/services/authService.js
import { apiClient } from "@shared/services/api/client";

export const authService = {
  // 현재 사용자 정보 가져오기
  async getCurrentUser() {
    try {
      const user = await apiClient("/me");
      return user;
    } catch (error) {
      if (error.status === 401) {
        return null;
      }
      throw error;
    }
  },

  // SSO 로그인 시작
  startSSOLogin(targetUrl = window.location.href) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const ssoUrl = `${baseUrl}/sso?target=${encodeURIComponent(targetUrl)}`;
    window.location.href = ssoUrl;
  },

  // 로그아웃
  async logout() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${baseUrl}/logout`;
  },
};
