import { Router } from 'express';
import PostController from '../controllers/PostController';

const router = Router();

router.post('/create', PostController.createPost);

// Listar todas as publicações
router.get('/', PostController.getAll);

// Listar publicações de um grupo específico
router.get('/group/:groupId', PostController.getPostsByGroup);

// Listar as publicações de um usuário específico
router.get('/user/:authorId', PostController.getPostsByUser);

// Detalhes de uma publicação
router.get('/:postId', PostController.getById);

// Editar uma publicação
router.put('/:postId', PostController.update);

// Excluir uma publicação
router.delete('/:postId', PostController.delete);


export default router;
