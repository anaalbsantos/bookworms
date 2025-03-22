/* eslint-disable import/no-extraneous-dependencies */
import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
import '@types/jest'
import supertest from 'supertest';
import { TypeScore } from '@prisma/client';
import app from '../../src/app';
import { GroupRepository } from '../../src/repositories';
import { connection } from '../Helper/database.config';

const feature = loadFeature('../features/feed.feature');

const createGroup = async (id: string) => ({
  id,
  code: 'group-feed-test',
  name: 'Grupo Teste Feed',
  image: 'image-url',
  createdAt: new Date(),
  active: true,
  duration: new Date(),
  type: TypeScore.CHECKIN,
});

const createUser = async (
  id: string,
  username: string,
  groupId: string
) => ({
  id,
  name: 'Usuário Teste',
  username,
  email: `${username}@test.com`,
  password: 'password123',
  groupId,
  score: 0,
});

const createPost = async (
  id: string,
  groupId: string,
  userId: string,
  createdAt: string
) => ({
  id,
  title: 'Postagem de Teste',
  image: 'post-image-url',
  createdAt: new Date(createdAt),
  numPages: 5,
  groupId,
  authorId: userId,
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
    given(/^existe um grupo no sistema com id "(.*)"$/, async (groupId) => {
      const group = await createGroup(groupId);
      await GroupRepository.create(group);
    });
  };

  const givenUserInGroup = async (given: DefineStepFunction) => {
    given(/^existe um usuário com id "(.*)" e username "(.*)" no grupo "(.*)"$/, async (userId, username, groupId) => {
      const user = await createUser(userId, username, groupId);
      await (await connection.get()).user.create({ data: user });
    });
  };

  const givenPostInGroup = async (given: DefineStepFunction) => {
    given(/^existe um post no grupo "(.*)" com id "(.*)", criado pelo usuário "(.*)" em "(.*)"$/, async (groupId, postId, userId, createdAt) => {
      const post = await createPost(postId, groupId, userId, createdAt);
      await (await connection.get()).post.create({ data: post });
    });
  };

  const whenUserRequestsFeed = async (when: DefineStepFunction) => {
    when(/^o usuário faz uma requisição GET para "(.*)"$/, async (route) => {
      response = await supertest(app).get(route);
    });
  };

  const whenUserRequestsFilteredFeed = async (when: DefineStepFunction) => {
    when(/^o usuário faz uma requisição GET para "(.*)" filtrando pelo usuário "(.*)"$/, async (route, userId) => {
      response = await supertest(app).get(`${route}?userId=${userId}`);
    });
  };

  const thenFeedShouldContainPosts = async (then: DefineStepFunction) => {
    then(/^o feed deve conter uma lista de postagens$/, async () => {
      if (!Array.isArray(response.body.data) || response.body.data.length === 0) {
        throw new Error('O feed não retornou postagens corretamente');
      }
    });
  };

  const thenFeedShouldContainOnlyUserPosts = async (then: DefineStepFunction) => {
    then(/^o feed deve conter apenas postagens do usuário "(.*)"$/, async (userId) => {
      if (!Array.isArray(response.body.data) || response.body.data.length === 0) {
        throw new Error('O feed não retornou postagens corretamente');
      }
      response.body.data.forEach((post) => {
        if (post.authorId !== userId) {
          throw new Error(`Postagem de outro usuário encontrada: ${post.authorId}`);
        }
      });
    });
  };

  test('Visualizar postagens de um grupo no feed', ({ given, and, when, then }) => {
    givenGroup(given);
    givenUserInGroup(and);
    givenPostInGroup(and);
    whenUserRequestsFeed(when);
    thenFeedShouldContainPosts(then);
  });

  test('Filtrar postagens de um usuário no feed', ({ given, and, when, then }) => {
    givenGroup(given);
    givenUserInGroup(and);
    givenPostInGroup(and);
    givenPostInGroup(and);
    whenUserRequestsFilteredFeed(when);
    thenFeedShouldContainOnlyUserPosts(then);
  });
});
