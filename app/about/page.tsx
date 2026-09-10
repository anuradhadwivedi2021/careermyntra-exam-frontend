import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><img src="/logo.jpeg" alt="CareerMyntra" className="h-8 w-auto" /></Link>
          <Link href="/" className="text-sm font-medium text-[var(--color-primary)]">← Back to home</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl font-bold mb-3">About CareerMyntra</h1>
        <p className="text-[var(--color-ink-muted)] mb-8 leading-relaxed">
          Career Aptitude Test | Admission Guidance | Training | Internship | Jobs
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <p>
            CareerMyntra brings career guidance, skills assessment and training under one platform.
            Our Online Examination &amp; Assessment Portal helps students, job seekers and professionals
            test their skills through mock tests, aptitude assessments and coding rounds.
          </p>
          <p>
            Every attempt on CareerMyntra comes with a detailed performance report — score,
            percentage, and a question-wise breakdown — so you know exactly where you stand and
            what to work on next.
          </p>
          <p>
            We&apos;re building CareerMyntra to be the one place candidates go to prepare for
            entrance exams, recruitment aptitude rounds, and technical interviews, with the
            guidance and training to back it up.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mt-12">
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-[var(--color-primary)]">25,000+</p>
            <p className="text-xs text-[var(--color-ink-muted)] mt-1">Candidates tested</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-[var(--color-primary)]">120+</p>
            <p className="text-xs text-[var(--color-ink-muted)] mt-1">Live exams</p>
          </div>
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-[var(--color-primary)]">4.7/5</p>
            <p className="text-xs text-[var(--color-ink-muted)] mt-1">Candidate rating</p>
          </div>
        </div>
      </main>
    </div>
  );
}