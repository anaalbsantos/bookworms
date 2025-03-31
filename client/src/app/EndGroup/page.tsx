'use client'
import { Worm } from "assets";
import { Layout } from "components";
import { WinnerCard, GroupCover } from "components";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { CustomButton } from "components";
import api from "services/api";
import Ranking from "components/ranking";

interface rankingUser {
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


export default function EndGroup() {
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated() {
      router.replace('/Login');
    }
  });

  const user = session.data?.user;

  const [ranking, setRanking] = useState<rankingUser[]>([]);

  const [group, setGroup] = useState({
    id: '',
    name: '',
    duration: '',
    type: '',
    image: '',
    code: ''
  });

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const response = await api.get<ApiResponse>(`score/ranking/${user?.groupId}`);
        const data = response.data.data;
        const rank = data.map((user, index) => ({
          id: user.id,
          name: user.name,
          image: user.image,
          score: user.score,
          position: index + 1,
        }));
        setRanking(rank);
      } catch (error) {
        console.error("Erro ao buscar ranking", error);
      }
    }

    fetchRankingData();
  }, [user]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const res = await api.get(`/groups/${user?.groupId}`);
        setGroup(res.data);
      } catch (error) {
        console.error('Erro ao buscar dados do grupo:', error);
      }
    };

    fetchGroupData();
  }, [user]);

  const sairGrupo = async () => {
    try {
      await api.put(`/groups/leave/${user?.id}`);

      router.push('/Profile');

    } catch (error) {
      console.error("Erro ao sair do grupo", error)
    }

  }

  const resetarGrupo = async () => {
    try {
      await api.put(`/groups/reset/${user?.groupId}`);

      router.push('/Group');

    } catch (error) {
      console.error("Erro ao resetar tempo de competição", error)
    }
  }

  const handledate = (dateString: string): string => {
    const newDate = new Date(dateString);
    const day = newDate.getDate();
    const month = newDate.toLocaleString('pt-BR', { month: 'long' });
    const year = newDate.getFullYear();
    return `Até ${day} de ${month} de ${year}`;
  };


  return (
    <Layout>
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col basis-2/3 justify-items-center items-center">
          <div className="w-[600px] h-[200px]">
            <GroupCover
              name={group.name}
              date={handledate(group.duration)}
              type={group.type}
              image={group.image}
              code={group.code}
            />
          </div>
          <div className="w-[25px] h-[25px]"></div>
          <WinnerCard
            firstName={ranking[0]?.name || ""}
            firstImage={ranking[0]?.image ?? ""}
            secondName={ranking[1]?.name || ""}
            secondImage={ranking[1]?.image ?? ""}
            thirdName={ranking[2]?.name || ""}
            thirdImage={ranking[2]?.image ?? ""}
          />
          <div className="flex flex-row p-4 justify-around items-center">
            <CustomButton variant="gray" label="Sair de grupo" data-cy="botao-sair" type="button" onClick={sairGrupo} />
            <CustomButton variant="borrow" label="Resetar grupo" data-cy="botao-resetar" type="button" width="w-full m-4" onClick={resetarGrupo} />
          </div>
        </div>
        <div className="flex flex-row basis-1/3">
          <div className="h-5/6 w-5/6">
            <Ranking users={ranking} />
          </div>
        </div>
      </div>
    </Layout>

  );
}