'use server';

import { redirect } from 'next/navigation';
import { createSession } from '@/lib/auth';

export async function login(prevState: string | undefined, formData: FormData) {
  const password = formData.get('password');
  if (password === process.env.ADMIN_PASSWORD) {
    await createSession();
    redirect('/admin');
  }
  return 'Invalid password. Please try again.';
}
