'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { FaKey } from 'react-icons/fa';
import { login } from '@/lib/actions';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="w-full py-3 bg-ink text-white text-sm font-body font-medium hover:bg-gold hover:text-ink transition-colors disabled:opacity-50"
      disabled={pending}
    >
      {pending ? 'Logging in...' : 'Login'}
    </button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(login, undefined);

  return (
    <main className="flex items-center justify-center min-h-screen bg-parchment">
      <div className="w-full max-w-sm p-8 bg-light-parchment border border-slate/10">
        <div className="text-center mb-8">
          <p className="font-mono text-xs text-gold tracking-[0.2em] uppercase mb-2">Admin</p>
          <h1 className="text-2xl">Panel</h1>
          <div className="rostrum-rule my-4 justify-center">◆</div>
          <p className="text-sm text-slate font-body">Enter your password to continue</p>
        </div>
        <form action={dispatch} className="space-y-6">
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate/40" />
              <input
                type="password"
                name="password"
                id="password"
                required
                className="w-full pl-10 pr-3 py-3 bg-white border border-slate/20 text-ink font-body text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="Password"
              />
            </div>
          </div>
          {errorMessage && (
            <div className="text-red-400 text-xs font-mono text-center">{errorMessage}</div>
          )}
          <LoginButton />
        </form>
      </div>
    </main>
  );
}
