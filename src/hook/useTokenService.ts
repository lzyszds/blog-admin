// 创建一个 cookie 管理文件 utils/cookies.ts
import { useCookies } from "@vueuse/integrations/useCookies";

export const cookies = useCookies();

export const TokenService = {
  setToken(token: string, remember: boolean) {
    cookies.set("lzytkn", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * (remember ? 7 : 2)),
      domain: import.meta.env.VITE_COOKIE_DOMAIN,
    });
  },

  getToken(): string | undefined {
    return cookies.get("lzytkn");
  },

  removeToken() {
    cookies.remove("lzytkn", {
      domain: import.meta.env.VITE_COOKIE_DOMAIN,
    });
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
