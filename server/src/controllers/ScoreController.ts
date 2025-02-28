import { Request, Response, NextFunction } from 'express';
import {
  GroupRepository,
  PostRepository,
  ScoreRepository,
} from '../repositories';

class ScoreController {
  async getRanking(req: Request, res: Response, next: NextFunction) {
    try {
      const { groupId } = req.params;

      const group = await GroupRepository.findById(groupId);
      if (!group) {
        return next({
          status: 404,
          message: 'Grupo não encontrado',
        });
      }

      const ranking = await ScoreRepository.ranking(groupId);

      res.locals = {
        status: 200,
        message: 'Ranking encontrado',
        data: ranking,
      };

      return next();
    } catch (error) {
      return next({
        status: 500,
        message: 'internal server error',
      });
    }
  }

  async updateScoreAfterCreatePost(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { groupId, userId, postId } = req.params;

      const group = await GroupRepository.findById(groupId);
      if (!group) {
        return next({
          status: 404,
          message: 'Grupo não encontrado',
        });
      }

      if (group.type === 'CHECKIN') {
        // score by checkin
        const now = new Date();
        // console.log(now.toLocaleString());
        const userMadeCheckin = await PostRepository.getUserPostsin(
          userId,
          now,
        );
        if (userMadeCheckin.length === 1) {
          const user = await ScoreRepository.addScore(userId, 1);

          res.locals = {
            status: 200,
            data: user,
            message: 'Pontuação atualizada',
          };
        }
      } else {
        // score by number of pages
        const post = await PostRepository.findById(postId);
        if (!post) {
          return next({
            status: 404,
            message: 'Post não encontrado',
          });
        }
        const user = await ScoreRepository.addScore(userId, post.numPages);

        res.locals = {
          status: 200,
          data: user,
          message: 'Pontuação atualizada',
        };
      }

      return next();
    } catch (error) {
      return next({
        status: 500,
        message: 'internal server error',
      });
    }
  }

  async updateScoreAfterPutPost(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { groupId, userId, postId } = req.params;
      const { currentNumPages, newNumPages } = req.body;

      const group = await GroupRepository.findById(groupId);
      if (!group) {
        return next({
          status: 404,
          message: 'Grupo não encontrado',
        });
      }

      if (group.type === 'PAGES') {
        const post = await PostRepository.findById(postId);
        if (!post) {
          return next({
            status: 404,
            message: 'Post não encontrado',
          });
        }

        await ScoreRepository.removeScore(userId, currentNumPages);
        await ScoreRepository.addScore(userId, newNumPages);
      }

      res.locals = {
        status: 200,
        message: 'Pontuação atualizada',
      };

      return next();
    } catch (error) {
      return next({
        status: 500,
        message: 'internal server error',
      });
    }
  }

  async updateScoreAfterDeletePost(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { groupId, userId } = req.params;
      const { numPages } = req.body;

      const group = await GroupRepository.findById(groupId);
      if (!group) {
        return next({
          status: 404,
          message: 'Grupo não encontrado',
        });
      }
      if (group.type === 'CHECKIN') {
        const now = new Date();
        const userMadeCheckin = await PostRepository.getUserPostsin(
          userId,
          now,
        );
        if (!userMadeCheckin) {
          const user = await ScoreRepository.removeScore(userId, 1);
          res.locals = {
            status: 200,
            data: user,
            message: 'Pontuação atualizada',
          };
        }
      } else if (group.type === 'PAGES') {
        const user = await ScoreRepository.removeScore(userId, numPages);
        res.locals = {
          status: 200,
          data: user,
          message: 'Pontuação atualizada',
        };
      }

      return next();
    } catch (error) {
      return next({
        status: 500,
        message: 'internal server error',
      });
    }
  }
}

export default new ScoreController();
