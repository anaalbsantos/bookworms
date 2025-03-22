import React from 'react';
import Image from 'next/image';
import { Arrow } from 'assets';

interface PageTitleProps {
    title: string;
    showBackButton: boolean;
}

const PageTitle: React.FC<PageTitleProps> = ({ title, showBackButton }) => {
    return(
        <div  className={`w-[870px] h-[75px] flex items-center gap-2 ${
            showBackButton ? 'p-4' : 'p-7'
          } rounded-lg max-w-3xl mx-auto border rounded-[20px] border-gray`}
        >
            {showBackButton && (
                <button className="px-4 py-2 text-white rounded-md cursor-pointer">
                    <Image
                        src={Arrow}  
                        alt="arrow"  
                  />
                </button>    
            )}
             <h1 className="text-2xl font-black font-nunito text-borrowDark m-0">{title}</h1>
        </div>
    );
};

export default PageTitle;
