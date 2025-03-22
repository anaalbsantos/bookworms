/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line import/no-extraneous-dependencies
import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from 'supertest';
import { connection } from '../../src/database/database.config';
import app from '../../src/app';
import { GroupRepository } from '../../src/repositories';

const feature = loadFeature('./tests/features/feed.feature');

const createGroup = async (id: string) => ({
  id,
  code: 'default-code',
  name: 'Grupo Padrão',
  image: 'default-image.jpg',
  createdAt: new Date(),
  active: true,
  duration: new Date(),
});

const createUser = async (id: string, username: string, groupId: string) => ({
  id,
  name: username,
  username,
  email: `${username}@gmail.com`,
  password: '12345678',
  groupId,
  score: 0, // valor padrão para feed
});

const createPost = async (
  id: string,
  groupId: string,
  authorId: string,
  title: string,
  createdAt: Date,
  image: string = '',
  numPages: number = 0
) => ({
  id,
  title,
  image,
  createdAt,
  groupId,
  authorId,
  numPages,
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

  // STEP DEFINITIONS

  const givenGroup = async (given: DefineStepFunction) => {
    given(
      /^há um grupo no sistema com (?:código )?id "(.*)"$/,
      async (groupId) => {
        const group = await createGroup(groupId);
        await GroupRepository.create({
          id: group.id,
          code: group.code,
          name: group.name,
          image: group.image,
          createdAt: group.createdAt,
          active: group.active,
          duration: group.duration,
          type: 'CHECKIN'
        });
      }
    );
  };

  const givenUserInGroup = async (given: DefineStepFunction) => {
    given(
      /^há um usuário no sistema com id "(.*)", username "(.*)", groupId "(.*)"$/,
      async (userId, username, groupId) => {
        const user = await createUser(userId, username, groupId);
        await (await connection.get()).user.create({ data: user });
      }
    );
  };

  const givenPostsInGroup = async (given: DefineStepFunction) => {
    given(
      /^há (\d+) postagens cadastradas no grupo "(.*)" com os seguintes dados:$/,
      async (count, groupId, table) => {
        const posts = table.hashes();
        for (const row of posts) {
          const title = row.title.replace(/"/g, '');
          const createdAt = new Date(row.createdAt);
          const post = await createPost(
            row.id,
            row.groupId,
            row.authorId,
            title,
            createdAt,
          );
          await (await connection.get()).post.create({ data: post });
        }
      }
    );
  };

  const whenGETRequest = async (when: DefineStepFunction) => {
    when(/^uma requisição GET for enviada para "(.*)"$/, async (route) => {
      response = await supertest(app).get(route);
    });
  };

  const thenStatusResponse = async (then: DefineStepFunction) => {
    then(
      /^o status da resposta deve ser "(.*)"$/,
      async (status) => {
        if (response.status !== parseInt(status, 10)) {
          throw new Error(
            `Expected status ${status}, but got ${response.status}`
          );
        }
      }
    );
  };

  const thenResponseArray = async (then: DefineStepFunction) => {
    then(
      /^deve ser retornado um JSON com uma lista de postagens em ordem cronológica decrescente$/,
      async () => {
        if (!Array.isArray(response.body.data)) {
          throw new Error('Expected an array of posts');
        }
        const posts = response.body.data;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < posts.length - 1; i++) {
          // eslint-disable-next-line security/detect-object-injection
          if (new Date(posts[i].createdAt) < new Date(posts[i + 1].createdAt)) {
            throw new Error('Posts are not in descending order');
          }
        }
      }
    );
  };

  const thenPostInPosition = async (then: DefineStepFunction) => {
    then(
      /^a postagem com id "(.*)" deve ser o elemento "(.*)" da lista$/,
      async (postId, position) => {
        if (response.body.data[Number(position)].id !== postId) {
          throw new Error(
            `Expected post with id ${postId} at position ${position}`
          );
        }
      }
    );
  };

  const thenResponseArrayLength = async (then: DefineStepFunction) => {
    then(
      /^deve ser retornado um JSON contendo apenas (\d+) postagens$/,
      async (length) => {
        if (response.body.data.length !== parseInt(length, 10)) {
          throw new Error(
            `Expected ${length} posts, but got ${response.body.data.length}`
          );
        }
      }
    );
  };

  const thenMessageResponse = async (then: DefineStepFunction) => {
    then(
      /^deve ser retornado um JSON contendo a mensagem "(.*)"$/,
      async (message) => {
        if (response.body.message !== message) {
          throw new Error(
            `Expected message "${message}", but got "${response.body.message}"`
          );
        }
      }
    );
  };

  // TESTES

  test('Obter feed de postagens de um grupo com publicações', ({
    given,
    when,
    then,
    and,
  }) => {
    givenGroup(given);
    givenUserInGroup(and);
    givenUserInGroup(and);
    givenUserInGroup(and); 
    givenPostsInGroup(given); 
    whenGETRequest(when);
    thenStatusResponse(then);
    thenResponseArray(and);
    thenPostInPosition(and);
    thenPostInPosition(and);
    thenPostInPosition(and);
  });

  test('Obter feed de postagens de um grupo sem publicações', ({
    given,
    when,
    then,
    and,
  }) => {
    givenGroup(given);
    whenGETRequest(when);
    thenStatusResponse(then);
    thenMessageResponse(and); 
  });

  test('Filtrar postagens do feed por um usuário específico', ({
    given,
    when,
    then,
    and,
  }) => {
    givenGroup(given); 
    givenPostsInGroup(given);
    whenGETRequest(when);
    thenStatusResponse(then);
    thenResponseArrayLength(and);
    thenPostInPosition(and);
    thenPostInPosition(and);
  });

  test('Consultar feed de postagens para usuário sem publicações', ({
    given,
    when,
    then,
    and,
  }) => {
    givenGroup(given);
    givenUserInGroup(and); 
    whenGETRequest(when); 
    thenStatusResponse(then);
    thenMessageResponse(and);
  });
});
