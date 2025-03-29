'use client';

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/Profile');
  return (
    <div className="flex items-center justify-center h-screen w-full bg-borrow">
      <p className="font-semibold text-4xl text-white">bookworms</p>
    </div>
  );
}
