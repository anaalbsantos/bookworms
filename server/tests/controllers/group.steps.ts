// eslint-disable-next-line import/no-extraneous-dependencies
import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from 'supertest';
import { TypeScore } from '@prisma/client';
import { connection } from '../../src/database/database.config';
import app from '../../src/app';
import { GroupRepository } from '../../src/repositories';

const feature = loadFeature('./tests/features/group.feature');

const createGroup = async (id: string, name: string) => ({
  id,
  code: '',
  name,
  image: 'imageUrl',
  createdAt: new Date(),
  active: true,
  duration: new Date(),
  type: TypeScore.CHECKIN,
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
    given(/^existe no sistema um grupo com id "(.*)" e nome "(.*)"$/, async (groupId, groupName) => {
      const group = await createGroup(groupId, groupName);
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
    given(/^não existe no sistema um grupo com id "(.*)"$/, async (groupId) => {
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

  const whenGETGroup = async (when: DefineStepFunction) => {
    when(
      /^é pedido ao sistema a informação do grupo de id "(.*)"$/,
      async (groupId) => {
        response = await supertest(app).get(`/groups/${groupId}`);
      },
    );
  };

  const whenDELETEGroup = async (when: DefineStepFunction) => {
    when(
      /^é pedido ao sistema para deletar o grupo com id "(.*)"$/,
      async (groupId) => {
        response = await supertest(app).delete(`/groups/${groupId}`);
      },
    );
  };

  const thenStatusResponse = async (then: DefineStepFunction) => {
    then(/^o status da resposta deve ser "(.*)"$/, async (status) => {
      expect(response.status).toBe(Number(status));
    });
  };

  const thenJsonAnswer = async (then: DefineStepFunction) => {
    then(/^o sistema retorna um JSON com nome "(.*)"$/, async (nome) => {
      expect(response.body.name).toBe(nome);
    },
    );
  };

  const thenMessageResponse = async (then: DefineStepFunction) => {
    then(/^o sistema retorna a mensagem "(.*)"$/, async (message) => {
      expect(response.body.message).toBe(message);
    });
  };

  const thenNoGroup = async (given: DefineStepFunction) => {
    given(/^não existe no sistema um grupo com id "(.*)"$/, async (groupId) => {
      const group = await (
        await connection.get()
      ).groups.findUnique({ where: { id: groupId } });
      expect(group).toBe(null);
    });
  };

  test('Consultar informações de um grupo', ({ given, when, and, then }) => {
    givenGroup(given);
    whenGETGroup(when);
    thenStatusResponse(then);
    thenJsonAnswer(and);
  });

  test('Falha ao consultar informações de um grupo', ({ given, when, and, then }) => {
    givenNoGroup(given);
    whenGETGroup(when);
    thenStatusResponse(then);
    thenMessageResponse(and);
  });

  test('Deletar grupo', ({ given, when, and, then }) => {
    givenGroup(given);
    whenDELETEGroup(when);
    thenMessageResponse(then);
    thenNoGroup(and);
  });

});