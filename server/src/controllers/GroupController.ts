import { Request, Response } from 'express';
import { GroupRepository } from '../repositories/index';

class GroupController {
  async createGroup(req: Request, res: Response) {
    try {
      const { groupName, groupImage, groupDuration, groupType } = req.body;
      if (!groupName || !groupImage || !groupDuration) {
        res.status(400).json('Campo obrigatório não preenchido');
        return;
      } // essa parte vai sair, isso é parte do zod

      const newGroup = await GroupRepository.create({
        name: groupName,
        image: groupImage,
        duration: groupDuration,
        type: groupType,
        active: true,
        code: '',
      });
      res.status(200).json(newGroup);
    } catch (error) {
      res.status(500).json({
        error: 'internal server error',
      });
    }
  }

  async getGroup(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const group = await GroupRepository.findById(groupId);
      if (!group) {
        res.status(404).json({ message: 'Grupo não encontrado' });
        return;
      }

      res.status(200).json(group);
    } catch (error) {
      res.status(500).json({
        message: 'internal server error',
        error: (error as Error).message,
      });
    }
  }

  async enterGroup(req: Request, res: Response) {
    try {
      const { groupCode, userId } = req.params;

      const checkGroup = await GroupRepository.findByCode(groupCode);
      if (!checkGroup) {
        res.status(404).json({ message: 'Grupo não encontrado' });
        return;
      }

      await GroupRepository.changeScoreSingle(userId, 0);
      // falta checar se o user existe, falta as rotas do user para isso(eu não sei se é necessário mesmo pq o user vai estar logado, como ele não vai existir?)

      const updatedGroup = await GroupRepository.enter(groupCode, userId);
      res.status(200).json(updatedGroup);
    } catch (error) {
      res.status(500).json({
        error: 'internal server error',
      });
    }
  }

  async leaveGroup(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      // falta checar se o user existe, é necessário as rotas do user para isso

      const updatedUser = await GroupRepository.leave(userId);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({
        error: 'internal server error',
      });
    }
  }

  async resetGroup(req: Request, res: Response) {
    try {
      const { groupId } = req.params;

      const group = await GroupRepository.findById(groupId);
      if (!group) {
        res.status(404).json({ message: 'Grupo não encontrado' });
        return;
      }

      const duration = group.duration.getTime() - group.createdAt.getTime();
      const newDate = new Date();
      newDate.setMilliseconds(newDate.getMilliseconds() + duration);
      await GroupRepository.changeScoreMultiple(groupId, 0);

      const updatedGroup = await GroupRepository.reset(groupId, newDate);
      res.status(200).json({ message: 'Competição reiniciada', updatedGroup });
    } catch (error) {
      res.status(500).json({
        error: 'internal server error',
      });
    }
  }

  async deleteGroup(req: Request, res: Response) {
    try {
      const { groupId } = req.params;

      const group = await GroupRepository.findById(groupId);
      if (!group) {
        res.status(404).json({ message: 'Grupo não encontrado' });
        return;
      }

      const deletedGroup = await GroupRepository.delete(groupId);

      res.status(200).json({ message: 'Grupo deletado', deletedGroup });
    } catch (error) {
      res.status(500).json({
        error: 'internal server error',
      });
    }
  }
}

export default new GroupController();
