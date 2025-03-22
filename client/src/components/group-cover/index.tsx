import * as React from 'react';
import Image from 'next/image';

export interface GroupCoverProps {
  name: string;
  date: string;
  type: string;
  image: string
}

export function GroupCover({name, date, type, image}: GroupCoverProps) {
  return (
    <div className="flex flex-col w-[870px] h-[250px] bg-[#FFFFF] rounded-[20px] border-[#E4E4E7] border-2 overflow-hidden">
      <div className="relative w-full h-[120px]">
        <Image
          src={image}
          alt="group-cover"
          layout="fill"
          objectFit="cover"
        />
      </div>
        <div className='ml-6 mt-3'>
          <h1 className= 'text-[#49423C] font-extrabold text-[24px] font-nunito'>{name}</h1>
          <h1 className='text-[#484848] font-normal text-[16px] font-nunito'>{date}</h1>
          <p className='text-[#484848] font-normal text-[16px] font-nunito bg-red-100 h-[34px] w-[138.68px] rounded-[20px] flex items-center justify-center mt-1'>{type}</p>
        </div>
    </div>
  );
}

