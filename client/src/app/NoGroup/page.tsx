'use client';
import { Books } from 'assets';
import { Layout} from 'components';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';



export default function Profile() {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/Login');
    }
  });

  const user = session.data?.user;


  return (
    <Layout>
      <p className="text-borrowDark font-nunito">{user?.name}</p>
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4">
        <Image src={Books} alt="books" width={258} height={197} />
        <h1 className="font-nunito font-bold text-start text-lg text-[#6F6F6F]">Parece que você não participa de nenhum grupo :(</h1>
      </div>

    </Layout>
  );
}
