'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface ExamDetails {
  exam_id: number;
  exam_name: string;
  description: string | null;
  instructions: string | null;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number | null;
  negative_marking: boolean;
  negative_marks_per_question: string;
  attempt_limit: number;
  is_free: boolean;
  price: string | number;
}

export default function ExamInstructionsPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [exam, setExam] = useState<ExamDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetch(`https://careermyntra-exam-backend.onrender.com/api/exams/${examId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setExam(data.exam);
        else setError(data.message || 'Could not load exam');
      })
      .catch(() => setError('Could not reach server.'))
      .finally(() => setLoading(false));
  }, [examId, router]);

  if (loading) {
    return <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center"><p className="text-sm text-[var(--color-ink-muted)]">Loading…</p></div>;
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center px-6">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 max-w-sm text-center">
          <p className="text-sm text-[var(--color-danger)] mb-4">{error || 'Exam not found.'}</p>
          <button onClick={() => router.push('/exams')} className="text-sm text-[var(--color-primary)] font-medium">Back to exams</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] px-6 py-10">
      <div className="max-w-xl mx-auto">
        <img src="/logo.jpeg" alt="CareerMyntra" className="h-9 w-auto mb-6" />

        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 sm:p-8">
          <p className="text-xs uppercase tracking-wide text-[var(--color-ink-muted)] mb-1">Exam Instructions</p>
          <h1 className="font-display text-2xl font-bold mb-2">{exam.exam_name}</h1>
          {exam.description && <p className="text-sm text-[var(--color-ink-muted)] mb-6">{exam.description}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-[#F6F8FC] rounded-xl p-3 text-center">
              <p className="font-display text-lg font-bold">{exam.duration_minutes}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Minutes</p>
            </div>
            <div className="bg-[#F6F8FC] rounded-xl p-3 text-center">
              <p className="font-display text-lg font-bold">{exam.total_marks}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Total marks</p>
            </div>
            <div className="bg-[#F6F8FC] rounded-xl p-3 text-center">
              <p className="font-display text-lg font-bold">{exam.passing_marks ?? '—'}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Passing marks</p>
            </div>
            <div className="bg-[#F6F8FC] rounded-xl p-3 text-center">
              <p className="font-display text-lg font-bold">{exam.attempt_limit}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">Attempt{exam.attempt_limit !== 1 ? 's' : ''} allowed</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2">Please read before you begin</h2>
            <ul className="text-sm text-[var(--color-ink-muted)] space-y-1.5 list-disc list-inside">
              <li>The exam has a fixed duration of {exam.duration_minutes} minutes. It will auto-submit when time runs out.</li>
              <li>Do not refresh or close this tab once the exam has started — your answers are saved as you go, but the timer will keep running in the background.</li>
              {exam.negative_marking && (
                <li>Negative marking is applicable: {exam.negative_marks_per_question} marks will be deducted for each wrong answer.</li>
              )}
              <li>You can navigate between questions and change your answers any time before submitting.</li>
              <li>Once submitted, the exam cannot be reopened.</li>
            </ul>
          </div>

          {exam.instructions && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-2">Exam-specific instructions</h2>
              <p className="text-sm text-[var(--color-ink-muted)] whitespace-pre-wrap">{exam.instructions}</p>
            </div>
          )}

          <label className="flex items-start gap-2.5 mb-6 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5" />
            <span className="text-sm">I have read and understood the instructions above, and I am ready to begin the exam.</span>
          </label>

          <div className="flex items-center justify-between gap-3">
            <button onClick={() => router.push('/exams')} className="text-sm font-medium text-[var(--color-ink-muted)] hover:underline">
              ← Back to exams
            </button>
            <button
              onClick={() => router.push(`/exams/${examId}/take`)}
              disabled={!agreed}
              className="bg-[var(--color-primary)] text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Start exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}