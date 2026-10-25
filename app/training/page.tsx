'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [isSolved, setIsSolved] = useState<boolean>(false);

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-white font-sans">
      {/* ХЕДЕР: В стиле главной страницы */}
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

      {/* ОСНОВНОЙ РАБОЧИЙ ИНТЕРФЕЙС */}
      <main className="flex flex-1 overflow-hidden p-4 gap-4 bg-slate-950">
        {/* ЛЕВАЯ ПАНЕЛЬ: Задачи и Примеры */}
        <section className="flex w-1/2 flex-col rounded-2xl border border-white/10 bg-slate-900/50 overflow-hidden shadow-xl backdrop-blur-xs">
          {/* Таб-хедер панели */}
          <div className="border-b border-white/10 bg-slate-950/60 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Описание задачи
          </div>

          {/* Скроллируемый контент */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  {/* task.title */} 1. Two Sum
                </h1>
                {/* Подсветка сложности градиентным бордером */}
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                  {/* task.difficulty */} Easy
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                {/* task.description */}
                Учитывая массив целых чисел `nums` и целое число `target`,
                верните индексы двух чисел так, чтобы они в сумме составляли
                `target`.
              </p>
            </div>

            {/* Блок примеров (Рендеринг через .map из JSON) */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-sm font-medium text-slate-200">
                  Пример 1:
                </span>
                <div className="rounded-xl bg-slate-950 p-4 font-mono text-xs border border-white/5 space-y-1.5 shadow-inner">
                  <div>
                    <span className="text-slate-500">Ввод:</span> nums =, target
                    = 9
                  </div>
                  <div>
                    <span className="text-slate-500">Вывод:</span> [0,1]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ПРАВАЯ ПАНЕЛЬ: Управление и Редактор */}
        <section className="flex w-1/2 flex-col gap-4">
          {/* Панель настроек (Язык / Сложность) */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-2.5 backdrop-blur-xs">
            {/* Селектор Языка */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium">
                Язык:
              </label>
              <select
                className="rounded-xl bg-slate-950 border border-white/10 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer transition-all"
                onChange={(e) => {
                  /* handleLanguageChange(e.target.value) */
                }}
              >
                {/* Опции рендерятся из твоего языкового JSON */}
                <option value="71">Python</option>
                <option value="62">Java</option>
                <option value="54">C++</option>
              </select>
            </div>

            {/* Селектор Сложности */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-medium">
                Сложность:
              </label>
              <select
                className="rounded-xl bg-slate-950 border border-white/10 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer transition-all"
                onChange={(e) => {
                  /* handleDifficultyChange(e.target.value) */
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Инпут редактора кода */}
          <div className="flex flex-1 flex-col rounded-2xl border border-white/10 bg-slate-900/50 overflow-hidden shadow-xl backdrop-blur-xs">
            {/* Поле ввода кода */}
            <div className="flex-1 bg-slate-950 font-mono text-sm p-5 relative shadow-inner">
              <textarea
                className="w-full h-full bg-transparent text-slate-200 resize-none focus:outline-none font-mono leading-relaxed"
                placeholder="# Пиши свой код здесь..."
                // value={codeTemplate}
                // onChange={(e) => setCode(e.target.value)}
              />

              {/* Кнопка ИИ (Anthropic) с фиолетово-синим градиентным эффектом при ховере */}
              <button
                className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-slate-900 border border-violet-500/30 hover:border-violet-400 px-4 py-2 text-xs font-semibold text-violet-300 shadow-lg transition-all hover:bg-violet-950/30"
                onClick={() => {
                  /* handleAskAI() */
                }}
              >
                <span className="bg-linear-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  ✨ Спросить ИИ
                </span>
              </button>
            </div>

            {/* Бар управления (Проверка кода и Навигация) */}
            <div className="flex items-center justify-between border-t border-white/10 bg-slate-950/60 px-5 py-4">
              {/* Кнопка отправки в Judge0 */}
              <button
                className="rounded-xl bg-linear-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 text-white px-6 py-2.5 text-sm font-bold transition-all shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-98"
                onClick={() => {
                  /* handleVerifyCode() */
                }}
              >
                Проверить код
              </button>

              {/* УНИКАЛЬНАЯ ДИНАМИЧЕСКАЯ КНОПКА НАВИГАЦИИ */}
              {/* Если задача решена идеально: становится яркой зеленой "Следующее задание" */}
              {/* Если не решена: полупрозрачная серая "Пропустить" */}
              <button
                className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 active:scale-98 border ${
                  isSolved
                    ? 'bg-emerald-500 border-emerald-400 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-transparent border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => {
                  // handleNavigationAction()
                  // Временный демо-переключатель для твоих тестов верстки:
                  setIsSolved(!isSolved);
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
