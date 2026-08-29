'use client';

import { useState, useRef } from 'react';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ full_name: '', mobile_number: '', email: '', password: '' });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) setError(data.message || 'Registration failed');
      else setStep(2);
    } catch {
      setError('Could not reach server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputsRef.current[index - 1]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile_number: form.mobile_number, otp: otp.join('') }),
      });
      const data = await res.json();
      if (!data.success) setError(data.message || 'Verification failed');
      else window.location.href = '/login';
    } catch {
      setError('Could not reach server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[42%] relative bg-[var(--color-primary)] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_45%)]" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <img src="/logo.jpeg" alt="CareerMyntra" className="h-10 w-auto" />
            <div className="text-sm text-white/70 mt-1">Career Guidance · Assessment · Training</div>
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold leading-tight mb-4">Every attempt<br />builds your score.</h1>
            <p className="text-white/75 max-w-xs text-sm leading-relaxed">
              Register once, take mock tests, aptitude assessments and coding rounds — all under one CareerMyntra account.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 w-full max-w-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-wide text-white/60">Performance Report</span>
              <span className="text-xs text-[var(--color-accent)] font-semibold">92%</span>
            </div>
            {[85, 60, 95, 40].map((w, i) => (
              <div key={i} className="h-1.5 rounded-full bg-white/15 mb-2 overflow-hidden">
                <div className="h-full rounded-full bg-[var(--color-accent)]" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F6F8FC]">
        <div className="w-full max-w-sm">
          <img src="/logo.jpeg" alt="CareerMyntra" className="lg:hidden h-8 w-auto mb-8" />

          <div className="flex items-center gap-2 mb-8 text-xs font-medium text-[var(--color-ink-muted)]">
            <span className={step === 1 ? 'text-[var(--color-primary)]' : ''}>Register</span>
            <span className="w-6 h-px bg-[var(--color-border)]" />
            <span className={step === 2 ? 'text-[var(--color-primary)]' : ''}>Verify mobile</span>
          </div>

          {step === 1 ? (
            <>
              <h2 className="font-display text-2xl font-bold mb-1">Create your account</h2>
              <p className="text-sm text-[var(--color-ink-muted)] mb-6">Takes less than a minute.</p>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Full name</label>
                  <input name="full_name" required value={form.full_name} onChange={handleChange}
                    placeholder="Anuradha Dwivedi"
                    className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Mobile number</label>
                  <input name="mobile_number" required value={form.mobile_number} onChange={handleChange}
                    placeholder="98765 43210"
                    className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Email (optional)</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Password</label>
                  <input name="password" type="password" required minLength={6} value={form.password} onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full rounded-lg border border-[var(--color-border)] px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]" />
                </div>

                {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}

                <button type="submit" disabled={loading}
                  className="w-full bg-[var(--color-primary)] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60">
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </form>

              <p className="text-sm text-[var(--color-ink-muted)] mt-6 text-center">
                Already registered? <a href="/login" className="text-[var(--color-primary)] font-medium">Log in</a>
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold mb-1">Verify your number</h2>
              <p className="text-sm text-[var(--color-ink-muted)] mb-6">
                Enter the 6-digit code sent to <span className="font-medium text-[var(--color-ink)]">{form.mobile_number}</span>
              </p>

              <form onSubmit={handleVerify}>
                <div className="flex gap-2.5 mb-6">
                  {otp.map((digit, i) => (
                    <input key={i} ref={(el) => { inputsRef.current[i] = el; }} value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      maxLength={1} inputMode="numeric"
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold rounded-full border-2 border-[var(--color-border)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20" />
                  ))}
                </div>

                {error && <p className="text-sm text-[var(--color-danger)] mb-4">{error}</p>}

                <button type="submit" disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-[var(--color-primary)] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60">
                  {loading ? 'Verifying…' : 'Verify & continue'}
                </button>
              </form>

              <p className="text-xs text-[var(--color-ink-muted)] mt-4 text-center">
                For now, check your backend terminal for the OTP.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}





 



