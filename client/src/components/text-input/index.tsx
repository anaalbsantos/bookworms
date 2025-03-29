import React from 'react';
import { Input } from 'components/ui/input';

interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  type?: string; // Torna opcional, pois `textarea` não usa `type`
  width?: string;
  height?: string;
  multiline?: boolean; // Permite alternar entre <input> e <textarea>
  error?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const TextInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextInputProps
>(
  (
    {
      label,
      type = 'text',
      width,
      height,
      multiline,
      error,
      errorMessage,
      icon,
      className,
      ...props
    },
    ref
  ) => {
    const divWidth = width || 'w-full';
    const divHeight = height || 'h-auto';

    return (
      <div className={`flex flex-col ${divWidth} ${divHeight}`}>
        <h2 className="text-borrow font-semibold font-nunito">{label}</h2>
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            {...props}
            className={`resize-none p-2 focus-visible:ring-neutral-400 font-nunito text-borrowDark border bg-white text-black
              ${error ? 'border-red-500' : 'border-gray'} ${className} w-full h-full`}
          />
        ) : (
          <Input
            type={type}
            ref={ref as React.Ref<HTMLInputElement>}
            icon={icon}
            {...props}
            className={`focus-visible:ring-neutral-400 font-nunito text-borrowDark border bg-white text-black
              ${error ? 'border-red-500' : 'border-gray'} ${className}`}
          />
        )}

        {error && (
          <p className="text-red-500 font-nunito font-semibold text-sm">
            *{errorMessage}
          </p>
        )}
      </div>
    );
  }
);


TextInput.displayName = 'TextInput';
