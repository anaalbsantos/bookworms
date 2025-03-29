import { Prisma, Comment} from '@prisma/client';
import prisma from '../database';

class CommentRepository {
  async create(data: Prisma.CommentCreateInput): Promise<Comment> {
    const newComment = await prisma.comment.create({
      data: {
        ...data,
      },
    });
    return newComment;
  }

  // buscar um comentário pelo id dele
  async findById(commentId: string): Promise<Comment | null> {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    return comment;
  }

  // buscar todos os comentários de um post
  async findByPostId(postId: string): Promise<Comment[]> {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });
    return comments;
  }
  

  // atualizar texto de um comentário:

  async update(commentId: string, text: string): Promise<Comment> {
    const updateComment = await prisma.comment.update({
      where: { id: commentId },
      data: { text },
    });
    return updateComment;
  }

  // deletar comentário:

  async delete(commentId: string): Promise<Comment> {
    const deletedComment = await prisma.comment.delete({
      where: { id: commentId },
    });
    return deletedComment;
  }
}

export default new CommentRepository();
