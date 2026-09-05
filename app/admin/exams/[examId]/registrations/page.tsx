'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Registration {
  registration_id: number;
  registered_at: string;
  candidate_id: number;
  full_name: string;
  mobile_number: string;
  email: string;
}

interface Exam {
  exam_name: string;
}

export default function ExamRegistrationsPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    Promise.all([
      fetch(`https://careermyntra-exam-backend.onrender.com/api/exams/${examId}`).then((res) => res.json()),
      fetch(`https://careermyntra-exam-backend.onrender.com/api/registrations/exam/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => res.json()),
    ])
      .then(([examData, regData]) => {
        if (examData.success) setExam(examData.exam);
        if (regData.success) setRegistrations(regData.registrations);
        else setError(regData.message || 'Could not load registrations');
      })
      .catch(() => setError('Could not reach server.'))
      .finally(() => setLoading(false));
  }, [examId, router]);

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

        <h1 className="font-display text-2xl font-bold mb-1">Registered candidates</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mb-6">{exam?.exam_name}</p>

        {error && <p className="text-sm text-[var(--color-danger)] mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-[var(--color-ink-muted)]">Loading…</p>
        ) : registrations.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-muted)]">No candidates have registered for this exam yet.</p>
        ) : (
          <>
            <p className="text-sm font-medium mb-3">{registrations.length} registered</p>
            <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-ink-muted)]">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Mobile</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Registered on</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r) => (
                    <tr key={r.registration_id} className="border-b border-[var(--color-border)] last:border-0">
                      <td className="px-5 py-3 font-medium">{r.full_name}</td>
                      <td className="px-5 py-3 text-[var(--color-ink-muted)]">{r.mobile_number}</td>
                      <td className="px-5 py-3 text-[var(--color-ink-muted)]">{r.email || '—'}</td>
                      <td className="px-5 py-3 text-[var(--color-ink-muted)]">{formatDate(r.registered_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}