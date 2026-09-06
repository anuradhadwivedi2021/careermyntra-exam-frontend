'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PendingAttempt {
  attempt_id: number;
  exam_id: number;
  exam_name: string;
  end_time: string;
  full_name: string;
  mobile_number: string;
}

export default function EvaluationQueuePage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<PendingAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetch('https://careermyntra-exam-backend.onrender.com/api/attempts/pending-evaluation', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAttempts(data.attempts);
        else setError(data.message || 'Could not load pending evaluations');
      })
      .catch(() => setError('Could not reach server.'))
      .finally(() => setLoading(false));
  }, [router]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#F6F8FC] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <img src="/logo.jpeg" alt="CareerMyntra" className="h-9 w-auto" />
          <button onClick={() => router.push('/admin/dashboard')} className="text-sm font-medium text-[var(--color-ink-muted)] hover:underline">
            ← Back to dashboard
          </button>
        </div>

        <h1 className="font-display text-2xl font-bold mb-1">Evaluation queue</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mb-6">Subjective answers awaiting manual evaluation.</p>

        {error && <p className="text-sm text-[var(--color-danger)] mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-[var(--color-ink-muted)]">Loading…</p>
        ) : attempts.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-muted)]">Nothing pending — all subjective answers are evaluated.</p>
        ) : (
          <div className="space-y-3">
            {attempts.map((a) => (
              <div key={a.attempt_id} className="bg-white border border-[var(--color-border)] rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold mb-1">{a.full_name}</h3>
                  <div className="flex gap-4 text-xs text-[var(--color-ink-muted)]">
                    <span>{a.exam_name}</span>
                    <span>{a.mobile_number}</span>
                    <span>Submitted {formatDate(a.end_time)}</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/admin/evaluations/${a.attempt_id}`)}
                  className="bg-[var(--color-primary)] text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shrink-0"
                >
                  Evaluate →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}