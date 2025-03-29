'use client';
import { signIn } from 'next-auth/react';
import { useForm, SubmitHandler, type FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { CustomButton, TextInput } from 'components';
import { Worm } from 'assets';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface FormData extends FieldValues {
  emailORusername: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();

  const handleLogin: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        emailORusername: data.emailORusername,
        password: data.password
      });
      console.log(result);

      if (result?.error) {
        setError(result.error);
        return;
      }


      router.push('/Profile');
    } catch (error) {
      console.error('Failed to login');
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:flex items-end hidden md:h-screen w-full md:w-[50%] p-12 bg-borrowDark text-white text-3xl font-nunito font-thin">
        <h1>
          Transforme sua paixão por <span className="text-pink">leitura</span>{' '}
          em uma <span className="text-pink">competição</span> divertida!
        </h1>
      </div>
      <div className="flex flex-col items-center justify-center w-full md:w-[50%] bg-white h-screen p-[8%] ">
        <div className="flex flex-row w-full items-center justify-center gap-2">
          <Image src={Worm} alt="Worm" width={80} height={80} />
          <h1 className="font-sacramento text-borrow text-6xl">bookworms</h1>
        </div>
        <form
          className="flex-col w-full space-y-4"
          onSubmit={handleSubmit(async (data) => await handleLogin(data))}
        >
          <TextInput
            type="text"
            label="Email ou Username"
            {...register('emailORusername', {
              required: 'Email ou Username é obrigatório'
            })}
            error={!!errors.emailORusername}
            errorMessage={errors.emailORusername?.message}
          />
          <TextInput
            type={showPassword ? 'text' : 'password'}
            label="Senha"
            {...register('password', {
              required: 'Senha é obrigatória'
            })}
            error={!!errors.password}
            errorMessage={errors.password?.message}
            icon={
              showPassword ? (
                <EyeOff
                  width={32}
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <Eye
                  width={32}
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )
            }
          />
          {error && (
            <p className="flex justify-center w-full text-red-500 font-nunito font-semibold text-sm">
              ⚠︎ {error}
            </p>
          )}
          <CustomButton variant="borrow" label="Entrar" type="submit" />
          <p className="flex justify-center text-borrow font-nunito font-semibold ">
            Não possui conta?{' '}
            <a href="/Register" className="underline">
              Cadastre-se
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
