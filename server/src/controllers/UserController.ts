import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { UserRepository } from '../repositories/index';
import { UserDTO, updatedUserDTO } from '../DTOs/index';
import uploadImage from '../services/cloudinaryService';
import userRepository from 'src/repositories/userRepository';

class UserController {
  async create(req: Request, res: Response) {
    try {
      // console.log('🔹 Recebendo requisição de cadastro:', req.body);
      const data = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
        image: req.file,
      };

      const parsedData = UserDTO.parse(data);
      // console.log('✅ Dados validados com sucesso:', parsedData);

      const existingUser = await UserRepository.findByUsernameOrEmail(
        parsedData.username,
      );
      if (existingUser) {
        // console.log('⚠️ Usuário já existe:', existingUser);
        return res.status(400).json({ message: 'O username já está em uso' });
      }

      const imageUrl = await uploadImage(parsedData.image.path);

      const newUser = await UserRepository.create({
        name: parsedData.name,
        username: parsedData.username,
        email: parsedData.email,
        password: parsedData.password,
        bio: parsedData.bio,
        image: imageUrl,
      });
      // console.log('🎉 Usuário criado com sucesso:', newUser);

      return res.status(201).json({
        message: 'Cadastro realizado com sucesso',
        user: newUser,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // console.log('❌ Erro de validação:', error.errors);
        return res.status(400).json({
          message: error.errors[0].message,
          errors: error.errors,
        });
      }

      // console.error('🔥 Erro inesperado:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const currentUser = await userRepository.findById(userId);
      if (!currentUser) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const data = {
        ...req.body,
        score:
          req.body.score !== undefined ? Number(req.body.score) : undefined,
        image: req.file ? req.file : undefined,
      };

      const parsedData = updatedUserDTO.parse(data);

      let imageUrl = currentUser.image;
      if (parsedData.image) {
        imageUrl = await uploadImage(parsedData.image.path);
      }

      const updatedUser = await UserRepository.update(userId, {
        ...parsedData,
        score: parsedData.score ?? currentUser.score,
        image: imageUrl,
      });

      return res.status(200).json({
        message: 'Perfil atualizado com sucesso',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const deletedUser = await UserRepository.delete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res
        .status(200)
        .json({ message: 'Usuário deletado com sucesso', deletedUser });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserRepository.getAll();

      if (users.length === 0) {
        res.locals = {
          status: 404,
          message: 'Nenhum usuário encontrado',
          data: [],
        };
        return next();
      }

      res.locals = {
        status: 200,
        message: 'Usuários encontrados',
        data: users,
      };

      return next();
    } catch (error) {
      return next(error);
    }
  }

  async read(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await UserRepository.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async getByUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const user = await UserRepository.findByUsernameOrEmail(username);

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }

  async getByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const user = await UserRepository.findByUsernameOrEmail(email);

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
}

export default new UserController();
