'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Exam {
  exam_id: number;
  exam_name: string;
  duration_minutes: number;
  total_marks: number;
  status: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetch('https://careermyntra-exam-backend.onrender.com/api/exams')
      .then((res) => res.json())
      .then((data) => { if (data.success) setExams(data.exams); })
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F6F8FC] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <img src="/logo.jpeg" alt="CareerMyntra" className="h-9 w-auto" />
          <button
            onClick={() => router.push('/admin/exams/create')}
            className="bg-[var(--color-primary)] text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            + Create Exam
          </button>
        </div>

        <h1 className="font-display text-2xl font-bold mb-6">All exams</h1>

        {loading ? (
          <p className="text-sm text-[var(--color-ink-muted)]">Loading…</p>
        ) : exams.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-muted)]">No exams yet. Create your first one.</p>
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => (
              <div key={exam.exam_id} className="bg-white border border-[var(--color-border)] rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h2 className="font-display font-bold mb-1">{exam.exam_name}</h2>
                  <div className="flex gap-4 text-xs text-[var(--color-ink-muted)]">
                    <span>{exam.duration_minutes} min</span>
                    <span>{exam.total_marks} marks</span>
                    <span className="text-[var(--color-success)]">{exam.status}</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/admin/exams/${exam.exam_id}/questions`)}
                  className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                  Manage questions →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}