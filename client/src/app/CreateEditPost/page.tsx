'use client';

import * as React from 'react';
import { Layout, TextInput } from 'components';
import { Button } from 'components/ui/button';
import PageTitle from 'components/title';
import { FileUpload } from 'components';
import api from '../../services/api';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import Ranking from 'components/ranking';
import { useEffect } from 'react';

type FormData = {
  title: string;
  body?: string;
  numPages: number;
  groupId?: string;
};

interface RankingUser {
  id: string;
  name: string;
  image?: string;
  score: number;
  position: number;
}

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  score: number;
  bio: string;
  image: string;
  groupId: string;
}

interface ApiResponse {
  data: User[];
}

export default function CreateEditPost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId'); // Obtém o ID do post da URL, se existir
  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/Login');
    }
  });

  const user = session.data?.user;
  const [image, setImage] = React.useState<File | null>(null);
  const [rankingData, setRanking] = React.useState<RankingUser[]>([]);
  const { register, handleSubmit, setValue } = useForm<FormData>();

  // Se for edição, buscar os dados do post
  React.useEffect(() => {
    if (postId) {
      api
        .get(`/posts/${postId}`)
        .then((response) => {
          const post = response.data;
          setValue('title', post.title);
          setValue('body', post.body || '');
          setValue('numPages', post.numPages);
        })
        .catch((error) => console.error('Erro ao buscar post:', error));
    }
  }, [postId, setValue]);

  const handlePublish: SubmitHandler<FormData> = async (data, event) => {
    event?.preventDefault();
    const formData = new FormData();

    formData.append('title', data.title);
    if (data.body) formData.append('body', data.body);
    formData.append('numPages', data.numPages.toString());
    if (user?.id) {
      formData.append('authorId', user.id);
    }
    if (user?.groupId || data.groupId) {
      formData.append('groupId', user?.groupId || data.groupId || '');
    }
    if (image) {
      formData.append('image', image);
    }

    try {
      if (postId) {
        // Se estiver editando, fazer um PUT
        await api.put(`/posts/${postId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        await api.put(`/score/putPost/${user?.groupId}/${user?.id}/${postId}`);
      } else {
        // Se estiver criando, fazer um POST
        const response = await api.post('/posts/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        await api.put(
          `/score/createPost/${user?.groupId}/${user?.id}/${response.data.id}`
        );
        const newPostId = response.data.id;
        router.push(`/PubliDetails?postId=${newPostId}`);
      }
    } catch (error) {
      console.error('Erro ao acessar API:', error);
    }
  };

  const handleCancel = () => {
    setValue('title', '');
    setValue('numPages', 0);
    setValue('body', '');
    setImage(null);
  };

  const handleFileSelect = (file: File | null) => {
    setImage(file);
  };

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const res = await api.get<ApiResponse>(
          `/score/ranking/${user?.groupId}`
        );
        const data = res.data.data;
        const ranking = data.map((user, index) => ({
          id: user.id,
          name: user.name,
          image: user.image,
          score: user.score,
          position: index + 1
        }));
        console.log('ranking', user?.groupId, data);
        setRanking(ranking);
      } catch (error) {
        console.error('Erro ao buscar ranking:', error);
      }
    };

    fetchRankingData();
  }, [user, user?.groupId]);

  return (
    <Layout>
      <div className="flex justify-around p-8">
        <div className="flex flex-col items-center w-[65%]">
          <div className="flex justify-center w-full">
            <PageTitle
              title={
                postId ? 'Editando publicação' : 'Publicando no clube de livro'
              }
              showBackButton={true}
              onBackClick={() => router.push('/Group')}
            />
          </div>
          <form onSubmit={handleSubmit(handlePublish)} className="w-full">
            <div className="flex gap-3 mt-12 w-full">
              <TextInput
                label="Título da Publicação"
                type="text"
                width="w-full"
                height="h-[50px]"
                {...register('title', { required: 'Título é obrigatório' })}
              />
              <TextInput
                label="N° de páginas lidas"
                type="number"
                width="w-full"
                height="h-[50px]"
                {...register('numPages', {
                  required: 'Numero de Paginas é obrigatório'
                })}
              />
            </div>
            <div className="mt-5 w-full">
              <h2 className="text-borrow font-semibold font-nunito">
                Descrição
              </h2>
              <textarea
                {...register('body')}
                className="w-full h-[100px] p-2 border bg-white border-gray rounded-md focus-visible:ring-neutral-400 font-nunito text-borrowDark resize-none"
                rows={4}
              />
            </div>
            <div className="mt-8">
              <FileUpload
                onFileSelect={handleFileSelect}
                width={780}
                height={246}
              />
            </div>
            <div className="flex gap-3 p-8 w-full justify-end ml-[55px] mt-9">
              <Button
                type="button"
                className="bg-gray w-[218px] h-[50px] font-nunito text-[20px] rounded-[10px]"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-borrow text-white w-[218px] h-[50px] font-nunito text-[20px] rounded-[10px]"
              >
                {postId ? 'Salvar alterações' : 'Publicar'}
              </Button>
            </div>
          </form>
        </div>
        <div className="">
          <Ranking users={rankingData}></Ranking>
        </div>
      </div>
    </Layout>
  );
}
