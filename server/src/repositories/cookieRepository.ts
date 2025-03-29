import { Response } from 'express';

class CookieRepository {
  private getCookieOptions(extraOptions = {}) {
    return {
      httpOnly: true,
      path: '/sessions',
      secure: true,
      ...extraOptions,
    };
  }

  setCookie(res: Response, tokenName: string, token: string) {
    res.cookie(tokenName, token, this.getCookieOptions());
  }

  clearCookies(res: Response, tokenName: string) {
    res.cookie(tokenName, '', this.getCookieOptions({ maxAge: 0 }));
  }
}

export default new CookieRepository();
