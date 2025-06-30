'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { randomUUID } from 'crypto';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Step 1: Register user in Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const user = authData.user;

    if (!user) {
      setError('Signup succeeded, but user is not confirmed yet.');
      setLoading(false);
      return;
    }

    // Step 2: Insert additional profile info into "users" table
    const { error: insertError } = await supabase.from('tbl_users').insert([
      {
        id: randomUUID,
        username,
        fullname,
        email,
      },
    ]);

    if (insertError) {
      setError('Signup succeeded but failed to save profile: ' + insertError.message);
    } else {
      setSuccess('✅ Signup complete! Please check your email to verify.');
      setTimeout(() => router.push('/'), 200);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSignUp}
        className="bg-black border border-white p-6 rounded-lg shadow-md space-y-4 w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-center text-white">Sign Up</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Full Name"
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-3 py-2 border rounded"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          {loading ? 'Signing up…' : 'Sign Up'}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => router.push('/login')}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          Go back
        </button>
      </form>
    </main>
  );
}
