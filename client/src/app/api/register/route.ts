import { Router, Request, Response } from 'express';
import { UserRepository } from '../../../../../server/src/repositories/';
import { UserDTO } from '../../../../../server/src/DTOs/';
import upload from '../../../../../server/src/middlewares/multer';
import { ZodError } from 'zod';
import uploadImage from '../../../../../server/src/services/cloudinaryService'; // Importe a função de upload de imagem

const router = Router();

router.post(
  '/register',
  upload.single('image'), // Middleware para processar o upload do arquivo
  async (req: Request, res: Response) => {
    try {
      console.log('Recebendo requisição de cadastro:', req.body); // Log dos dados recebidos

      if (!req.body) {
        console.log('Corpo da requisição inválido'); // Log de erro
        res.status(400).json({ message: 'Corpo da requisição inválido' });
        return;
      }

      const data = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        bio: req.body.bio,
        image: req.file // Arquivo de imagem enviado
      };

      console.log('Dados recebidos:', data); // Log dos dados

      // Valida os dados usando o DTO
      const parsedData = UserDTO.parse(data);
      console.log('Dados validados com sucesso:', parsedData); // Log dos dados validados

      // Verifica se o username ou email já estão em uso
      const existingUser = await UserRepository.findByUsernameOrEmail(
        parsedData.username
      );

      if (existingUser) {
        const message =
          existingUser.username === parsedData.username
            ? 'O username já está em uso'
            : 'O email já está em uso';
        console.log('Usuário já existe:', message); // Log de erro
        res.status(400).json({ message });
        return;
      }

      // Faz o upload da imagem (se houver)
      let imageUrl = null;
      if (req.file) {
        console.log('Fazendo upload da imagem...'); // Log de upload
        imageUrl = await uploadImage(req.file.path); // Envia o arquivo para o Cloudinary
        console.log('Upload da imagem concluído:', imageUrl); // Log do resultado do upload
      }

      // Cria o usuário no banco de dados
      console.log('Criando usuário no banco de dados...'); // Log de criação
      const newUser = await UserRepository.create({
        name: parsedData.name,
        username: parsedData.username,
        email: parsedData.email,
        password: parsedData.password,
        bio: parsedData.bio,
        image: imageUrl
      });
      console.log('Usuário criado com sucesso:', newUser); // Log de sucesso

      // Retorna a resposta de sucesso
      res.status(201).json({
        message: 'Cadastro realizado com sucesso',
        user: newUser
      });
    } catch (error) {
      console.error('Erro ao cadastrar:', error); // Log de erro
      if (error instanceof ZodError) {
        // Retorna erros de validação do DTO
        res.status(400).json({
          message: error.errors[0].message,
          errors: error.errors
        });
        return;
      }

      // Retorna erros inesperados
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
);

export default router;
