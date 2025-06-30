'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login failed:', error.message);
      setError(error.message);
    } else {
      console.log('Login successful', data);
      router.push('/landing');
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleLogin}
        className="bg-white border border-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-center text-black">Login</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-3 py-2 text-black border border-black rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-3 py-2 text-black border border-black rounded "
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>

        <Link
          href="/login/signup"
          className="flex justify-center bg-red-600  hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
        >
          Sign Up
        </Link>
      </form>
    </main>
  );
}
