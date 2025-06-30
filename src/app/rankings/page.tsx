'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface QuizResult {
  id: string;
  username: string;
  score: number;
  total: number;
  created_at: string;
}

export default function RankingsPage() {
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const fetchRankings = async () => {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('id, username, score, total, created_at')
        .order('score', { ascending: false })
        .limit(20);

      if (error) console.error('Failed to fetch rankings:', error.message);
      if (data) setResults(data);
    };

    fetchRankings();
  }, []);

  return (
    <main className="min-h-screen  bg-zinc-950 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-zinc-900 p-6 rounded-xl w-300 h-200 max-w-xl border border-white space-y-4 shadow-xl">
        <h1 className="text-2xl font-bold text-center">🏆 Leaderboard</h1>
        <ul className="divide-y divide-zinc-700">
          {results.map((r, i) => (
            <li key={r.id} className="py-2 flex justify-between items-center">
              <span className="font-medium">
                {i + 1}. {r.username}
              </span>
              <span className="text-blue-400">
                {r.score} / {r.total}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Link
        href="/landing"
        className="bg-green-600 mt-4 text-white mr-6 px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
      >
        Go Back
      </Link>
    </main>
  );
}
