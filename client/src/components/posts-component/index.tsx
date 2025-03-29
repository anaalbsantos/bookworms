import Image from 'next/image';

export interface PostCardProps {
  postText: string;
  author: string;
  date: string;
  image?: string;
  handleClick?: () => void;
}

export function PostCard({
  postText,
  author,
  date,
  image,
  handleClick
}: PostCardProps) {
  return (
    <button className=" hover:bg-slate-50 rounded-[20px]" onClick={handleClick}>
      <div className="flex flex-col w-[352px] h-[410px] border-2 border-[#E4E4E7] rounded-[20px] shadow-md overflow-hidden">
        {}

        <div className="p-4">
          <h2 className="flex justify-start text-[#49423C] font-nunito font-bold text-[16px]">
            {postText}
          </h2>
          <p className="flex justify-start text-[#484848] font-nunito font-light text-[14px]">
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
    </button>
  );
}
