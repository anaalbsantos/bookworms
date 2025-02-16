import { Request, Response } from 'express';
import PostRepository from '../repositories/postRepository';
import prisma from '../database';

class PostController {
  async createPost(req: Request, res: Response): Promise<Response> {
    try {
      const { title, body, image, numPages, groupCode, authorId } = req.body;

      // Verifica se todos os dados necessários foram enviados
      if (!image || !groupCode || !authorId) {
        return res.status(400).json({ message: 'Imagem, código do grupo e autor são obrigatórios.' });
      }

      // Verifica se o grupo existe e se o usuário participa dele
      const group = await prisma.groups.findUnique({
        where: {
          code: groupCode,
        },
        include: {
          members: true,
        },
      });

      if (!group) {
        return res.status(404).json({ message: 'Grupo não encontrado.' });
      }

      // Verifica se o usuário é membro do grupo
      const isMember = group.members.some(member => member.id === authorId);

      if (!isMember) {
        return res.status(403).json({ message: 'Você não participa deste grupo.' });
      }

      // Verifica o tipo de pontuação do grupo
      if (group.type === 'PAGES' && !numPages) {
        return res.status(400).json({ message: 'Número de páginas é obrigatório para este grupo.' });
      }

      // Cria o post usando o repositório
      const newPost = await PostRepository.create({
        title,
        body,
        image,
        numPages: numPages || 0,
        authorId,
        groupId: group.id,
      });

      // Atualiza a pontuação do usuário
      let newScore = group.type === 'PAGES' ? numPages : 1;
      await prisma.user.update({
        where: { id: authorId },
        data: { score: { increment: newScore } },
      });

      return res.status(201).json({ message: 'Post criado com sucesso!', post: newPost });
    } catch (error) {
      console.error('Erro ao criar post:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  // Listar todas as publicações
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const posts = await PostRepository.findAll();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar publicações', error });
    }
  }

  // Listar publicações de um grupo específico
  async getPostsByGroup(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params;
    try {
      const posts = await PostRepository.findById(groupId);
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar publicações do grupo', error });
    }
  }

  // Listar publicações de um usuário específico
  async getPostsByUser(req: Request, res: Response): Promise<void> {
    const { authorId } = req.params;
    try {
      const posts = await PostRepository.getUserPostsin(authorId, new Date());
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar publicações do usuário', error });
    }
  }

  // Detalhes de uma publicação
  async getById(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    try {
      const post = await PostRepository.findById(postId);
      if (!post) {
        res.status(404).json({ message: 'Post não encontrado' });
      } else {
        res.status(200).json(post);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar publicação', error });
    }
  }

  // Editar uma publicação
  async update(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const { title, body, image, numPages } = req.body;
    try {
      const updatedPost = await PostRepository.update(postId, { title, body, image, numPages });
      if (!updatedPost) {
        res.status(404).json({ message: 'Post não encontrado' });
      } else {
        res.status(200).json(updatedPost);
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar publicação', error });
    }
  }

  // Excluir uma publicação
  async delete(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    try {
      const deletedPost = await PostRepository.delete(postId);
      if (!deletedPost) {
        res.status(404).json({ message: 'Post não encontrado' });
      } else {
        res.status(200).json({ message: 'Post excluído com sucesso' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir publicação', error });
    }
  }
}

export default new PostController();
