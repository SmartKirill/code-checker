import Link from 'next/link';
import Image from 'next/image';

const languages = [
  { name: 'Python', image: '/languages/python.png' },
  { name: 'C', image: '/languages/python.png' },
  { name: 'C++', image: '/languages/python.png' },
  { name: 'Java', image: '/languages/python.png' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <header className="flex items-center justify-between border-b border-white/10 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500 text-xl font-bold">
              {'</>'}
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Code<span className="text-violet-400">Step</span>
            </span>
          </div>
          <Link
            href="/training"
            className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold transition hover:bg-white/10"
          >
            Начать обучение →
          </Link>
        </header>

        <section className="py-24 text-center">
          <div className="mb-8 inline-flex rounded-full border border-violet-400/30 bg-violet-500/10 px-5 py-2 text-sm text-violet-300">
            Интерактивный тренажёр программирования
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
            Учись программировать
            <span className="block bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              на практике
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-300">
            CodeStep помогает ученикам развивать навыки программирования с
            помощью практических заданий. Выбирай язык, пиши код, проверяй
            решения и учись на своих ошибках.
          </p>

          <Link
            href="/training"
            className="mt-10 inline-flex rounded-2xl bg-violet-500 px-9 py-5 text-lg font-bold shadow-lg shadow-violet-500/20 transition hover:bg-violet-400"
          >
            Начать тренировку →
          </Link>

          <p className="mt-5 text-sm text-slate-400">
            Практикуйся в удобном темпе
          </p>
        </section>

        <section className="pb-24">
          <h2 className="mb-10 text-center text-3xl font-bold">
            Как работает CodeStep?
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                number: '01',
                title: 'Выбери язык',
                text: 'Начни с Python, C, C++ или Java.',
              },
              {
                number: '02',
                title: 'Напиши программу',
                text: 'Получи задание и напиши своё решение в редакторе.',
              },
              {
                number: '03',
                title: 'Проверь результат',
                text: 'Получи обратную связь, исправь ошибки и переходи дальше.',
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-white/10 bg-slate-900 p-7"
              >
                <span className="text-4xl font-bold text-violet-400">
                  {step.number}
                </span>
                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-white/10 py-8 text-center text-sm text-slate-400">
          CodeStep © 2026 · Учебный проект по программированию
        </footer>
      </div>
    </main>
  );
}
