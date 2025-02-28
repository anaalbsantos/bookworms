import { Router } from 'express';
import auth from '../middlewares/auth';
import UserController from '../controllers/UserController';

const userRouter = Router();

userRouter.post('/', UserController.create); // Criar usuário
userRouter.get('/', UserController.findAll); // Listar todos os usuários
userRouter.get('/:userId', UserController.read); // Buscar usuário por ID
userRouter.get('/username/:username', UserController.getByUsername); // Buscar usuário por username
userRouter.get('/email/:email', UserController.getByEmail); // Buscar usuário por email
userRouter.put('/:userId', [auth], UserController.update); // Atualizar usuário
userRouter.delete('/:userId', [auth], UserController.delete); // Deletar usuário

export default userRouter;
