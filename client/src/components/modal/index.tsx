import React from 'react';
import Image from 'next/image';
import { Close } from 'assets';
import { TextInput } from 'components/text-input'; 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  showTextBox?: boolean; 
  onConfirm: () => void;
  children?: React.ReactNode;
  confirmText: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  showTextBox = false, // Valor padrão falso, ou seja, sem campo de texto
  onConfirm,
  children,
  confirmText
}) => {
  if (!isOpen) return null;

  const modalHeight = subtitle || showTextBox ? 'h-[323px]' : 'h-[254px]';

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center h-full w-full bg-black">
      <div
        className={`bg-white p-4 rounded-[30px] shadow-lg w-[641px] ${modalHeight} flex-col justify-center`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 text-center">
            <h2 className="text-[24px] text-borrowDark font-black font-nunito">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[14px] text-gray-500 mt-2">{subtitle}</p>
            )}
          </div>
          <button onClick={onClose} className="flex-shrink-0 w-8 h-8">
            <Image src={Close} alt="close" width={31} height={31} />
          </button>
        </div>

        {showTextBox && (
          <div className="mt-4 w-full flex justify-center">
            <TextInput label="Código do Grupo" type="text" width="w-[556px]" />
          </div>
        )}

        <div className="mt-4">{children}</div>
        <div className="mt-8 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray text-borrowDark rounded-[10px] w-[280px] h-[50px]"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-borrow text-white rounded-[10px] w-[280px] h-[50px]"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
