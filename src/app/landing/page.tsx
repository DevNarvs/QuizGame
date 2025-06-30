'use client';

import Link from 'next/link';
import LogoutButton from '../components/LogoutButton';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-6">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">🧠 Welcome to the DevNarvs Quiz</h1>
        <p className="text-zinc-400 text-lg">Test your knowledge and climb the leaderboard!</p>

        <div className="flex gap-6 justify-center mt-8">
          <Link
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
          >
            🚀 Developer Quiz
          </Link>
          <Link
            href="/dashboard/nursing"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
          >
            🚀 Nursing Quiz
          </Link>
          <Link
            href="/dashboard/dota2"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
          >
            🚀 Dota2 Quiz
          </Link>
          <Link
            href="/dashboard/mlbb"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
          >
            🚀 MLBB Quiz
          </Link>
        </div>
        <div className="flex gap-6 justify-center mt-8">
          <Link
            href="/rankings"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg transition"
          >
            🏆 View Rankings
          </Link>
        </div>

        <div className="flex gap-6 justify-center mt-8">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
