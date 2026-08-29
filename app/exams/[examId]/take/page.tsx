'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Option {
  option_id: number;
  option_text: string;
}

interface Question {
  question_id: number;
  question_text: string;
  marks: string;
  options: Option[];
}

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const submittedRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const init = async () => {
      try {
        const startRes = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/attempts/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ exam_id: Number(examId) }),
        });
        const startData = await startRes.json();
        if (!startData.success) {
          setError(startData.message || 'Could not start exam');
          setLoading(false);
          return;
        }
        setAttemptId(startData.attempt_id);
        setTimeLeft(startData.duration_minutes * 60);

        const qRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/questions/exam/${examId}`);
        const qData = await qRes.json();
        if (qData.success) setQuestions(qData.questions);
      } catch {
        setError('Could not reach server.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [examId, router]);

  const handleSubmit = useCallback(async () => {
    if (submittedRef.current || !attemptId) return;
    submittedRef.current = true;
    setSubmitting(true);

    const token = localStorage.getItem('token');
    const answersPayload = Object.entries(answers).map(([question_id, selected_option_id]) => ({
      question_id: Number(question_id),
      selected_option_id,
    }));

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/attempts/${attemptId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers: answersPayload }),
      });
      router.push(`/attempts/${attemptId}/result`);
    } catch {
      setError('Could not submit. Check your connection and try again.');
      submittedRef.current = false;
      setSubmitting(false);
    }
  }, [attemptId, answers, router]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => (t !== null ? t - 1 : t)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectOption = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  if (loading) {
    return <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center"><p className="text-sm text-[var(--color-ink-muted)]">Loading exam…</p></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center px-6">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 max-w-sm text-center">
          <p className="text-sm text-[var(--color-danger)] mb-4">{error}</p>
          <button onClick={() => router.push('/exams')} className="text-sm text-[var(--color-primary)] font-medium">Back to exams</button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex flex-col">
      <div className="bg-[var(--color-primary)] text-white px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="font-display font-bold text-sm sm:text-base">CAREERMYNTRA</div>
        <div className="flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5">
          <span className="text-xs uppercase tracking-wide text-white/70">Time left</span>
          <span className="font-display font-bold text-sm">{timeLeft !== null ? formatTime(timeLeft) : '--:--:--'}</span>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-6">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
          {currentQuestion ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-medium text-[var(--color-ink-muted)]">Question {currentIndex + 1} of {questions.length}</span>
                <span className="text-xs font-medium text-[var(--color-primary)]">{currentQuestion.marks} marks</span>
              </div>
              <h2 className="font-display text-lg font-semibold mb-6">{currentQuestion.question_text}</h2>

              <div className="space-y-3">
                {currentQuestion.options.map((opt, i) => {
                  const selected = answers[currentQuestion.question_id] === opt.option_id;
                  return (
                    <button
                      key={opt.option_id}
                      onClick={() => selectOption(currentQuestion.question_id, opt.option_id)}
                      className={`w-full flex items-center gap-3 text-left border-2 rounded-xl px-4 py-3 text-sm transition-colors ${
                        selected ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/40'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold shrink-0 ${
                        selected ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-[var(--color-border)] text-[var(--color-ink-muted)]'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt.option_text}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-8">
                <button onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} disabled={currentIndex === 0}
                  className="text-sm font-medium text-[var(--color-ink-muted)] disabled:opacity-40">← Previous</button>
                {currentIndex < questions.length - 1 ? (
                  <button onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                    className="bg-[var(--color-primary)] text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors">
                    Next →
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={submitting}
                    className="bg-[var(--color-success)] text-white rounded-lg px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
                    {submitting ? 'Submitting…' : 'Submit exam'}
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-[var(--color-ink-muted)]">No questions found for this exam.</p>
          )}
        </div>

        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-5 h-fit">
          <p className="text-xs font-medium text-[var(--color-ink-muted)] mb-3">{answeredCount} of {questions.length} answered</p>
          <div className="grid grid-cols-5 sm:grid-cols-4 gap-2 mb-4">
            {questions.map((q, i) => {
              const isAnswered = answers[q.question_id] !== undefined;
              const isCurrent = i === currentIndex;
              return (
                <button key={q.question_id} onClick={() => setCurrentIndex(i)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                    isCurrent ? 'bg-[var(--color-primary)] text-white' :
                    isAnswered ? 'bg-[var(--color-success)]/15 text-[var(--color-success)] border border-[var(--color-success)]/30' :
                    'bg-[#F6F8FC] text-[var(--color-ink-muted)] border border-[var(--color-border)]'
                  }`}>
                  {i + 1}
                </button>
              );
            })}
          </div>
          <button onClick={handleSubmit} disabled={submitting}
            className="w-full bg-[var(--color-primary-dark)] text-white rounded-lg py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60">
            {submitting ? 'Submitting…' : 'Submit exam'}
          </button>
        </div>
      </div>
    </div>
  );
}