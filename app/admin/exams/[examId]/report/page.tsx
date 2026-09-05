'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Summary {
  total_attempts: string;
  average_score: string;
  highest_score: string;
  lowest_score: string;
  pass_count: string;
  fail_count: string;
}

interface CandidateResult {
  full_name: string;
  mobile_number: string;
  total_score: string;
  percentage: string;
  end_time: string;
}

export default function ExamReportPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [summary, setSummary] = useState<Summary | null>(null);
  const [candidates, setCandidates] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetch(`https://careermyntra-exam-backend.onrender.com/api/reports/exam/${examId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSummary(data.summary);
          setCandidates(data.candidates);
        } else {
          setError(data.message || 'Could not load report');
        }
      })
      .catch(() => setError('Could not reach server.'))
      .finally(() => setLoading(false));
  }, [examId, router]);

  if (loading) {
    return <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center"><p className="text-sm text-[var(--color-ink-muted)]">Loading report…</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <img src="/logo.jpeg" alt="CareerMyntra" className="h-9 w-auto" />
          <button onClick={() => router.push('/admin/dashboard')} className="text-sm text-[var(--color-primary)] font-medium">
            ← Back to dashboard
          </button>
        </div>

        <h1 className="font-display text-2xl font-bold mb-6">Exam Report</h1>

        {error && <p className="text-sm text-[var(--color-danger)] mb-4">{error}</p>}

        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 text-center">
              <p className="font-display text-xl font-bold">{summary.total_attempts}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Attempts</p>
            </div>
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 text-center">
              <p className="font-display text-xl font-bold">{summary.average_score ? parseFloat(summary.average_score).toFixed(1) : '—'}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Avg Score</p>
            </div>
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 text-center">
              <p className="font-display text-xl font-bold text-[var(--color-success)]">{summary.pass_count}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Passed</p>
            </div>
            <div className="bg-white border border-[var(--color-border)] rounded-2xl p-4 text-center">
              <p className="font-display text-xl font-bold text-[var(--color-danger)]">{summary.fail_count}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Failed</p>
            </div>
          </div>
        )}

        <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--color-border)] font-display font-bold text-sm">
            Candidate Results
          </div>
          {candidates.length === 0 ? (
            <p className="text-sm text-[var(--color-ink-muted)] p-5">No submissions yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[var(--color-ink-muted)] border-b border-[var(--color-border)]">
                  <th className="px-5 py-2 font-medium">Name</th>
                  <th className="px-5 py-2 font-medium">Mobile</th>
                  <th className="px-5 py-2 font-medium">Score</th>
                  <th className="px-5 py-2 font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, i) => (
                  <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="px-5 py-3">{c.full_name}</td>
                    <td className="px-5 py-3 text-[var(--color-ink-muted)]">{c.mobile_number}</td>
                    <td className="px-5 py-3 font-medium">{c.total_score}</td>
                    <td className="px-5 py-3">{c.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}