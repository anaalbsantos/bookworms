import { Request, Response, NextFunction } from 'express';
import { PostRepository } from '../repositories';
import { Post } from '../DTOs';
import uploadImage from '../services/cloudinaryService';

class PostController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = {
        title: req.body.title,
        body: req.body.body,
        numPages: Number(req.body.numPages),
        authorId: req.body.authorId,
        groupId: req.body.groupId,
        image: req.file ? req.file.path : undefined,
      };
      const parsedData = Post.parse(data);
      let imageUrl = '';
      if (parsedData.image) {
        imageUrl = await uploadImage(parsedData.image);
      }

      const newPost = await PostRepository.create({
        ...parsedData,
        image: imageUrl,
      });

      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  }

    async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const currentPost = await PostRepository.findById(id);
      if (!currentPost) {
        return res.status(404).json({ message: 'Post não encontrado' });
      }

      const data = {
        title: req.body.title,
        body: req.body.body,
        numPages: parseInt(req.body.numPages, 10),
        image: req.file ? req.file.path : undefined,
      };

      const parsedData = Post.parse({
        ...data,
        authorId: currentPost.authorId, // Usa o valor existente
        groupId: currentPost.groupId, // Usa o valor existente
      });
      let imageUrl = currentPost.image;
      if (parsedData.image) {
        imageUrl = await uploadImage(parsedData.image);
      }

      const updatedPost = await PostRepository.update(id, {
        ...parsedData,
        image: imageUrl,
      });

      return res.json(updatedPost); // Adiciona o return aqui
    } catch (error) {
      return next(error); // Adiciona return aqui para garantir que a função sempre retorna algo
    }
  }


  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await PostRepository.delete(req.params.id);
      res.json(post);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const post = await PostRepository.findById(req.params.id);
      res.json(post);
    } catch (error) {
      next(error);
    }
  }

  async getUserPostsin(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await PostRepository.getUserPostsin(
        req.params.authorId,
        new Date(req.params.date),
      );
      res.json(posts);
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();
