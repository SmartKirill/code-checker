'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Language {
  id: string;
  name: string;
  judge0_id: number;
  default_code: string;
}

interface Question {
  id: string | number;
  title: string;
  text?: string;
  description: string;
  difficulty: string;
  input?: string[];
  output?: string[];
  examples?: Array<{ input: string; output: string }>;
}

export default function Page() {
  const [isSolved, setIsSolved] = useState<boolean>(false);

  const [languages, setLanguages] = useState<Language[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

  const [selectedLang, setSelectedLang] = useState<Language | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<string>('Лёгкая');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [code, setCode] = useState<string>('');

  const difficultyMap: Record<string, string> = {
    лёгкая: 'лёгкая',
    средняя: 'средняя',
    сложная: 'сложная',
  };

  useEffect(() => {
    fetch('/languages.json')
      .then((res) => res.json())
      .then((data: Language[]) => {
        setLanguages(data);
        if (data.length > 0) {
          setSelectedLang(data[0]);
          setCode(data[0].default_code);
        }
      })
      .catch((err) => console.error('Ошибка загрузки языков:', err));

    fetch('/questions_1.json')
      .then((res) => res.json())
      .then((data: Question[]) => {
        setAllQuestions(data);

        const targetDiff = difficultyMap['лёгкая'];
        const filtered = data.filter(
          (q) => (q.difficulty || '').toLowerCase() === targetDiff,
        );

        if (filtered.length > 0) {
          const randomQ = filtered[Math.floor(Math.random() * filtered.length)];
          setCurrentQuestion({
            ...randomQ,
            title: randomQ.title || randomQ.text || 'Без названия',
          });
        }
      })
      .catch((err) => console.error('Ошибка загрузки вопросов:', err));
  }, []);

  const handleLanguageChange = (langId: string) => {
    const lang = languages.find((l) => l.id === langId);
    if (lang) {
      setSelectedLang(lang);
      setCode(lang.default_code);
    }
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);

    const targetDiff =
      difficultyMap[difficulty.toLowerCase()] || difficulty.toLowerCase();

    const filtered = allQuestions.filter(
      (q) => (q.difficulty || '').toLowerCase() === targetDiff,
    );

    if (filtered.length > 0) {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      const randomQ = filtered[randomIndex];
      setCurrentQuestion({
        ...randomQ,
        title: randomQ.title || randomQ.text || 'Без названия',
      });
    } else {
      setCurrentQuestion(null);
    }
    setIsSolved(false);
  };

  const nextQuestion = () => {
    handleDifficultyChange(selectedDifficulty);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white font-sans">
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-6 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-cyan-500 text-md font-bold shadow-md shadow-violet-500/20">
            {'</>'}
          </div>
          <span className="text-xl font-bold tracking-tight">
            Code
            <span className="bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Step
            </span>
          </span>
        </div>

        <Link
          href="/"
          className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm font-semibold transition hover:bg-white/5 hover:border-white/20"
        >
          Выйти в меню
        </Link>
      </header>

      <main className="flex flex-1 overflow-hidden p-4 gap-4 bg-slate-950">
        <section className="flex w-1/2 flex-col rounded-2xl border border-white/10 bg-slate-900/50 overflow-hidden shadow-xl backdrop-blur-xs">
          <div className="border-b border-white/10 bg-slate-950/60 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Описание задачи
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {currentQuestion ? currentQuestion.title : 'Загрузка...'}
                </h1>
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                  {currentQuestion
                    ? currentQuestion.difficulty
                    : selectedDifficulty}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                {currentQuestion
                  ? currentQuestion.description
                  : 'Выберите уровень сложности для загрузки задачи.'}
              </p>
            </div>

            <div className="space-y-4">
              {currentQuestion?.input && currentQuestion.input.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium text-slate-200">
                    Пример:
                  </span>
                  <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs border border-white/5 space-y-1.5 shadow-inner">
                    <div>
                      <span className="text-slate-500">Ввод:</span>{' '}
                      {currentQuestion.input[0]}
                    </div>
                    <div>
                      <span className="text-slate-500">Вывод:</span>{' '}
                      {currentQuestion.output?.[0] || ''}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="flex w-1/2 flex-col gap-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-2.5 backdrop-blur-xs">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium">
                Язык:
              </label>
              <select
                className="rounded-xl bg-slate-950 border border-white/10 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer transition-all"
                value={selectedLang?.id || ''}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium">
                Сложность:
              </label>
              <select
                className="rounded-xl bg-slate-950 border border-white/10 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer transition-all"
                value={selectedDifficulty}
                onChange={(e) => handleDifficultyChange(e.target.value)}
              >
                <option value="Лёгкая">Лёгкая</option>
                <option value="Средняя">Средняя</option>
                <option value="Сложная">Сложная</option>
              </select>
            </div>
          </div>
          <div className="flex flex-1 flex-col rounded-2xl border border-white/10 bg-slate-900/50 overflow-hidden shadow-xl backdrop-blur-xs">
            <div className="flex-1 bg-slate-950 font-mono text-sm p-5 relative shadow-inner">
              <textarea
                className="w-full h-full bg-transparent text-slate-200 resize-none focus:outline-none font-mono leading-relaxed"
                placeholder="# Пиши свой код здесь..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between border-t border-white/10 bg-slate-950/60 px-5 py-4">
              <button
                className="rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 text-white px-6 py-2.5 text-sm font-bold transition-all shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-98"
                onClick={() => {
                  alert(
                    `Отправка на Judge0.\nЯзык: ${selectedLang?.name} (ID: ${selectedLang?.judge0_id})\nКод отправлен.`,
                  );
                }}
              >
                Проверить код
              </button>

              <button
                className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-98 border ${
                  isSolved
                    ? 'bg-emerald-500 border-emerald-400 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => {
                  nextQuestion();
                }}
              >
                {isSolved ? 'Следующее задание →' : 'Пропустить задачу'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
