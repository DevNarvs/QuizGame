// app/quiz/page.tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(25);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase.from('mlbb_quiz_questions').select('*');
      if (!error && data) {
        const shuffled = shuffleArray(data).slice(0, 20);
        setQuestions(shuffled);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timer === 0) handleNext();
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, current]);

  const handleNext = useCallback(() => {
    if (selected === questions[current]?.answer) {
      setScore((prev) => prev + 1);
    }
    setSelected(null);
    setTimer(20);
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  }, [selected, questions, current]);

  if (!questions.length) return <p className="text-center p-4">Loading questions...</p>;
  if (showResult) return <Result score={score} total={questions.length} questions={questions} />;

  const q = questions[current];

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white rounded-xl shadow-xl p-6 w-300 h-110 space-y-4">
        <h2 className="text-xl font-bold">
          Question {current + 1} of {questions.length}
        </h2>
        <p className="text-lg">{q.question}</p>
        <ul className="space-y-2">
          {q.options.map((opt, idx) => (
            <li key={idx}>
              <button
                className={`w-full px-6 py-4 border rounded hover:bg-zinc-800 transition ${
                  selected === opt ? 'bg-blue-600' : 'bg-zinc-700 cursor-pointer'
                }`}
                onClick={() => setSelected(opt)}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-400">Time left: {timer}s</span>
          <button
            onClick={handleNext}
            disabled={!selected}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white cursor-pointer"
          >
            {current + 1 === questions.length ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </main>
  );
}

function Result({
  score,
  total,
  questions,
}: {
  score: number;
  total: number;
  questions: Question[];
}) {
  const [submitted, setSubmitted] = useState(false);
  const [username, setUsername] = useState('');
  const hasSavedRef = useRef(false);

  useEffect(() => {
    const saveResult = async () => {
      if (hasSavedRef.current) return;
      hasSavedRef.current = true;

      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id;
      const userEmail = user?.email ?? 'Anonymous';

      setUsername(userEmail);

      const { error } = await supabase.from('quiz_results').insert({
        user_id: userId,
        username: userEmail,
        score,
        total,
        quizType: 'MLBB',
      });

      if (error) {
        console.error('Failed to save result:', error.message);
      } else {
        setSubmitted(true);
      }
    };

    saveResult();
  }, [score, total]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-xl shadow-xl p-6 w-180 h-120 space-y-4">
        <h1 className="text-2xl font-bold mb-4">✅ Quiz Complete</h1>
        <p className="mb-2">
          Your Score: {score} / {total}
        </p>

        {submitted ? (
          <p className="text-green-400">✅ Result saved for: {username}</p>
        ) : (
          <p className="text-yellow-400">⏳ Saving your result...</p>
        )}

        <h2 className="font-semibold text-lg mt-4 mb-2">Review:</h2>
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {questions.map((q, i) => (
            <li key={q.id} className="text-sm">
              <span className="font-medium">Q{i + 1}:</span> {q.question} <br />
              <span className="text-green-500">Answer: {q.answer}</span>
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
    </div>
  );
}
