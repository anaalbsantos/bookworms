import { Request, Response, NextFunction } from 'express';
import {
  CookieRepository,
  UserRepository,
  TokenRepository,
} from '../repositories';

class LoginController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { emailORusername, password } = req.body;

      const user = await UserRepository.findByUsernameOrEmail(emailORusername);

      if (!user) {
        return next({
          message: 'Credenciais inválidas',
          status: 404,
        });
      }

      // eslint-disable-next-line security/detect-possible-timing-attacks
      if (user.password !== password) {
        return next({
          message: 'Credenciais inválidas',
          status: 404,
        });
      }

      // token que enviado para o front-end e retornado no header para uma nova requisição
      // como é visível para o front-end, não deve conter informações sensíveis e por isso é válido por pouco tempo
      const accessToken = TokenRepository.generateAccessToken(user.id, '30s');

      // token que fica somente nos cookies, não visível para o front-end e por isso pode durar mais tempo
      // é utilizado para gerar um novo accessToken quando o mesmo expira
      const refreshToken = TokenRepository.generateRefreshToken(user.id, '7d');

      CookieRepository.setCookie(res, 'refreshToken', refreshToken);

      const { password: _, ...loggedUser } = user;

      res.locals = {
        status: 200,
        message: 'User logged',
        data: {
          loggedUser,
          accessToken,
        },
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }

  // função que é chamada quando o accessToken expira, é necessário um refreshToken para gerar um novo accessToken
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // pega o refreshToken do cookie
      const { refreshToken } = req.cookies.refreshToken;

      if (!refreshToken) {
        delete req.headers.authorization;

        return next({
          status: 401,
          message: 'Invalid token',
        });
      }

      // verifica se o refreshToken é válido
      const decodedRefreshToken =
        TokenRepository.verifyRefreshToken(refreshToken);

      if (!decodedRefreshToken) {
        delete req.headers.authorization;

        return next({
          status: 401,
          message: 'Invalid token',
        });
      }

      const user = await UserRepository.findById(decodedRefreshToken.id);

      if (!user) {
        return next({
          status: 400,
          message: 'User not found',
        });
      }

      CookieRepository.clearCookies(res, 'refresh_token');

      const newRefreshToken = TokenRepository.generateRefreshToken(
        user.id,
        '1d',
      );

      const acessToken = TokenRepository.generateAccessToken(user.id, '30s');

      CookieRepository.setCookie(res, 'refresh_token', newRefreshToken);

      const { password: _, ...loggedUser } = user;

      res.locals = {
        status: 200,
        message: 'Token refreshed',
        data: {
          loggedUser,
          acessToken,
        },
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      CookieRepository.clearCookies(res, 'refresh_token');
      delete req.headers.authorization; // remove o accestoken do header

      res.locals = {
        status: 200,
        message: 'User logged out',
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }
}

export default new LoginController();
