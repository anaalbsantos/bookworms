import React from 'react';
import Image from 'next/image';
import { Arrow } from 'assets';

interface PageTitleProps {
  title: string;
  showBackButton: boolean;
  onBackClick?: () => void; // Adicione esta nova prop
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  showBackButton,
  onBackClick
}) => {
  return (
    <div
      className={`w-full h-auto flex items-center gap-2 ${
        showBackButton ? 'p-4' : 'p-7'
      } rounded-3xl  border border-gray`}
    >
      {showBackButton && (
        <button
          onClick={onBackClick}
          className="px-4 py-2 text-white rounded-md cursor-pointer"
        >
          <Image src={Arrow} alt="arrow" />
        </button>
      )}
      <h1 className="text-xl font-black font-nunito text-borrowDark m-0">
        {title}
      </h1>
    </div>
  );
};

export default PageTitle;
