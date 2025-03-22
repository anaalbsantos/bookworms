'use client';
import { useState } from 'react';
import { CustomButton, Layout, SelectInput, PaginationComponent, PostCard} from 'components';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { GroupCover } from '../../components';
import { Close, GroupCoverImage } from 'assets';
import Image from 'next/image';
import Ranking from 'components/ranking';
import { UserPostImage } from 'assets';


export default function Profile() {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/Login');
    }
  });

  const user = session.data?.user;

  const [showPopup, setShowPopup] = useState(false);

  const handleLeaveGroupClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const leaveGroup = () => {
    setShowPopup(false);
    console.log('Saindo do grupo...');
    router.push('/NoGroup');
  };

  return (
    <Layout>
      <div className='flex flex-row p-10 justify-around'>
      {/* div do feed */}
      <div className="flex flex-col" >
        <GroupCover name={'clube do livro <3'} date={'Até 30 de janeiro'} type={'Páginas Lidas'} image={GroupCoverImage}/>

        {/* div de baixo */}
        <div className='flex flex-row gap-[150px] mt-10'>

          {/* botoes */}
          <div className='w-[321px] gap-4 flex flex-col'>
            <PaginationComponent/>
            <SelectInput placeholder={'Filtrar por usuário'} options={['nalaura', 'thaís', 'victor', 'tusca']}/>
            <CustomButton label={'+ Adicionar publicação'} variant={'dark'}/>
            <CustomButton label={'Sair do Grupo'} variant={'gray'} onClick={handleLeaveGroupClick} />
          </div>

          {/* posts */}
          <div className = "h-[680px] overflow-auto scrollbar-none">
            <PostCard postText={'Estou lendo o livro X e estou amando!'} author={'AnaLaura'} date={'há 2 dias'} image={UserPostImage} />
            <PostCard postText={'Estou lendo o livro X e estou amando!'} author={'AnaLaura'} date={'há 2 dias'} image={UserPostImage} />
            <PostCard postText={'Estou lendo o livro X e estou amando!'} author={'AnaLaura'} date={'há 2 dias'} image={UserPostImage} />
            <PostCard postText={'Estou lendo o livro X e estou amando!'} author={'AnaLaura'} date={'há 2 dias'} image={UserPostImage} />
          </div>


        </div>

      </div>
      <p className="text-borrowDark font-nunito">{user?.name}</p>
          <Ranking users={[{
            name: 'AnaLaura',
            id: '',
            score: 100,
            position: 1
          }, {
            name: 'Thaís',
            id: '',
            score: 95,
            position: 2
          }]}/>
      </div>


      {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-[480px] h-[180px] p-9 flex flex-col gap-8 rounded-[30px] shadow-2xl">
          <div className='flex flex-row justify-between gap-5'>
            <h1 className="font-nunito font-black text-start text-lg text-[#49423C]">Tem certeza que deseja sair do grupo?</h1>
            <button onClick={closePopup}>
              <Image src={Close} alt="close" />
            </button>
          </div>
          <div className="flex gap-6 justify-center mt-4">
            <CustomButton label="Cancelar" variant="gray" onClick={closePopup}/>
            <CustomButton label="Sair do grupo" variant="borrow" onClick={leaveGroup}/>
          </div>
        </div>
      </div>
)}


    </Layout>
  );
}
