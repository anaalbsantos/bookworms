import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { GroupRepository } from '../repositories/index';
import { Group, updateGroup } from '../DTOs/index';
import uploadImage from '../services/cloudinaryService';

class GroupController {
  async createGroup(req: Request, res: Response): Promise<Response> {
    try {
      const data = {
        name: req.body.groupName,
        duration: req.body.groupDuration,
        type: req.body.groupType,
        image: req.file,
      };

      const parsedData = Group.parse(data);

      const imageUrl = await uploadImage(parsedData.image.path);

      const newGroup = await GroupRepository.create({
        name: parsedData.name,
        image: imageUrl,
        duration: parsedData.duration,
        type: parsedData.type,
        active: true,
        code: '',
      });

      return res.status(200).json({
        message: 'Grupo criado',
        group: newGroup,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }

      return res.status(500).json({
        error: 'internal server error',
      });
    }
  }

  async updateGroup(req: Request, res: Response): Promise<Response> {
    try {
      // pega o grupo com as infos antigas
      const { groupId } = req.params;
      const currentGroup = await GroupRepository.findById(groupId);
      if (!currentGroup) {
        return res.status(404).json({ message: 'Grupo não encontrado' });
      }

      // testa no zod
      const data = {
        name: req.body.name,
        duration: req.body.duration,
        type: req.body.type,
        image: req.file ? req.file : undefined,
      };
      const parsedData = updateGroup.parse(data);

      // salva o url antigo e substitui caso o user tenha enviado um novo
      let imageUrl = currentGroup.image;
      if (parsedData.image) {
        imageUrl = await uploadImage(parsedData.image.path);
      }

      // salva os dados novos no bd
      const group = await GroupRepository.update(groupId, {
        name: parsedData.name,
        duration: parsedData.duration,
        type: parsedData.type,
        image: imageUrl,
      });
      return res.status(200).json({
        message: 'Grupo atualizado',
        group,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }

      return res.status(500).json({
        error: 'internal server error',
      });
    }
  }

  async getGroup(req: Request, res: Response): Promise<Response> {
    try {
      const { groupId } = req.params;
      const group = await GroupRepository.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Grupo não encontrado' });
      }
      return res.status(200).json(group);
    } catch (error) {
      return res.status(500).json({
        message: 'internal server error',
        error: (error as Error).message,
      });
    }
  }

  async enterGroup(req: Request, res: Response): Promise<Response> {
    try {
      const { groupCode, userId } = req.params;
      const checkGroup = await GroupRepository.findByCode(groupCode);
      if (!checkGroup) {
        return res.status(404).json({ message: 'Grupo não encontrado' });
      }

      await GroupRepository.changeScoreSingle(userId, 0);

      const updatedGroup = await GroupRepository.enter(groupCode, userId);
      return res.status(200).json({
        message: 'Usuario inserido no grupo',
        grupo: updatedGroup,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'internal server error',
      });
    }
  }

  async leaveGroup(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;

      const updatedUser = await GroupRepository.leave(userId);
      return res.status(200).json({
        user: updatedUser,
        message: 'Usuario retirado do grupo',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'internal server error',
      });
    }
  }

  async resetGroup(req: Request, res: Response): Promise<Response> {
    try {
      const { groupId } = req.params;

      const group = await GroupRepository.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Grupo não encontrado' });
      }

      const duration = group.duration.getTime() - group.createdAt.getTime();
      const newDate = new Date();
      newDate.setMilliseconds(newDate.getMilliseconds() + duration);
      await GroupRepository.changeScoreMultiple(groupId, 0);

      const updatedGroup = await GroupRepository.reset(groupId, newDate);
      return res.status(200).json({
        message: 'Competição reiniciada',
        group: updatedGroup,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'internal server error',
      });
    }
  }

  async deleteGroup(req: Request, res: Response): Promise<Response> {
    try {
      const { groupId } = req.params;

      const group = await GroupRepository.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Grupo não encontrado' });
      }
      const deletedGroup = await GroupRepository.delete(groupId);
      return res.status(200).json({ message: 'Grupo deletado', deletedGroup });
    } catch (error) {
      return res.status(500).json({
        error: 'internal server error',
      });
    }
  }

  async getAllGroups(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const groups = await GroupRepository.getAll();

      res.locals = {
        status: 200,
        message: 'Grupos encontrados',
        data: groups,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }
}

export default new GroupController();
