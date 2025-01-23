import { Prisma, Groups, User } from '@prisma/client';
import prisma from '@database';
import { generateCustomId } from '../utils/customCode';

class GroupRepository {
  /* eslint-disable no-await-in-loop */
  async create(data: Prisma.GroupsCreateInput): Promise<Groups> {
    let flag = true;
    let uniqueCode = generateCustomId();

    while (flag) {
      const group = await prisma.groups.findUnique({
        where: { code: uniqueCode },
      });

      if (!group) flag = false;
      else uniqueCode = generateCustomId();
    }

    const newGroup = await prisma.groups.create({
      data: {
        ...data,
        code: uniqueCode,
      },
    });

    return newGroup;
  }

  async changeScoreSingle(userId: string, newScore: number): Promise<User> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        score: newScore,
      },
    });
    return user;
  }

  async changeScoreMultiple(groupId: string, newScore: number): Promise<void> {
    await prisma.user.updateMany({
      where: { groupId },
      data: {
        score: newScore,
      },
    });
  }

  async findById(groupId: string): Promise<Groups | null> {
    const group = await prisma.groups.findUnique({
      where: { id: groupId },
    });
    return group;
  }

  async findByCode(groupCode: string): Promise<Groups | null> {
    const group = await prisma.groups.findUnique({
      where: { code: groupCode },
    });
    return group;
  }

  async enter(groupCode: string, userId: string): Promise<Groups> {
    const updatedGroup = await prisma.groups.update({
      where: { code: groupCode },
      data: {
        members: {
          connect: { id: userId },
        },
      },
    });
    return updatedGroup;
  }

  async leave(userId: string): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        group: {
          disconnect: true,
        },
      },
    });
    return updatedUser;
  }

  async reset(groupId: string, newDate: Date): Promise<Groups> {
    const updatedGroup = await prisma.groups.update({
      where: { id: groupId },
      data: {
        duration: newDate,
        active: true,
      },
    });

    return updatedGroup;
  }

  async delete(groupId: string): Promise<Groups> {
    const deletedGroup = await prisma.groups.delete({
      where: { id: groupId },
    });

    return deletedGroup;
  }
}

export default new GroupRepository();
