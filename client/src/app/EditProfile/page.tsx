'use client';
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import PageTitle from '../../components/title';
import { TextInput } from '../../components/text-input';
import { CustomButton } from '../../components/button';
import SidebarLayout from '../../components/sidebar';
import { FileUpload } from '../../components/picture-upload';
import { SidebarProvider } from 'components/ui/sidebar';
import api from '../../services/api';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  username: string;
  email: string;
  biography?: string;
  score?: number;
  image?: File | null | string;
}

const EditProfilePage = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<FormData>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!session?.user?.id) return;

        const response = await api.get(`/users/${session.user.id}`);
        const userData = response.data;

        reset({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          biography: userData.bio || '',
          score: userData.score || 0,
          image: userData.image || null
        });

        if (userData.image) {
          const imageUrl = userData.image.includes('http')
            ? userData.image
            : `${api.defaults.baseURL}/${userData.image}`;
          setCurrentImage(imageUrl);
        }

        setIsLoading(false);
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
        setError('Não foi possível carregar os dados do perfil.');
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session, reset]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (!session?.user?.id) {
        setError('Usuário não autenticado');
        return;
      }

      const formData = new FormData();

      if (data.name) formData.append('name', data.name);
      if (data.username) formData.append('username', data.username);
      if (data.email) formData.append('email', data.email);
      if (data.biography) formData.append('bio', data.biography);
      if (data.score !== undefined) {
        formData.append('score', data.score.toString());
      }

      if (data.image instanceof File) {
        formData.append('image', data.image);
      } else if (data.image === null && currentImage) {
        formData.append('removeImage', 'true');
      }

      await api.put(`/users/${session.user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      if (data.image instanceof File) {
        const reader = new FileReader();
        reader.onload = () => setCurrentImage(reader.result as string);
        reader.readAsDataURL(data.image);
      } else if (data.image === null) {
        setCurrentImage(null);
      }
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar perfil');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#703E30]"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-white w-screen">
        <div className="w-64 flex-shrink-0">
          <SidebarLayout />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="w-full p-8">
            <PageTitle
              title="Edite seu perfil"
              showBackButton={true}
              onBackClick={() => router.push('/Profile')}
            />
          </div>

          <div className="flex-1 p-8">
            {}
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>
              <div className="flex">
                <div className="w-1/3">
                  <div className="flex flex-col items-center w-full">
                    <Controller
                      name="image"
                      control={control}
                      render={({ field }) => (
                        <FileUpload
                          onFileSelect={(file) => {
                            field.onChange(file);
                            if (!file) setValue('image', null);
                          }}
                          initialImage={currentImage}
                          label=""
                          width="100%"
                          height={337}
                        />
                      )}
                    />

                    <div className="mt-4 w-[280px]">
                      <CustomButton
                        label={success ? 'Salvo!' : 'Salvar'}
                        variant="borrow"
                        width="w-full"
                        type="submit"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-2/3 ml-8">
                  <div className="flex space-x-8">
                    <div className="w-1/2 space-y-4">
                      <TextInput
                        label="Nome"
                        type="text"
                        width="w-full"
                        {...register('name', {
                          required: 'Nome é obrigatório'
                        })}
                        error={!!errors.name}
                        errorMessage={errors.name?.message}
                      />
                      <TextInput
                        label="Username"
                        type="text"
                        width="w-full"
                        {...register('username', {
                          required: 'Username é obrigatório'
                        })}
                        error={!!errors.username}
                        errorMessage={errors.username?.message}
                      />
                      <TextInput
                        label="E-mail"
                        type="email"
                        width="w-full"
                        {...register('email', {
                          required: 'E-mail é obrigatório',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'E-mail inválido'
                          }
                        })}
                        error={!!errors.email}
                        errorMessage={errors.email?.message}
                      />
                    </div>

                    <div className="w-1/2 flex flex-col">
                      <TextInput
                        label="Biografia"
                        type="text"
                        width="w-full"
                        height="h-full"
                        multiline={true}
                        {...register('biography')}
                      />
                    </div>
                  </div>

                  <div className="flex mt-8">
                    <div className="w-1/3">
                      <div>
                        <h3 className="text-xl font-semibold text-borrowDark">
                          Top 3
                        </h3>
                      </div>

                      <div className="mt-[340px]">
                        <h3 className="text-xl font-semibold text-borrowDark">
                          Leitura Atual
                        </h3>
                        <div className="mt-9 flex space-x-4">
                          <TextInput
                            label="Páginas totais"
                            type="number"
                            width="w-1/3"
                            {...register('score', {
                              min: {
                                value: 0,
                                message: 'Deve ser um número positivo'
                              }
                            })}
                            error={!!errors.score}
                            errorMessage={errors.score?.message}
                          />
                          <TextInput
                            label="Páginas lidas"
                            type="number"
                            width="w-1/3"
                            {...register('score', {
                              min: {
                                value: 0,
                                message: 'Deve ser um número positivo'
                              }
                            })}
                            error={!!errors.score}
                            errorMessage={errors.score?.message}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-2/3 ml-8">
                      <FileUpload
                        onFileSelect={() => {}}
                        label=""
                        width="100%"
                        height={337}
                      />
                      <div className="mt-8">
                        <FileUpload
                          onFileSelect={() => {}}
                          label=""
                          width="100%"
                          height={337}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EditProfilePage;
