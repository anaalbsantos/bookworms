import { Router } from 'express';
import { GroupController } from '../controllers';
import upload from '../middlewares/multer';

const groupRouter = Router();

groupRouter.get('/', GroupController.getAllGroups); // pegar todos os grupos
groupRouter.get('/:groupId', GroupController.getGroup); // informacoes de grupo especifico
groupRouter.post('/create', upload.single('image'), GroupController.createGroup); // criar grupo usando o body
groupRouter.put('/update/:groupId', upload.single('groupImage'), GroupController.updateGroup); // criar um grupo
groupRouter.put('/enter/:groupCode/:userId', GroupController.enterGroup); // entrar em um grupo usando código do grupo e id do usuário
groupRouter.put('/leave/:userId', GroupController.leaveGroup); // sair de um grupo
groupRouter.put('/reset/:groupId', GroupController.resetGroup); // resetar o tempo de competicao de um grupo
groupRouter.delete('/delete/:groupId', GroupController.deleteGroup); // deletar grupo

export default groupRouter;
