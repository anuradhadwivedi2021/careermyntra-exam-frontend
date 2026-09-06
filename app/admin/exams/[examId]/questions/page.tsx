'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface OptionInput {
  option_text: string;
  is_correct: boolean;
}

export default function AddQuestionsPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [questionType, setQuestionType] = useState<'mcq' | 'subjective'>('mcq');
  const [questionText, setQuestionText] = useState('');
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState(1);
  const [explanation, setExplanation] = useState('');
  const [wordLimit, setWordLimit] = useState(200);
  const [options, setOptions] = useState<OptionInput[]>([
    { option_text: '', is_correct: true },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addedCount, setAddedCount] = useState(0);

  const updateOption = (index: number, text: string) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? { ...o, option_text: text } : o)));
  };

  const setCorrect = (index: number) => {
    setOptions((prev) => prev.map((o, i) => ({ ...o, is_correct: i === index })));
  };

  const resetForm = () => {
    setQuestionText('');
    setSubject('');
    setMarks(1);
    setExplanation('');
    setWordLimit(200);
    setOptions([
      { option_text: '', is_correct: true },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('https://careermyntra-exam-backend.onrender.com/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          exam_id: Number(examId),
          question_text: questionText,
          subject,
          marks,
          explanation,
          question_type: questionType,
          word_limit: questionType === 'subjective' ? wordLimit : undefined,
          options: questionType === 'mcq' ? options : undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) setError(data.message || 'Could not add question');
      else {
        setAddedCount((c) => c + 1);
        resetForm();
      }
    } catch {
      setError('Could not reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] px-6 py-10">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <img src="/logo.jpeg" alt="CareerMyntra" className="h-9 w-auto" />
          <button onClick={() => router.push('/admin/dashboard')} className="text-sm text-[var(--color-primary)] font-medium">
            Done, back to dashboard
          </button>
        </div>

        <h1 className="font-display text-xl font-bold mb-1">Add Questions</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mb-6">{addedCount} question{addedCount !== 1 ? 's' : ''} added so far.</p>

        <div className="flex gap-2 mb-4">
          <button type="button" onClick={() => setQuestionType('mcq')}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold border transition-colors ${questionType === 'mcq' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white text-[var(--color-ink-muted)] border-[var(--color-border)]'}`}>
            MCQ
          </button>
          <button type="button" onClick={() => setQuestionType('subjective')}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold border transition-colors ${questionType === 'subjective' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]' : 'bg-white text-[var(--color-ink-muted)] border-[var(--color-border)]'}`}>
            Subjective
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[var(--color-border)] rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Question</label>
            <textarea required value={questionText} onChange={(e) => setQuestionText(e.target.value)} rows={2}
              className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Marks</label>
              <input type="number" value={marks} onChange={(e) => setMarks(Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
            </div>
          </div>

          {questionType === 'mcq' ? (
            <div>
              <label className="text-sm font-medium block mb-2">Options (select the correct one)</label>
              <div className="space-y-2">
                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input type="radio" name="correct" checked={opt.is_correct} onChange={() => setCorrect(i)} />
                    <input required value={opt.option_text} onChange={(e) => updateOption(i, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      className="flex-1 rounded-lg border border-[var(--color-border)] px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium block mb-1.5">Word limit for candidate&apos;s answer</label>
              <input type="number" value={wordLimit} onChange={(e) => setWordLimit(Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
              <p className="text-xs text-[var(--color-ink-muted)] mt-1.5">This answer will need to be manually evaluated after submission.</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-1.5">
              {questionType === 'mcq' ? 'Explanation (optional)' : 'Evaluation guidance for admin (optional)'}
            </label>
            <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} rows={2}
              className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
          </div>

          {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60">
            {loading ? 'Adding…' : 'Add question & continue'}
          </button>
        </form>
      </div>
    </div>
  );
}