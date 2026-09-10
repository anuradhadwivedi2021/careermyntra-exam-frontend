import Link from 'next/link';

const plans = [
  {
    name: 'Free Test',
    price: '₹0',
    blurb: 'One full-length mock test to see how the platform works.',
    features: ['1 free exam attempt', 'Basic performance report', 'No card required'],
  },
  {
    name: 'Individual Test',
    price: '₹99',
    blurb: 'Pay per exam — ideal if you only need one or two assessments.',
    features: ['Any single exam', 'Full performance report', 'Unlimited attempts on that exam'],
    highlighted: true,
  },
  {
    name: 'Test Series',
    price: '₹499',
    blurb: 'A full series with detailed, question-wise performance reports.',
    features: ['Full exam series access', 'Question-wise analysis', 'Priority support'],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><img src="/logo.jpeg" alt="CareerMyntra" className="h-8 w-auto" /></Link>
          <Link href="/" className="text-sm font-medium text-[var(--color-primary)]">← Back to home</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl font-bold mb-3 text-center">Simple, transparent pricing</h1>
        <p className="text-[var(--color-ink-muted)] mb-12 text-center max-w-lg mx-auto">
          Start free. Upgrade only when you need a full test series or detailed reports.
        </p>

        <div className="grid sm:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl border p-6 ${
                plan.highlighted ? 'border-[var(--color-primary)] shadow-lg' : 'border-[var(--color-border)]'
              }`}
            >
              <p className="text-sm font-semibold text-[var(--color-ink-muted)] mb-1">{plan.name}</p>
              <p className="font-display text-3xl font-bold mb-3">{plan.price}</p>
              <p className="text-sm text-[var(--color-ink-muted)] mb-5 leading-relaxed">{plan.blurb}</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="text-[var(--color-success)]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`block text-center rounded-lg py-2.5 text-sm font-semibold transition-colors ${
                  plan.highlighted
                    ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
                    : 'border border-[var(--color-border)] hover:bg-[#F6F8FC]'
                }`}
              >
                Get started
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}