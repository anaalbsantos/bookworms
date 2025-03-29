import * as React from 'react';
import { firstBadge, secondBadge, thirdBadge, Worm } from 'assets';
import Image from 'next/image';

export interface winners {
  firstName: string;
  firstImage: string;
  secondName: string;
  secondImage: string;
  thirdName: string;
  thirdImage: string;
}

export function WinnerCard({
  firstName,
  firstImage,
  secondName,
  secondImage,
  thirdName,
  thirdImage
}: winners) {
  return (
    <div className="flex flex-col w-[670px] h-[329px] bg-white rounded-[20px] border-[#E4E4E7] border-2 overflow-hidden">
      <div className="basis-1/3 content-center place-items-center">
        <h1 className=" text-[#49423C] font-nunito font-extrabold text-[24px]">Fim da competição!</h1>
        <h1 className="text-[#484848] font-nunito text-[14px]">Confira os verdadeiros bookwormers do grupo</h1>
      </div>
      <div className="basis-1/3 content-center place-items-center">
        <div className="flex justify-around place-items-center w-[250px] h-[74px] bg-borrowMiddle rounded-[20px]">
          <Image
            src={firstImage || "/Worm.svg"}
            height={65}
            width={65}
            alt="first"
            className="rounded-full aspect-square object-cover"
          />
          <div className="space-y-2 text-center sm:text-left">
            <div className="space-y-0.5 place-self-start">
              <p className="font-nunito text-[#FFFFFF] font-bold text=[14px] ">{firstName}</p>
              <p className="font-nunito text-[#FFFFFF] text-[12px] inline-block align-top">1º lugar</p>
            </div>
          </div>
          <Image
            className="w-12 h-12"
            src={firstBadge}
            alt="winner badge"
          />
        </div>
      </div>
      <div className="basis-1/3 flex justify-evenly">
        <div className="flex justify-around place-items-center w-[250px] h-[74px] bg-borrowMiddle rounded-[20px]">
          <Image
            src={secondImage || "/Worm.svg"}
            height={65}
            width={65}
            alt="second"
            className="rounded-full aspect-square object-cover"
          />
          <div className="space-y-2 text-center sm:text-left">
            <div className="space-y-0.5 place-self-start">
              <p className="font-nunito text-[#FFFFFF] font-bold text=[14px] ">{secondName}</p>
              <p className="font-nunito text-[#FFFFFF] text-[12px] inline-block align-top">2º lugar</p>
            </div>
          </div>
          <Image
            className="w-12 h-12"
            src={secondBadge}
            alt="winner badge"
          />
        </div>
        <div className="flex justify-around place-items-center w-[250px] h-[74px] bg-borrowMiddle rounded-[20px]">
          <Image
            src={thirdImage || "/Worm.svg"}
            height={65}
            width={65}
            alt="third"
            className="rounded-full aspect-square object-cover"
          />
          <div className="space-y-2 text-center sm:text-left">
            <div className="space-y-0.5 place-self-start">
              <p className="font-nunito text-[#FFFFFF] font-bold text=[14px] ">{thirdName}</p>
              <p className="font-nunito text-[#FFFFFF] text-[12px] inline-block align-top">3º lugar</p>
            </div>
          </div>
          <Image
            className="w-12 h-12"
            src={thirdBadge}
            alt="winner badge"
          />
        </div>
      </div>
    </div >
  );
}