import Link from 'next/link';

const images = [
  { title: 'Mock Test Session', color: 'var(--color-primary)' },
  { title: 'Aptitude Workshop', color: '#16A34A' },
  { title: 'Coding Bootcamp', color: '#F59E0B' },
  { title: 'Career Fair 2026', color: 'var(--color-primary)' },
  { title: 'Certificate Distribution', color: '#16A34A' },
  { title: 'Training Session', color: '#F59E0B' },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/"><img src="/logo.jpeg" alt="CareerMyntra" className="h-8 w-auto" /></Link>
          <Link href="/" className="text-sm font-medium text-[var(--color-primary)]">← Back to home</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl font-bold mb-3">Gallery</h1>
        <p className="text-[var(--color-ink-muted)] mb-10 max-w-lg">
          Moments from our exams, workshops and training sessions across the CareerMyntra community.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {images.map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-[var(--color-border)]">
              <div className="h-40 flex items-center justify-center" style={{ backgroundColor: img.color + '15' }}>
                <span className="text-sm font-medium" style={{ color: img.color }}>{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}