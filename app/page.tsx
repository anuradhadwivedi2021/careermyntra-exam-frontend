import Link from 'next/link';

const mockCategories = [
  {
    name: 'CareerMyntra Mock Tests',
    accent: 'var(--color-primary)',
    items: ['Engineering', 'Medical', 'Management', 'Competitive Exams', 'Entrance Exam Prep'],
  },
  {
    name: 'CareerMyntra Job Aptitude Tests',
    accent: '#16A34A',
    items: ['Quantitative Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Technical Aptitude', 'Employability Assessment'],
  },
  {
    name: 'CareerMyntra Skill Assessments',
    accent: '#F59E0B',
    items: ['Programming & Coding', 'Digital Skills', 'Communication Skills', 'Domain Skills'],
  },
];

const steps = [
  { title: 'Create your account', body: 'Verify your mobile number and set up your candidate profile in under a minute.' },
  { title: 'Pick an exam', body: 'Browse mock tests, aptitude tests, coding rounds and subject-wise assessments.' },
  { title: 'Take it, timed', body: 'A server-synced countdown, question palette and auto-save keep every attempt fair.' },
  { title: 'Get your report', body: 'See your score, rank and question-wise breakdown the moment you submit.' },
];

const plans = [
  { name: 'Free Test', price: '₹0', blurb: 'One full-length mock test to see how the platform works.' },
  { name: 'Individual Test', price: '₹99', blurb: 'Pay per exam — ideal if you only need one or two assessments.' },
  { name: 'Test Series', price: '₹499', blurb: 'A full series with detailed, question-wise performance reports.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.jpeg" alt="CareerMyntra" className="h-8 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="text-slate-900">Home</Link>
            <Link href="/exams" className="hover:text-slate-900 transition-colors">Exams</Link>
            <Link href="/exams?category=mock" className="hover:text-slate-900 transition-colors">Mock Tests</Link>
            <Link href="/exams?category=aptitude" className="hover:text-slate-900 transition-colors">Aptitude Tests</Link>
            <Link href="/gallery" className="hover:text-slate-900 transition-colors">Gallery</Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">About Us</Link>
            <Link href="/pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg px-4 py-2.5 hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.1] tracking-tight text-slate-900">
              Test your skills.
              <br />
              Discover your potential.
              <br />
              Build your career.
            </h1>
            <p className="mt-6 text-base text-[var(--color-ink-muted)] max-w-md leading-relaxed">
              CareerMyntra brings mock tests, aptitude assessments and coding
              rounds into one timed exam experience — with your report ready
              the moment you submit.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/exams"
                className="inline-flex items-center bg-[var(--color-primary)] text-white text-sm font-semibold rounded-lg px-6 py-3 hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Explore exams
              </Link>
              <Link
                href="/exams?filter=free"
                className="inline-flex items-center border border-[var(--color-border)] text-slate-800 text-sm font-semibold rounded-lg px-6 py-3 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Take a free test
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <dt className="sr-only">Candidates tested</dt>
                <dd className="font-display text-2xl font-bold text-slate-900">25,000+</dd>
                <p className="text-xs text-[var(--color-ink-muted)] mt-1">Candidates tested</p>
              </div>
              <div>
                <dt className="sr-only">Live exams</dt>
                <dd className="font-display text-2xl font-bold text-slate-900">120+</dd>
                <p className="text-xs text-[var(--color-ink-muted)] mt-1">Live exams</p>
              </div>
              <div>
                <dt className="sr-only">Average rating</dt>
                <dd className="font-display text-2xl font-bold text-slate-900">4.7/5</dd>
                <p className="text-xs text-[var(--color-ink-muted)] mt-1">Candidate rating</p>
              </div>
            </dl>
          </div>

          {/* Live exam demo panel — the most characteristic thing in this product */}
          <div className="relative">
            <div className="absolute -inset-4 bg-[var(--color-primary)]/5 rounded-[28px] -z-10" aria-hidden="true" />
            <div className="rounded-2xl border border-[var(--color-border)] bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.25)] overflow-hidden">
              {/* Exam top bar */}
              <div className="bg-[var(--color-primary)] text-white px-5 py-3 flex items-center justify-between text-xs font-semibold">
                <span className="tracking-tight">CAREERMYNTRA</span>
                <span className="opacity-90">General Aptitude Mock Test</span>
                <span className="flex items-center gap-1.5 tabular-nums">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" aria-hidden="true" />
                  00:22:14
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-[var(--color-ink-muted)]">Question 7 of 30</span>
                  <span className="text-xs font-medium text-amber-600">Marked for review</span>
                </div>

                <p className="text-sm font-semibold text-slate-900 mb-4">
                  A train 150 m long crosses a platform in 18 seconds at a
                  speed of 60 km/h. What is the length of the platform?
                </p>

                <div className="space-y-2 mb-6">
                  {[
                    { label: 'A', text: '120 m' },
                    { label: 'B', text: '150 m', selected: true },
                    { label: 'C', text: '180 m' },
                    { label: 'D', text: '200 m' },
                  ].map((opt) => (
                    <div
                      key={opt.label}
                      className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm ${
                        opt.selected
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-slate-900 font-medium'
                          : 'border-[var(--color-border)] text-slate-600'
                      }`}
                    >
                      <span
                        className={`h-5 w-5 shrink-0 rounded-full border flex items-center justify-center text-[10px] font-semibold ${
                          opt.selected
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                            : 'border-slate-300 text-slate-500'
                        }`}
                      >
                        {opt.label}
                      </span>
                      {opt.text}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1" aria-hidden="true">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-4 rounded-full ${
                          i < 6 ? 'bg-[var(--color-primary)]' : i === 6 ? 'bg-amber-400' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-primary)]">Save &amp; next</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exam categories */}
        <section className="bg-[#F6F8FC] border-y border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="max-w-xl mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Every kind of assessment, one platform
              </h2>
              <p className="mt-3 text-[var(--color-ink-muted)] text-sm leading-relaxed">
                Whether you&apos;re prepping for an entrance exam, a recruiter&apos;s
                aptitude round, or a coding interview, CareerMyntra has a test
                built for it.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {mockCategories.map((cat) => (
                <div
                  key={cat.name}
                  className="bg-white rounded-2xl border border-[var(--color-border)] p-6 pl-7 relative overflow-hidden"
                >
                  <span
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ backgroundColor: cat.accent }}
                    aria-hidden="true"
                  />
                  <h3 className="font-display text-base font-bold text-slate-900 mb-3">{cat.name}</h3>
                  <ul className="space-y-1.5">
                    {cat.items.map((item) => (
                      <li key={item} className="text-sm text-[var(--color-ink-muted)]">{item}</li>
                    ))}
                  </ul>
                  <Link
                    href="/exams"
                    className="inline-flex mt-5 text-sm font-semibold"
                    style={{ color: cat.accent }}
                  >
                    Explore
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 mb-12 max-w-xl">
            From sign-up to score report in four steps
          </h2>

          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <li key={step.title} className="relative pl-12">
                <span className="absolute left-0 top-0 h-8 w-8 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-slate-900 mb-1.5">{step.title}</h3>
                <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Pricing teaser */}
        <section className="bg-[#F6F8FC] border-y border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                  Start free, upgrade when you&apos;re ready
                </h2>
                <p className="mt-3 text-[var(--color-ink-muted)] text-sm max-w-md">
                  Every candidate gets one free test. Paid plans unlock full
                  test series and detailed performance reports.
                </p>
              </div>
              <Link
                href="/pricing"
                className="text-sm font-semibold text-[var(--color-primary)] shrink-0"
              >
                View all plans
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {plans.map((plan) => (
                <div key={plan.name} className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
                  <p className="text-sm font-semibold text-[var(--color-ink-muted)] mb-1">{plan.name}</p>
                  <p className="font-display text-3xl font-bold text-slate-900 mb-3">{plan.price}</p>
                  <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">{plan.blurb}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="rounded-2xl bg-[var(--color-primary)] px-8 py-14 sm:px-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white max-w-lg mx-auto">
              Ready to see where you stand?
            </h2>
            <p className="mt-3 text-white/80 text-sm max-w-md mx-auto">
              Create a free account and take your first assessment in the
              next five minutes.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center bg-white text-[var(--color-primary)] text-sm font-semibold rounded-lg px-6 py-3 mt-7 hover:bg-slate-50 transition-colors"
            >
              Create free account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <img src="/logo.jpeg" alt="CareerMyntra" className="h-7 w-auto mb-3" />
            <p className="text-xs text-[var(--color-ink-muted)] leading-relaxed">
              Career Aptitude Test | Admission Guidance | Training | Internship | Jobs
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Exams</h4>
            <ul className="space-y-2 text-sm text-[var(--color-ink-muted)]">
              <li><Link href="/exams?category=mock" className="hover:text-slate-900">Mock tests</Link></li>
              <li><Link href="/exams?category=aptitude" className="hover:text-slate-900">Aptitude tests</Link></li>
              <li><Link href="/exams?category=skills" className="hover:text-slate-900">Skill assessments</Link></li>
              <li><Link href="/exams?category=coding" className="hover:text-slate-900">Coding tests</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-[var(--color-ink-muted)]">
              <li><Link href="/about" className="hover:text-slate-900">About us</Link></li>
              <li><Link href="/gallery" className="hover:text-slate-900">Gallery</Link></li>
              <li><Link href="/pricing" className="hover:text-slate-900">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-[var(--color-ink-muted)]">
              <li><Link href="/login" className="hover:text-slate-900">Log in</Link></li>
              <li><Link href="/register" className="hover:text-slate-900">Sign up</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-[var(--color-ink-muted)]">
              © {new Date().getFullYear()} CareerMyntra. All rights reserved.
            </p>
            <p className="text-xs text-[var(--color-ink-muted)]">
              Career Guidance • Assessment • Training
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}