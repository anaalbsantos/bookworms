// eslint-disable-next-line import/no-extraneous-dependencies
import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from 'supertest';
import { TypeScore } from '@prisma/client';
import { connection } from '../../src/database/database.config';
import app from '../../src/app';
import { GroupRepository } from '../../src/repositories';

const feature = loadFeature('./tests/features/score.feature');

const createGroup = async (id: string) => ({
  id,
  code: 'group-code',
  name: 'Grupo 1',
  image: 'image',
  createdAt: new Date(),
  active: true,
  duration: new Date(),
  type: TypeScore.CHECKIN, // or TypeScore.PAGES based on your requirement
});

const createUser = async (
  id: string,
  username: string,
  groupId: string,
  score: number,
) => ({
  id,
  name: 'Test Name',
  username,
  email: `${username}@gmail.com`,
  password: '12345678',
  groupId,
  score,
});

const createPostinGroupCheckin = async (
  id: string,
  groupId: string,
  userId: string,
) => ({
  id,
  title: 'Post Title',
  image: '',
  createdAt: new Date(),
  numPages: 10,
  groupId,
  authorId: userId, // added authorId property
});

defineFeature(feature, (test) => {
  let response: supertest.Response;

  beforeAll(async () => {
    await connection.create();
  });
  afterEach(async () => {
    await connection.clear();
  });
  afterAll(async () => {
    await connection.close();
  });

  const givenGroup = async (given: DefineStepFunction) => {
    given(/^há um grupo no sistema com id "(.*)"$/, async (groupId) => {
      const group = await createGroup(groupId);
      await GroupRepository.create({
        id: group.id,
        code: group.code,
        name: group.name,
        image: group.image,
        createdAt: group.createdAt,
        active: group.active,
        duration: group.duration,
        type: group.type,
      });
    });
  };

  const givenNoGroup = async (given: DefineStepFunction) => {
    given(/^não há um grupo no sistema com id "(.*)"$/, async (groupId) => {
      const group = await (
        await connection.get()
      ).groups.findUnique({ where: { id: groupId } });
      if (group) {
        await (
          await connection.get()
        ).groups.delete({ where: { id: groupId } });
      }
    });
  };

  const givenUserinGroupwithScore = async (given: DefineStepFunction) => {
    given(
      /^há um usuário no sistema com id "(.*)", username "(.*)", groupId "(.*)", score "(.*)"$/,
      async (userId, username, groupId, score) => {
        // format and create user
        const user = await createUser(userId, username, groupId, Number(score));
        await connection.get();
        await (await connection.get()).user.create({ data: user });
        // console.log('User created successfully');
      },
    );
  };

  const givenPost = async (given: DefineStepFunction) => {
    given(
      /^há um post no sistema com id "(.*)", groupId "(.*)" e userId "(.*)" criado no dia atual$/,
      async (postId, groupId, userId) => {
        // format and create post
        const post = await createPostinGroupCheckin(postId, groupId, userId);
        await connection.get();
        await (await connection.get()).post.create({ data: post });
        // console.log('Post created successfully');
      },
    );
  };

  const whenGETRequest = async (when: DefineStepFunction) => {
    when(/^uma requisição GET for enviada para "(.*)"$/, async (route) => {
      response = await supertest(app).get(route);
    });
  };

  const whenPUTRequest = async (when: DefineStepFunction) => {
    when(/^uma requisição PUT for enviada para "(.*)"$/, async (route) => {
      response = await supertest(app).put(route);
    });
  };

  const thenStatusResponse = async (then: DefineStepFunction) => {
    then(/^o status da resposta deve ser "(.*)"$/, async (status) => {
      if (response.status !== parseInt(status, 10)) {
        throw new Error(
          `Expected status ${status}, but got ${response.status}`,
        );
      }
    });
  };

  const thenMessageResponse = async (then: DefineStepFunction) => {
    then(/^a resposta deve conter a mensagem "(.*)"$/, async (message) => {
      if (response.body.message !== message) {
        throw new Error(
          `Expected message ${message}, but got ${response.body.message}`,
        );
      }
    });
  };

  const thenResponseArray = async (then: DefineStepFunction) => {
    then(/^deve ser retornado um JSON com uma lista de usuários$/, async () => {
      if (!Array.isArray(response.body.data)) {
        throw new Error('Expected an array of users');
      }
    });
  };

  const thenUserinPosition = async (then: DefineStepFunction) => {
    then(
      /^o usuário com id "(.*)" deve ser o elemento "(.*)" da lista$/,
      async (userId, position) => {
        if (response.body.data[Number(position)].id !== userId) {
          throw new Error(
            `Expected user with id ${userId} at position ${position}`,
          );
        }
      },
    );
  };

  const thenUserwithScore = async (then: DefineStepFunction) => {
    then(
      /^deve ser retornado um JSON contendo o usuário com id "(.*)", groupId "(.*)", score "(.*)"$/,
      async (userId, groupId, score) => {
        if (
          response.body.data.score !== Number(score) ||
          response.body.data.id !== userId ||
          response.body.data.groupId !== groupId
        ) {
          throw new Error(
            `Expected user with id ${userId} to have score ${score}`,
          );
        }
      },
    );
  };

  test('Consultar ranking de um grupo', ({ given, and, when, then }) => {
    givenGroup(given);
    givenUserinGroupwithScore(and);
    givenUserinGroupwithScore(and);
    givenUserinGroupwithScore(and);
    whenGETRequest(when);
    thenStatusResponse(then);
    thenResponseArray(and);
    thenUserinPosition(and);
    thenUserinPosition(and);
    thenUserinPosition(and);
  });

  test('Consultar ranking de um grupo que não existe', ({
    given,
    when,
    then,
    and,
  }) => {
    givenNoGroup(given);
    whenGETRequest(when);
    thenStatusResponse(then);
    thenMessageResponse(and);
  });

  test('Incrementar a pontuação de um usuário depois de criar um post em grupo por check-in', ({
    given,
    and,
    when,
    then,
  }) => {
    givenGroup(given);
    givenUserinGroupwithScore(and);
    givenPost(and);
    whenPUTRequest(when);
    thenStatusResponse(then);
    thenUserwithScore(and);
    thenMessageResponse(and);
  });
});
