'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Papa from 'papaparse';

interface ParsedQuestion {
  question_text: string;
  subject?: string;
  marks: number;
  explanation?: string;
  options: { option_text: string; is_correct: boolean }[];
}

export default function BulkUploadPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.examId as string;

  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ added: number; errors: string[] } | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError('');
    setResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed: ParsedQuestion[] = (results.data as Record<string, string>[]).map((row) => {
            const correctIndex = parseInt(row.correct_option || '1', 10) - 1;
            const options = [row.option_a, row.option_b, row.option_c, row.option_d]
              .filter((o) => o && o.trim() !== '')
              .map((text, i) => ({ option_text: text.trim(), is_correct: i === correctIndex }));

            return {
              question_text: row.question_text?.trim() || '',
              subject: row.subject?.trim() || '',
              marks: Number(row.marks) || 1,
              explanation: row.explanation?.trim() || '',
              options,
            };
          }).filter((q) => q.question_text && q.options.length >= 2);

          if (parsed.length === 0) {
            setError('No valid rows found. Check the column names match the template.');
          }
          setQuestions(parsed);
        } catch {
          setError('Could not parse the file. Please check the format.');
        }
      },
      error: () => setError('Could not read the file.'),
    });
  };

  const handleUpload = async () => {
    setUploading(true);
    setError('');
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('https://careermyntra-exam-backend.onrender.com/api/questions/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ exam_id: Number(examId), questions }),
      });
      const data = await res.json();
      if (!data.success) setError(data.message || 'Upload failed');
      else {
        setResult({ added: data.added, errors: data.errors || [] });
        setQuestions([]);
        setFileName('');
      }
    } catch {
      setError('Could not reach server.');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'question_text,subject,marks,correct_option,option_a,option_b,option_c,option_d,explanation\n' +
      '"What is the capital of France?",Geography,2,2,Berlin,Paris,Rome,Madrid,"Paris is the capital of France"\n' +
      '"2 + 2 = ?",Math,1,3,3,2,4,5,"Basic addition"';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'question_template.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F6F8FC] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <img src="/logo.jpeg" alt="CareerMyntra" className="h-9 w-auto" />
          <button onClick={() => router.push('/admin/dashboard')} className="text-sm text-[var(--color-primary)] font-medium">
            ← Back to dashboard
          </button>
        </div>

        <h1 className="font-display text-xl font-bold mb-1">Bulk Upload Questions</h1>
        <p className="text-sm text-[var(--color-ink-muted)] mb-6">Upload a CSV file to add multiple questions at once.</p>

        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6 mb-4">
          <button onClick={downloadTemplate} className="text-sm text-[var(--color-primary)] font-medium mb-4 hover:underline">
            ↓ Download CSV template
          </button>

          <div>
            <label className="text-sm font-medium block mb-1.5">Choose CSV file</label>
            <input type="file" accept=".csv" onChange={handleFile}
              className="w-full text-sm border border-[var(--color-border)] rounded-lg px-3.5 py-2.5 outline-none" />
            {fileName && <p className="text-xs text-[var(--color-ink-muted)] mt-1">{fileName}</p>}
          </div>

          {error && <p className="text-sm text-[var(--color-danger)] mt-3">{error}</p>}

          {result && (
            <div className="mt-3 p-3 bg-[var(--color-success)]/10 rounded-lg">
              <p className="text-sm text-[var(--color-success)] font-medium">{result.added} questions added successfully!</p>
              {result.errors.length > 0 && (
                <ul className="text-xs text-[var(--color-danger)] mt-1 list-disc pl-4">
                  {result.errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              )}
            </div>
          )}
        </div>

        {questions.length > 0 && (
          <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden mb-4">
            <div className="px-5 py-3 border-b border-[var(--color-border)] font-display font-bold text-sm">
              Preview ({questions.length} questions found)
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-[var(--color-border)]">
              {questions.map((q, i) => (
                <div key={i} className="p-4 text-sm">
                  <p className="font-medium mb-1">{i + 1}. {q.question_text}</p>
                  <div className="text-xs text-[var(--color-ink-muted)] space-y-0.5">
                    {q.options.map((opt, j) => (
                      <p key={j} className={opt.is_correct ? 'text-[var(--color-success)] font-medium' : ''}>
                        {String.fromCharCode(65 + j)}. {opt.option_text} {opt.is_correct && '✓'}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {questions.length > 0 && (
          <button onClick={handleUpload} disabled={uploading}
            className="w-full bg-[var(--color-primary)] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-60">
            {uploading ? 'Uploading…' : `Upload ${questions.length} questions`}
          </button>
        )}
      </div>
    </div>
  );
}