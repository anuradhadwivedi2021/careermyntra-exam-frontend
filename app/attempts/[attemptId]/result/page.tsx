'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ResultData {
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  unattempted_count: number;
  total_score: string;
  percentage: string;
  rank: number | null;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetch(`https://careermyntra-exam-backend.onrender.com/api/attempts/${attemptId}/result`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { if (data.success) setResult(data.result); })
      .finally(() => setLoading(false));
  }, [attemptId, router]);

  if (loading) return <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center"><p className="text-sm text-[var(--color-ink-muted)]">Loading result…</p></div>;
  if (!result) return <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center"><p className="text-sm text-[var(--color-danger)]">Could not load result.</p></div>;

  const percentage = parseFloat(result.percentage);

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center px-6 py-12">
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 max-w-md w-full">
        <img src="/logo.jpeg" alt="CareerMyntra" className="h-9 w-auto mx-auto mb-1" />
        <p className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)] text-center mb-6">Performance Report</p>

        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 mb-3">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#E4E9F2" strokeWidth="10" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-primary)" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 264} 264`} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-display text-2xl font-bold">{result.percentage}%</div>
          </div>
          <p className="text-sm text-[var(--color-ink-muted)]">Score: {result.total_score} marks</p>
          {result.rank && (
            <p className="text-sm font-semibold text-[var(--color-primary)] mt-1">Rank #{result.rank}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center">
            <p className="font-display text-xl font-bold text-[var(--color-success)]">{result.correct_count}</p>
            <p className="text-xs text-[var(--color-ink-muted)]">Correct</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-[var(--color-danger)]">{result.incorrect_count}</p>
            <p className="text-xs text-[var(--color-ink-muted)]">Incorrect</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-bold text-[var(--color-ink-muted)]">{result.unattempted_count}</p>
            <p className="text-xs text-[var(--color-ink-muted)]">Skipped</p>
          </div>
        </div>

        <button onClick={() => router.push('/exams')}
          className="w-full bg-[var(--color-primary)] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors">
          Back to exams
        </button>
      </div>
    </div>
  );
}