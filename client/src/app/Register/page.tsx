'use client';
import {
  useForm,
  SubmitHandler,
  type FieldValues,
  Controller
} from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { CustomButton, TextInput } from 'components';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { FileUpload } from '../../components/picture-upload';
import api from '../../services/api';

interface FormData extends FieldValues {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  UserImage: File | null; // Alterado para File | null
}

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control // Adicionado para usar o Controller
  } = useForm<FormData>();

  const handleRegister: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      if (data.password !== data.confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      if (data.UserImage) {
        formData.append('UserImage', data.UserImage); // Certifique-se de que o nome do campo está correto
      }

      console.log('Dados enviados:', {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        image: data.UserImage
          ? data.UserImage.name
          : 'Nenhuma imagem selecionada'
      });

      // Verifica se o backend está acessível
      try {
        const testResponse = await api.get('/');
        console.log('Backend está acessível:', testResponse.data);
      } catch (testError) {
        console.error('Erro ao conectar ao backend:', testError);
        setError(
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
        );
        return;
      }

      // Envia os dados para o backend
      const response = await api.post('/users/criar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status >= 200 && response.status < 300) {
        router.push('/Login');
      } else {
        const errorData = response.data;
        console.error('Erro na resposta da API:', errorData);
        setError(errorData.message || 'Erro ao cadastrar. Tente novamente.');
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);

      if (error.response) {
        // Erro na resposta do backend
        const errorData = error.response.data;
        if (errorData.message) {
          setError(`Erro no servidor: ${errorData.message}`);
        } else {
          setError(
            'Erro ao processar a requisição. Verifique os dados e tente novamente.'
          );
        }
      } else if (error.request) {
        // Erro de conexão (sem resposta do servidor)
        setError(
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
        );
      } else {
        // Erro inesperado
        setError('Ocorreu um erro inesperado. Tente novamente.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#322828]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-row items-center justify-center">
          <h1 className="font-sacramento text-9xl text-[#703E30]">cadastro</h1>
        </div>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (data) => await handleRegister(data))}
        >
          <TextInput
            type="text"
            label="Nome"
            {...register('name', {
              required: 'Nome é obrigatório'
            })}
            error={!!errors.name}
            errorMessage={errors.name?.message}
          />
          <TextInput
            type="text"
            label="Username"
            {...register('username', {
              required: 'Username é obrigatório'
            })}
            error={!!errors.username}
            errorMessage={errors.username?.message}
          />
          <TextInput
            type="email"
            label="Email"
            {...register('email', {
              required: 'Email é obrigatório'
            })}
            error={!!errors.email}
            errorMessage={errors.email?.message}
          />
          <TextInput
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            {...register('password', {
              required: 'Senha é obrigatória'
            })}
            error={!!errors.password}
            errorMessage={errors.password?.message}
            icon={
              showPassword ? (
                <EyeOff
                  width={32}
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <Eye
                  width={32}
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )
            }
          />
          <TextInput
            type={showPassword ? 'text' : 'password'}
            label="Confirmar Senha"
            {...register('confirmPassword', {
              required: 'Confirmação de senha é obrigatória'
            })}
            error={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
          />
          <Controller
            name="UserImage"
            control={control}
            rules={{ required: 'Imagem do usuário é obrigatória' }}
            render={({ field }) => (
              <FileUpload
                label="Imagem do Usuário"
                onFileSelect={(file) => field.onChange(file)} // Atualiza o valor do campo UserImage
                width={400}
              />
            )}
          />
          {errors.UserImage && (
            <p className="text-red-500 text-sm text-center">
              ⚠︎ {errors.UserImage.message}
            </p>
          )}
          {error && (
            <p className="text-red-500 text-sm text-center">⚠︎ {error}</p>
          )}
          <CustomButton variant="borrow" label="Cadastrar" type="submit" />
          <p className="text-center text-borrow font-nunito font-semibold">
            Já possui conta?{' '}
            <a href="/Login" className="underline">
              Entrar
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
