import { Post } from '@prisma/client';
import prisma from '../database';

class PostRepository {
  async findById(postId: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    return post;
  }

  // posts from a specific user in a specific date
  async getUserPostsin(authorId: string, date: Date): Promise<Post[]> {
    const posts = await prisma.post.findMany({
      where: {
        authorId,
        createdAt: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lt: new Date(date.setHours(24, 0, 0, 0)),
        },
      },
    });
    return posts;
  }

  // Adicionando o método create no repositório
  async create(data: {
    title?: string;
    body?: string;
    image: string;
    numPages: number;
    authorId: string;
    groupId: string;
  }): Promise<Post> {
    const post = await prisma.post.create({
      data: {
        title: data.title ?? '' ,
        body: data.body,
        image: data.image,
        numPages: data.numPages,
        author: {
          connect: { id: data.authorId },
        },
        group: {
          connect: { id: data.groupId },
        },
      } 
    });
    return post;
  }

  // Listar todas as publicações
  async findAll(): Promise<Post[]> {
    const posts = await prisma.post.findMany();
    return posts;
  }

  // Atualizar uma publicação
  async update(postId: string, data: {
    title?: string;
    body?: string;
    image?: string;
    numPages?: number;
  }): Promise<Post | null> {
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: data.title,
        body: data.body,
        image: data.image,
        numPages: data.numPages,
      },
    });
    return updatedPost;
  }

  // Excluir uma publicação
  async delete(postId: string): Promise<Post | null> {
    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return deletedPost;
  }


}

export default new PostRepository();
