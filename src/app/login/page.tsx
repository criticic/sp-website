'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { FaKey } from 'react-icons/fa';
import { login } from '@/lib/actions';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-accent hover:bg-primary hover:text-dark disabled:bg-gray-400"
      disabled={pending}
    >
      {pending ? 'Logging in...' : 'Login'}
    </button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(login, undefined);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-accent">Admin Panel</h1>
          <p className="text-gray-500">Please enter your password to continue</p>
        </div>
        <form action={dispatch} className="space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                id="password"
                required
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-accent focus:border-accent"
                placeholder="Password"
              />
            </div>
          </div>
          {errorMessage && (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          )}
          <LoginButton />
        </form>
      </div>
    </main>
  );
}