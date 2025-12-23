import React from 'react';
import { Calculator } from './components/Calculator';
import { Calculator as CalcIcon } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4 flex items-center gap-2 text-indigo-400 opacity-80">
        <CalcIcon size={24} />
        <span className="font-bold tracking-wider text-sm">Calculator</span>
      </div>

      <main className="w-full max-w-5xl flex gap-6 items-start justify-center">
        <Calculator />
      </main>
    </div>
  );
}