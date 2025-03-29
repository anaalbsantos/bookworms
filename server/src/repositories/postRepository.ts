import { Prisma, Post } from '@prisma/client';
import prisma from '../database';

class PostRepository {

  async create(data: Omit<Prisma.PostCreateInput, "author" | "group"> & { authorId: string; groupId: string }): Promise<Post> {
    const { authorId, groupId, ...postData } = data;

    const post = await prisma.post.create({
      data: {
        ...postData,
        author: { connect: { id: authorId } },
        group: { connect: { id: groupId } },  
      },
    });

    return post;
  }

  async update(postId: string, data: Prisma.PostUpdateInput): Promise<Post> {
    const post = await prisma.post.update({
      where: {
        id: postId,
      },
      data,
    });
    return post;
  }

  async delete(postId: string): Promise<Post> { 
    const post = await prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return post;
  }


  async findById(postId: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
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
}

export default new PostRepository();
