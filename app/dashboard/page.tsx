'use client';

import { useEffect, useState } from 'react';

interface Candidate {
  candidate_id: number;
  full_name: string;
  mobile_number: string;
  email: string;
}

export default function DashboardPage() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('candidate');
    if (stored) setCandidate(JSON.parse(stored));
  }, []);

  return (
    <div className="min-h-screen bg-[#F6F8FC] flex items-center justify-center px-6">
      <div className="bg-white border border-[var(--color-border)] rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
        <img src="/logo.jpeg" alt="CareerMyntra" className="h-10 w-auto mx-auto mb-6" />
        <h1 className="font-display text-2xl font-bold mb-2">Welcome{candidate ? `, ${candidate.full_name}` : ''} 👋</h1>
        <p className="text-sm text-[var(--color-ink-muted)]">Your exam dashboard is coming up next in this sprint.</p>
      </div>
    </div>
  );
}