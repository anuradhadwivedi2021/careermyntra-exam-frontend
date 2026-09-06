'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface EvalAnswer {
  question_id: number;
  question_text: string;
  answer_text: string;
  max_marks: string;
  marks_awarded: string;
  is_evaluated: boolean;
  remarks: string | null;
}

interface AttemptInfo {
  attempt_id: number;
  exam_name: string;
  full_name: string;
  mobile_number: string;
}

export default function EvaluateAttemptPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId as string;

  const [attempt, setAttempt] = useState<AttemptInfo | null>(null);
  const [answers, setAnswers] = useState<EvalAnswer[]>([]);
  const [marksInput, setMarksInput] = useState<Record<number, string>>({});
  const [remarksInput, setRemarksInput] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetch(`https://careermyntra-exam-backend.onrender.com/api/attempts/${attemptId}/evaluate`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAttempt(data.attempt);
          setAnswers(data.answers);
          const initMarks: Record<number, string> = {};
          const initRemarks: Record<number, string> = {};
          data.answers.forEach((a: EvalAnswer) => {
            initMarks[a.question_id] = a.is_evaluated ? a.marks_awarded : '';
            initRemarks[a.question_id] = a.remarks || '';
          });
          setMarksInput(initMarks);
          setRemarksInput(initRemarks);
        } else {
          setError(data.message || 'Could not load attempt');
        }
      })
      .catch(() => setError('Could not reach server.'))
      .finally(() => setLoading(false));
  }, [attemptId, router]);

  const handleSave = async () => {
    setError('');
    setSaving(true);
    const token = localStorage.getItem('admin_token');
    const evaluations = answers.map((a) => ({
      question_id: a.question_id,
      marks_awarded: Number(marksInput[a.question_id]) || 0,
      remarks: remarksInput[a.question_id] || '',
    }));

    try {
      const res = await fetch(`https://careermyntra-exam-backend.onrender.com/api/attempts/${attemptId}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ evaluations }),
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else setError(data.message || 'Could not save evaluation');
    } catch {
      setError('Could not reach server.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center"><p className="text-sm text-[var(--color-ink-muted)]">Loading…</p></div>;

  if (done) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center px-6">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 max-w-sm text-center">
          <p className="text-sm font-semibold text-[var(--color-success)] mb-4">Evaluation saved. Score and rank updated.</p>
          <button onClick={() => router.push('/admin/evaluations')} className="text-sm text-[var(--color-primary)] font-medium">Back to evaluation queue</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <img src="/logo.jpeg" alt="CareerMyntra" className="h-9 w-auto" />
          <button onClick={() => router.push('/admin/evaluations')} className="text-sm font-medium text-[var(--color-ink-muted)] hover:underline">
            ← Back to queue
          </button>
        </div>

        <h1 className="font-display text-xl font-bold mb-1">{attempt?.full_name}</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mb-6">{attempt?.exam_name} · {attempt?.mobile_number}</p>

        {error && <p className="text-sm text-[var(--color-danger)] mb-4">{error}</p>}

        <div className="space-y-5">
          {answers.map((a, i) => (
            <div key={a.question_id} className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
              <p className="text-xs font-medium text-[var(--color-ink-muted)] mb-2">Question {i + 1} · Max {a.max_marks} marks</p>
              <p className="font-display font-semibold mb-3">{a.question_text}</p>
              <div className="bg-[#F6F8FC] border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm mb-4 whitespace-pre-wrap">
                {a.answer_text || <span className="text-[var(--color-ink-muted)]">(No answer submitted)</span>}
              </div>
              <div className="grid grid-cols-[100px_1fr] gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1">Marks</label>
                  <input type="number" min="0" max={a.max_marks} value={marksInput[a.question_id] || ''}
                    onChange={(e) => setMarksInput((prev) => ({ ...prev, [a.question_id]: e.target.value }))}
                    className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">Remarks (optional)</label>
                  <input value={remarksInput[a.question_id] || ''}
                    onChange={(e) => setRemarksInput((prev) => ({ ...prev, [a.question_id]: e.target.value }))}
                    className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleSave} disabled={saving}
          className="w-full mt-6 bg-[var(--color-primary)] text-white rounded-lg py-3 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60">
          {saving ? 'Saving…' : 'Save evaluation'}
        </button>
      </div>
    </div>
  );
}