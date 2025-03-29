'use client';
import { Layout } from 'components';
import { TextInput } from 'components';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Calendar } from 'components';
import { CustomButton } from 'components';
import { FileUpload } from 'components';
import { Modal } from 'components';
import api from '../../services/api';
import * as React from 'react';

type FormData = {
  name: string;
  type: string;
};

export default function CreateGroup() {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/Login');
    }
  });

  const user = session.data?.user;

  const { register, handleSubmit } = useForm<FormData>();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [IsVisible, setIsVisible] = React.useState<boolean>(false);

  const handleFunc: SubmitHandler<FormData> = async (data) => {
    const formData = new FormData();
    formData.append('groupName', data.name);
    formData.append('groupDuration', date?.toISOString() || '');
    formData.append('groupType', data.type);

    if (photo) {
      formData.append('image', photo);
    }

    console.log(Object.fromEntries(formData));
    try {
      const response = await api.post('/groups/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      const code = response.data.group.code;

      await api.put(`/groups/enter/${code}/${user?.id}`);

      router.push('/Group');
    } catch (error) {
      console.error('Erro ao acessar api', error);
    }
  };

  const handleCloseLogout = () => {
    setIsVisible(false);
  };

  const handleEnterGroup = async () => {
    setIsVisible(false);
    const input = document.querySelector(
      'input[type="text"]'
    ) as HTMLInputElement;
    const groupCode = input?.value;

    try {
      await api.put(`groups/enter/${groupCode}/${user?.id}`);

      router.push('/Group');
    } catch (error) {
      console.error('Erro ao acessar api', error);
    }
  };

  return (
    <>
      <Modal
        isOpen={IsVisible}
        onClose={handleCloseLogout}
        title="Digite o código do grupo para entrar em um grupo existente!"
        confirmText="Participar"
        showTextBox
        subtitle="Código do grupo"
        onConfirm={handleEnterGroup}
      />
      <Layout>
        <div className=" flex flex-row w-full h-full">
          <div className="basis-3/4 flex flex-col">
            <div className="basis-1/6 flex justify-center items-center">
              <div className="w-4/5 h-4/5 content-center">
                <h1 className=" text-[#49423C] font-nunito font-extrabold text-[24px]">
                  Nos fale sobre o seu grupo
                </h1>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(handleFunc)}
              className="basis-5/6 flex flex-col"
            >
              <div className="basis-1/6 flex flex-row">
                <div className="basis-2/3 flex justify-center">
                  <div className="w-4/5 h-4/5">
                    <TextInput
                      type="text"
                      label="Nome"
                      {...register('name', {
                        required: 'Campo obrigatório'
                      })}
                    />
                  </div>
                </div>
                <div className="basis-1/3 flex flex-col">
                  <label className="text-borrow font-semibold font-nunito">
                    Tipo
                  </label>
                  <select
                    {...register('type', { required: 'Campo obrigatório' })}
                    className="bg-transparent border border-gray focus-visible:ring-neutral-400 rounded-lg font-nunito text-borrowDark h-[40px] w-full"
                  >
                    <option className="font-nunito" selected>
                      Tipo de jogo
                    </option>
                    <option className="font-nunito" value="CHECKIN">
                      Check-in
                    </option>
                    <option className="font-nunito" value="PAGES">
                      Paginas
                    </option>
                  </select>
                </div>
              </div>
              <div className="basis-2/3  flex flex-row">
                <div className="basis-1/2 flex flex-col justify-center items-center">
                  <div className="w-4/6 h-full ">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className=" input h-[315px] w-[250px] rounded-md border border-stone-200"
                    />
                  </div>
                </div>
                <div className="basis-1/2 flex flex-col items-center">
                  <FileUpload
                    onFileSelect={(file) => setPhoto(file)}
                    width={370}
                    height={240}
                  />
                  <div className="flex p-4 flex-row justify-center items-center">
                    <CustomButton
                      variant="gray"
                      label="Entrar em grupo existente"
                      type="button"
                      onClick={() => setIsVisible(true)}
                    />
                    <CustomButton
                      variant="borrow"
                      label="Criar grupo"
                      type="submit"
                      width="w-full m-2"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="basis-1/4 flex justify-center items-center">
            <div className="w-5/6 h-[600px] bg-borrow rounded-[16px] content-center place-items-center">
              <div className="w-5/6 h-[550px]">
                <h2 className="font-nunito font-white font-extrabold text-sm p-2">
                  Entendendo a pontuação
                </h2>
                <p className="font-nunito font-white font-extrabold text-sm">
                  ✦Check-in
                </p>
                <p className="font-nunito font-white font-medium text-xs">
                  Aqui os pontos são contabilizados por dia, ou seja, basta um
                  integrante do grupo fazer publicação que ganhará um ponto. Mas
                  lembrando que a pontuação máxima por dia é de 1 ponto!
                </p>
                <p className="font-nunito font-white font-extrabold text-sm">
                  ✦Por paginas
                </p>
                <p className="font-nunito font-white font-medium text-xs">
                  Aqui os pontos são contabilizados pelo número de páginas
                  lidas, então todas as publicações de um integrante contam para
                  a pontuação. Só não vale mentir, hein?
                </p>
                <h2 className="font-nunito font-white font-extrabold text-sm p-4">
                  Entendendo a duração do grupo
                </h2>
                <p className="font-nunito font-white font-medium text-xs">
                  O grupo dura até a data que você preencher no formulário, mas
                  não se preocupe, será possível recomeçar a competição com os
                  mesmos integrantes!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
