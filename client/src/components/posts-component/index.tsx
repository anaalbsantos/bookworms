import Image from 'next/image';

export interface PostCardProps {
  postText: string;
  author: string;
  date: string;
  image?: string;
}

export function PostCard({ postText, author, date, image }: PostCardProps) {
  return (
    <div className="flex flex-col w-[352px] h-[410px] bg-white rounded-lg shadow-md overflow-hidden">
      {}
      <div className="p-4">
        <h2 className="text-[#49423C] font-nunito font-bold text-[16px]">
          {postText}
        </h2>
        <p className="text-[#484848] font-nunito font-light text-[14px]">
          by {author}
        </p>
      </div>

      {}
      <div className="relative w-full h-[280px]">
        <Image
          src={image || '/default-image.png'}
          alt="group-cover"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {}
      <div className="pt-7 pb-2 pr-2">
        <p className="text-[#484848] font-nunito font-light text-[14px] text-right">
          {date}
        </p>
      </div>
    </div>
  );
}
