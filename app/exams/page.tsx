'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Exam {
  exam_id: number;
  exam_name: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  is_free: boolean;
}

export default function ExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<number>>(new Set());
  const [registeringId, setRegisteringId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    Promise.all([
      fetch('https://careermyntra-exam-backend.onrender.com/api/exams').then((res) => res.json()),
      fetch('https://careermyntra-exam-backend.onrender.com/api/registrations/my', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([examData, regData]) => {
        if (examData.success) setExams(examData.exams);
        if (regData.success) {
          setRegisteredIds(new Set(regData.registrations.map((r: { exam_id: number }) => r.exam_id)));
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleRegister = async (examId: number) => {
    setError('');
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
      } else {
        setError(data.message || 'Could not register for this exam');
      }
    } catch {
      setError('Could not reach server. Try again.');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <img src="/logo.jpeg" alt="CareerMyntra" className="h-7 w-auto brightness-0 invert" />
        <h1 className="font-display text-2xl font-bold mb-6">Available exams</h1>

        {error && <p className="text-sm text-[var(--color-danger)] mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-[var(--color-ink-muted)]">Loading exams…</p>
        ) : exams.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-muted)]">No exams available right now.</p>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => {
              const isRegistered = registeredIds.has(exam.exam_id);
              const isRegistering = registeringId === exam.exam_id;
              return (
                <div key={exam.exam_id} className="bg-white border border-[var(--color-border)] rounded-2xl p-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-lg font-bold mb-1">{exam.exam_name}</h2>
                    <p className="text-sm text-[var(--color-ink-muted)] mb-2">{exam.description}</p>
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
      </div>
    </div>
  );
}