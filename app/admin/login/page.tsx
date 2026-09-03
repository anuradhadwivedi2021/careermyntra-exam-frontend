'use client';

import { useState } from 'react';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('https://careermyntra-exam-backend.onrender.com/api/admin-auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) setError(data.message || 'Login failed');
      else {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        window.location.href = '/admin/dashboard';
      }
    } catch {
      setError('Could not reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-[var(--color-border)] rounded-2xl p-8">
        <img src="/logo.jpeg" alt="CareerMyntra" className="h-10 w-auto mx-auto mb-6" />
        <h2 className="font-display text-xl font-bold mb-1 text-center">Admin Login</h2>
        <p className="text-sm text-[var(--color-ink-muted)] mb-6 text-center">Manage exams and questions.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Email</label>
            <input name="email" type="email" required value={form.email} onChange={handleChange}
              placeholder="admin@careermyntra.com"
              className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Password</label>
            <input name="password" type="password" required value={form.password} onChange={handleChange}
              placeholder="Your password"
              className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
          </div>

          {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60">
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}