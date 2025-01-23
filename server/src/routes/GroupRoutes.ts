import { Router } from 'express';
import { GroupController } from '../controllers';

const groupRouter = Router();

// adicionar achar grupo pelo usuário?
groupRouter.post('/', GroupController.createGroup); // criar grupo usando o body
groupRouter.get('/:groupId', GroupController.getGroup); // informacoes de grupo especifico
groupRouter.put('/:groupCode/:userId', GroupController.enterGroup); // entrar em um grupo usando código do grupo e id do usuário
groupRouter.put('/:userId/leaveGroup', GroupController.leaveGroup); // sair de um grupo
groupRouter.put('/:groupId/resetGroup', GroupController.resetGroup); // resetar o tempo de competicao de um grupo
groupRouter.delete('/:groupId', GroupController.deleteGroup); // deletar grupo

export default groupRouter;
