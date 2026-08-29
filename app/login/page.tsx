'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [form, setForm] = useState({ mobile_number: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) setError(data.message || 'Login failed');
      else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('candidate', JSON.stringify(data.candidate));
        window.location.href = '/dashboard';
      }
    } catch {
      setError('Could not reach server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[42%] relative bg-[var(--color-primary)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_45%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <img src="/logo.jpeg" alt="CareerMyntra" className="h-10 w-auto" />
            <div className="text-sm text-white/70 mt-1">Career Guidance · Assessment · Training</div>
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight mb-4">Welcome back.<br />Let's see your rank.</h1>
            <p className="text-white/75 max-w-xs text-sm leading-relaxed">
              Pick up where you left off — upcoming exams, past scores and detailed reports.
            </p>
          </div>
          <div />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F6F8FC]">
        <div className="w-full max-w-sm">
          <img src="/logo.jpeg" alt="CareerMyntra" className="lg:hidden h-8 w-auto mb-8" />

          <h2 className="font-display text-2xl font-bold mb-1">Log in</h2>
          <p className="text-sm text-[var(--color-ink-muted)] mb-6">Enter your mobile number and password.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">Mobile number</label>
              <input name="mobile_number" required value={form.mobile_number} onChange={handleChange}
                placeholder="98765 43210"
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

          <p className="text-sm text-[var(--color-ink-muted)] mt-6 text-center">
            New here? <a href="/register" className="text-[var(--color-primary)] font-medium">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}


