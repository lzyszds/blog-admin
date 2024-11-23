// 创建一个 cookie 管理文件 utils/cookies.ts
import { useCookies } from "@vueuse/integrations/useCookies";

export const cookies = useCookies();

export const TokenService = {
  setToken(token: string) {
    cookies.set("lzytkn", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 2),
    });
  },

  getToken(): string | undefined {
    return cookies.get("lzytkn");
  },

  removeToken() {
    cookies.remove("lzytkn");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
