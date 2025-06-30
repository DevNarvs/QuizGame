// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import QuizPage from '@/app/quiz/dota2';

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error.message);
      }

      const session = data?.session;

      if (!session) {
        router.push('/login');
      } else {
        setUserEmail(session.user.email || '');
        setLoading(false);
      }
    };

    getSession();
  }, [router]);

  if (loading) return <div className="text-white p-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-900 text-white p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Test your knowledge and climb the leaderboard!</h1>
        <p className="mb-4">
          You are logged in as <span className="font-mono">{userEmail}</span>
        </p>

        <QuizPage />
      </div>
    </main>
  );
}
