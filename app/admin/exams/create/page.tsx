'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateExamPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    exam_name: '', description: '', instructions: '',
    duration_minutes: 30, total_marks: 10, passing_marks: 4,
    negative_marking: false, attempt_limit: 1, is_free: true, price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('https://careermyntra-exam-backend.onrender.com/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) setError(data.message || 'Could not create exam');
      else router.push(`/admin/exams/${data.exam.exam_id}/questions`);
    } catch {
      setError('Could not reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] px-6 py-10">
      <div className="max-w-lg mx-auto bg-white border border-[var(--color-border)] rounded-2xl p-8">
        <img src="/logo.jpeg" alt="CareerMyntra" className="h-9 w-auto mb-6" />
        <h1 className="font-display text-xl font-bold mb-6">Create Exam</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Exam name</label>
            <input name="exam_name" required value={form.exam_name} onChange={handleChange}
              className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2}
              className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Instructions</label>
            <textarea name="instructions" value={form.instructions} onChange={handleChange} rows={2}
              className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Duration (min)</label>
              <input name="duration_minutes" type="number" value={form.duration_minutes} onChange={handleChange}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Total marks</label>
              <input name="total_marks" type="number" value={form.total_marks} onChange={handleChange}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1.5">Passing marks</label>
              <input name="passing_marks" type="number" value={form.passing_marks} onChange={handleChange}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium block mb-1.5">Attempt limit</label>
              <input name="attempt_limit" type="number" value={form.attempt_limit} onChange={handleChange}
                className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
            </div>
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 text-sm">
                <input name="negative_marking" type="checkbox" checked={form.negative_marking} onChange={handleChange} />
                Negative marking
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input name="is_free" type="checkbox" checked={form.is_free} onChange={handleChange} />
                Free
              </label>
            </div>
          </div>

          {!form.is_free && (
            <div>
              <label className="text-sm font-medium block mb-1.5">Price (₹)</label>
              <input name="price" type="number" min="0" step="1" value={form.price} onChange={handleChange}
                placeholder="e.g. 99"
                className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
            </div>
          )}

          {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60">
            {loading ? 'Creating…' : 'Create exam & add questions'}
          </button>
        </form>
      </div>
    </div>
  );
}