import React, { useState, useEffect, useRef } from 'react';
import { 
  History as HistoryIcon, 
  X, 
  Eraser,
  Divide,
  X as Multiply,
  Minus,
  Plus
} from 'lucide-react';
import { HistoryItem } from '../types';

// Button configuration for standard layout
const KEYPAD = [
  { label: 'C', value: 'clear', type: 'function', highlight: true },
  { label: '(', value: '(', type: 'operator' },
  { label: ')', value: ')', type: 'operator' },
  { label: '÷', value: '/', type: 'operator', icon: <Divide size={20} /> },
  { label: '7', value: '7', type: 'number' },
  { label: '8', value: '8', type: 'number' },
  { label: '9', value: '9', type: 'number' },
  { label: '×', value: '*', type: 'operator', icon: <Multiply size={20} /> },
  { label: '4', value: '4', type: 'number' },
  { label: '5', value: '5', type: 'number' },
  { label: '6', value: '6', type: 'number' },
  { label: '-', value: '-', type: 'operator', icon: <Minus size={20} /> },
  { label: '1', value: '1', type: 'number' },
  { label: '2', value: '2', type: 'number' },
  { label: '3', value: '3', type: 'number' },
  { label: '+', value: '+', type: 'operator', icon: <Plus size={20} /> },
  { label: '0', value: '0', type: 'number', span: 2 },
  { label: '.', value: '.', type: 'number' },
  { label: '=', value: 'equals', type: 'action' },
];

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll history to bottom when opened or updated
    if (showHistory && historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showHistory, history]);

  const handleStandardInput = (value: string, type: string) => {
    if (type === 'function' && value === 'clear') {
      setDisplay('0');
      setExpression('');
      setLastResult(null);
      return;
    }

    if (type === 'action' && value === 'equals') {
      try {
        const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
        if (!sanitized) return;

        // eslint-disable-next-line no-new-func
        const result = new Function(`return ${sanitized}`)();
        
        // Format result to avoid long decimals
        const formattedResult = String(Math.round(result * 100000000) / 100000000);

        const newItem: HistoryItem = {
          id: Date.now().toString(),
          expression: expression,
          result: formattedResult,
          timestamp: Date.now()
        };

        setHistory(prev => [...prev, newItem]);
        setDisplay(formattedResult);
        setLastResult(formattedResult);
        setExpression(formattedResult); // Allow chaining
      } catch (e) {
        setDisplay('Error');
        setTimeout(() => setDisplay(expression || '0'), 1500);
      }
      return;
    }

    // Handle initial state or after a result
    if (display === '0' || display === 'Error') {
      if (type === 'operator') {
        setDisplay('0' + value);
        setExpression('0' + value);
      } else {
        setDisplay(value);
        setExpression(value);
      }
    } else if (lastResult && lastResult === display) {
      // Starting new calculation after a result
      if (type === 'operator') {
        // Chain operation
        setDisplay(display + value);
        setExpression(display + value);
        setLastResult(null);
      } else {
        // New number
        setDisplay(value);
        setExpression(value);
        setLastResult(null);
      }
    } else {
      setDisplay(display + value);
      setExpression(expression + value);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl h-[600px]">
      {/* Main Calculator Body */}
      <div className="flex-1 bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col relative">
        
        {/* Header / Mobile History Toggle */}
        <div className="absolute top-0 right-0 p-4 flex justify-end items-center z-10">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-full transition-colors md:hidden ${showHistory ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
          >
            <HistoryIcon size={20} />
          </button>
        </div>

        {/* Display Area */}
        <div className="flex-1 flex flex-col justify-end p-8 bg-gradient-to-b from-slate-900 to-slate-800 relative">
             <div className="text-slate-400 text-right text-sm h-6 mb-1 font-mono tracking-wider opacity-60 overflow-hidden">
                {expression !== display ? expression : ''}
             </div>
             <div className="text-right">
                <span className={`text-5xl font-light tracking-tight break-all ${display === 'Error' ? 'text-rose-500' : 'text-white'}`}>
                  {display}
                </span>
             </div>
        </div>

        {/* Controls Area */}
        <div className="bg-slate-800 p-6 pt-2 h-[60%] border-t border-slate-700/50">
            <div className="grid grid-cols-4 gap-3 h-full">
              {KEYPAD.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => handleStandardInput(btn.value, btn.type)}
                  className={`
                    rounded-2xl text-lg font-medium transition-all duration-150 active:scale-95 flex items-center justify-center
                    ${btn.span === 2 ? 'col-span-2' : ''}
                    ${btn.highlight 
                      ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20' 
                      : btn.type === 'operator' || btn.type === 'action'
                        ? btn.type === 'action' 
                           ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/40' 
                           : 'bg-slate-700 text-indigo-300 hover:bg-slate-600'
                        : 'bg-slate-700/50 text-slate-200 hover:bg-slate-700'
                    }
                  `}
                >
                  {btn.icon || btn.label}
                </button>
              ))}
            </div>
        </div>
      </div>

      {/* History Sidebar - Visible on Desktop or when toggled */}
      <div className={`
        fixed inset-0 z-50 md:static md:z-0 md:w-80 bg-slate-800 md:bg-transparent md:block transition-all duration-300 transform
        ${showHistory ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
         {/* Mobile Close Button */}
         <button 
            onClick={() => setShowHistory(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white md:hidden"
          >
            <X size={24} />
          </button>

         <div className="h-full bg-slate-800 rounded-3xl md:border border-slate-700 shadow-xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 backdrop-blur">
              <h3 className="font-semibold text-slate-300 flex items-center gap-2">
                <HistoryIcon size={18} />
                History
              </h3>
              {history.length > 0 && (
                <button 
                  onClick={() => setHistory([])}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2 py-1 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Eraser size={12} /> Clear
                </button>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm gap-2 opacity-60">
                  <HistoryIcon size={32} strokeWidth={1.5} />
                  <p>No history yet</p>
                </div>
              ) : (
                history.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-2xl border transition-all hover:bg-slate-700/50 group cursor-pointer bg-slate-700/20 border-slate-700 hover:border-indigo-500/30"
                    onClick={() => {
                       setDisplay(item.result);
                       setExpression(item.result);
                    }}
                  >
                    <div className="text-right text-xs text-slate-500 mb-1 font-mono tracking-tight">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-slate-400 text-sm mb-1 font-medium truncate">{item.expression}</div>
                    <div className="text-2xl text-right font-light tracking-tight text-indigo-400">
                      {item.result}
                    </div>
                  </div>
                ))
              )}
              <div ref={historyEndRef} />
            </div>
         </div>
      </div>
    </div>
  );
};