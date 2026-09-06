'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Candidate {
  candidate_id: number;
  full_name: string;
  mobile_number: string;
  email: string;
}

interface Exam {
  exam_id: number;
  exam_name: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  is_free: boolean;
}

interface Attempt {
  exam_name: string;
  attempt_id: number;
  total_score: string | null;
  percentage: string | null;
  status: string;
  start_time: string;
  end_time: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<number>>(new Set());
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loadingExams, setLoadingExams] = useState(true);
  const [loadingAttempts, setLoadingAttempts] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('candidate');
    const token = localStorage.getItem('token');
    if (!stored || !token) {
      router.push('/login');
      return;
    }
    const parsed: Candidate = JSON.parse(stored);
    setCandidate(parsed);

    Promise.all([
      fetch('https://careermyntra-exam-backend.onrender.com/api/exams').then((res) => res.json()),
      fetch('https://careermyntra-exam-backend.onrender.com/api/registrations/my', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([examData, regData]) => {
        if (examData.success) setExams(examData.exams.slice(0, 3));
        if (regData.success) {
          setRegisteredIds(new Set(regData.registrations.map((r: { exam_id: number }) => r.exam_id)));
        }
      })
      .finally(() => setLoadingExams(false));

    fetch(`https://careermyntra-exam-backend.onrender.com/api/reports/student/${parsed.candidate_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { if (data.success) setAttempts(data.attempts); })
      .finally(() => setLoadingAttempts(false));
  }, [router]);

  const handleRegister = async (examId: number) => {
    setRegisteringId(examId);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('https://careermyntra-exam-backend.onrender.com/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ exam_id: examId }),
      });
      const data = await res.json();
      if (data.success) {
        setRegisteredIds((prev) => new Set(prev).add(examId));
      }
    } finally {
      setRegisteringId(null);
    }
  };

  const submitted = attempts.filter((a) => a.status === 'submitted' && a.percentage !== null);
  const totalAttempts = attempts.length;
  const avgPercentage = submitted.length
    ? (submitted.reduce((sum, a) => sum + parseFloat(a.percentage as string), 0) / submitted.length).toFixed(1)
    : null;
  const bestScore = submitted.length
    ? Math.max(...submitted.map((a) => parseFloat(a.percentage as string))).toFixed(1)
    : null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const statusLabel = (status: string) => {
    if (status === 'submitted') return { text: 'Completed', className: 'text-[var(--color-success)]' };
    if (status === 'in_progress') return { text: 'In progress', className: 'text-[var(--color-accent)]' };
    return { text: 'Auto-submitted', className: 'text-[var(--color-ink-muted)]' };
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('candidate');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <img src="/logo.jpeg" alt="CareerMyntra" className="h-9 w-auto" />
          <button onClick={handleLogout} className="text-sm font-medium text-[var(--color-ink-muted)] hover:underline">
            Log out
          </button>
        </div>

        {/* Profile + summary */}
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold mb-1">
              Welcome{candidate ? `, ${candidate.full_name}` : ''} 👋
            </h1>
            <p className="text-sm text-[var(--color-ink-muted)]">
              {candidate?.mobile_number}{candidate?.email ? ` · ${candidate.email}` : ''}
            </p>
          </div>
          <div className="flex gap-6 shrink-0">
            <div className="text-center">
              <p className="font-display text-xl font-bold">{totalAttempts}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Attempts</p>
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-bold">{avgPercentage !== null ? `${avgPercentage}%` : '—'}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Average</p>
            </div>
            <div className="text-center">
              <p className="font-display text-xl font-bold text-[var(--color-success)]">{bestScore !== null ? `${bestScore}%` : '—'}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Best</p>
            </div>
          </div>
        </div>

        {/* Available exams */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold">Available exams</h2>
          <a href="/exams" className="text-sm font-medium text-[var(--color-primary)] hover:underline">See all →</a>
        </div>
        {loadingExams ? (
          <p className="text-sm text-[var(--color-ink-muted)] mb-8">Loading…</p>
        ) : exams.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-muted)] mb-8">No exams available right now.</p>
        ) : (
          <div className="space-y-3 mb-8">
            {exams.map((exam) => {
              const isRegistered = registeredIds.has(exam.exam_id);
              const isRegistering = registeringId === exam.exam_id;
              return (
                <div key={exam.exam_id} className="bg-white border border-[var(--color-border)] rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold mb-1">{exam.exam_name}</h3>
                    <div className="flex gap-4 text-xs text-[var(--color-ink-muted)]">
                      <span>{exam.duration_minutes} min</span>
                      <span>{exam.total_marks} marks</span>
                      <span className={exam.is_free ? 'text-[var(--color-success)]' : ''}>{exam.is_free ? 'Free' : 'Paid'}</span>
                      {isRegistered && <span className="text-[var(--color-success)]">Registered</span>}
                    </div>
                  </div>
                  {isRegistered ? (
                    <button
                      onClick={() => router.push(`/exams/${exam.exam_id}/take`)}
                      className="bg-[var(--color-primary)] text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors shrink-0"
                    >
                      Start exam
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(exam.exam_id)}
                      disabled={isRegistering}
                      className="bg-[var(--color-primary-dark)] text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 shrink-0"
                    >
                      {isRegistering ? 'Registering…' : 'Register'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Attempt history */}
        <h2 className="font-display text-lg font-bold mb-3">My attempts</h2>
        {loadingAttempts ? (
          <p className="text-sm text-[var(--color-ink-muted)]">Loading…</p>
        ) : attempts.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-muted)]">You haven&apos;t attempted any exams yet.</p>
        ) : (
          <div className="space-y-3">
            {attempts.map((a) => {
              const s = statusLabel(a.status);
              return (
                <div key={a.attempt_id} className="bg-white border border-[var(--color-border)] rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold mb-1">{a.exam_name}</h3>
                    <div className="flex gap-4 text-xs text-[var(--color-ink-muted)]">
                      <span>{formatDate(a.start_time)}</span>
                      <span className={s.className}>{s.text}</span>
                      {a.percentage !== null && <span>{a.percentage}%</span>}
                    </div>
                  </div>
                  {a.status === 'submitted' ? (
                    <button
                      onClick={() => router.push(`/attempts/${a.attempt_id}/result`)}
                      className="text-sm font-medium text-[var(--color-primary)] hover:underline shrink-0"
                    >
                      View result →
                    </button>
                  ) : (
                    <span className="text-sm text-[var(--color-ink-muted)] shrink-0">—</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}