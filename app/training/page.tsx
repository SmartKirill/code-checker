"use client";

import Link from "next/link";
import { useState } from "react";

type Language = "python" | "c" | "cpp" | "java";
type Level = "easy" | "medium";
type TaskId = "hello" | "sum" | "even" | "square" | "max" | "factorial" | "reverse" | "vowels";
type Feedback = {
  kind: "success" | "error";
  title: string;
  explanation: string;
  hint?: string;
};
type Task = {
  id: TaskId;
  level: Level;
  title: string;
  description: string;
  example: string;
  hints: [string, string];
};

const LANGUAGES: { id: Language; name: string; short: string; filename: string }[] = [
  { id: "python", name: "Python", short: "Py", filename: "main.py" },
  { id: "c", name: "C", short: "C", filename: "main.c" },
  { id: "cpp", name: "C++", short: "C++", filename: "main.cpp" },
  { id: "java", name: "Java", short: "Jv", filename: "Main.java" },
];

const TASKS: Task[] = [
  {
    id: "hello", level: "easy", title: "Поздоровайся с миром",
    description: "Напиши программу, которая выводит одну строку: Привет, мир!",
    example: "Ожидаемый вывод:\nПривет, мир!",
    hints: ["Подумай, какой командой выводят текст на экран.", "Проверь регистр букв, запятую и восклицательный знак."],
  },
  {
    id: "sum", level: "easy", title: "Сумма двух чисел",
    description: "Считай два целых числа и выведи их сумму. Числа могут быть любыми, не только из примера.",
    example: "Ввод:\n7 5\n\nОжидаемый вывод:\n12",
    hints: ["Сначала нужно считать два числа из ввода.", "Используй сложение чисел, а не склеивание строк."],
  },
  {
    id: "even", level: "easy", title: "Чётное или нечётное?",
    description: "Считай целое число. Если число чётное, выведи EVEN, иначе ODD.",
    example: "Ввод:\n8\n\nОжидаемый вывод:\nEVEN",
    hints: ["Понадобится условие if (или аналог).", "Чётное число даёт остаток 0 при делении на 2."],
  },
  {
    id: "square", level: "easy", title: "Квадрат числа",
    description: "Считай целое число и выведи его квадрат.",
    example: "Ввод:\n-6\n\nОжидаемый вывод:\n36",
    hints: ["Нужно использовать считанное число.", "Квадрат — это число, умноженное само на себя."],
  },
  {
    id: "max", level: "medium", title: "Максимум из трёх",
    description: "Считай три целых числа и выведи наибольшее из них.",
    example: "Ввод:\n17 44 9\n\nОжидаемый вывод:\n44",
    hints: ["Не забудь сравнить все три числа.", "Можно использовать условные операторы или функцию максимума."],
  },
  {
    id: "factorial", level: "medium", title: "Факториал",
    description: "Считай целое число n от 0 до 10. Выведи n! — произведение чисел от 1 до n. Для n = 0 ответ равен 1.",
    example: "Ввод:\n5\n\nОжидаемый вывод:\n120",
    hints: ["Начни с результата, равного 1.", "Используй цикл, который последовательно умножает результат на числа от 1 до n."],
  },
  {
    id: "reverse", level: "medium", title: "Разверни строку",
    description: "Считай строку без пробелов и выведи её символы в обратном порядке.",
    example: "Ввод:\nprogram\n\nОжидаемый вывод:\nmargorp",
    hints: ["Подумай, как обратиться к символам с конца строки.", "Можно использовать цикл или стандартную операцию разворота строки."],
  },
  {
    id: "vowels", level: "medium", title: "Подсчёт гласных",
    description: "Считай строку из строчных английских букв. Выведи количество букв a, e, i, o, u.",
    example: "Ввод:\neducation\n\nОжидаемый вывод:\n5",
    hints: ["Проверь по очереди каждый символ строки.", "Если символ — гласная, увеличь счётчик на единицу."],
  },
];

function starter(language: Language): string {
  switch (language) {
    case "python":
      return "# Напиши решение здесь\n";
    case "c":
      return "#include <stdio.h>\n\nint main(void) {\n    // Напиши решение здесь\n    return 0;\n}\n";
    case "cpp":
      return "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Напиши решение здесь\n    return 0;\n}\n";
    case "java":
      return "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Напиши решение здесь\n    }\n}\n";
  }
}

function checkStructure(source: string, language: Language, task: Task): string | null {
  if (!source.trim() || source.trim() === starter(language).trim()) {
    return "Ты ещё не написал решение. Добавь код в редактор и попробуй снова.";
  }

  // Комментарии убираем только для простых проверок. Код здесь НЕ выполняется.
  const code = (language === "python"
    ? source.replace(/#.*$/gm, "")
    : source.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, ""));
  const contains = (pattern: RegExp) => pattern.test(code);
  const output: Record<Language, RegExp> = {
    python: /\bprint\s*\(/,
    c: /\bprintf\s*\(/,
    cpp: /\bcout\s*<</,
    java: /\bSystem\.out\.print(?:ln)?\s*\(/,
  };
  const input: Record<Language, RegExp> = {
    python: /\binput\s*\(|\bsys\.stdin\b/,
    c: /\bscanf\s*\(|\bfgets\s*\(/,
    cpp: /\bcin\s*>>|\bgetline\s*\(/,
    java: /\bnext(?:Int|Line|Double)?\s*\(|\bBufferedReader\b/,
  };

  if (language !== "python" && !contains(/\bmain\s*\(/)) {
    return "Не нашёл функцию main, с которой начинается выполнение программы.";
  }
  if (!contains(output[language])) {
    return "Похоже, ты забыл вывести результат. Добавь команду вывода на экран.";
  }
  if (task.id !== "hello" && !contains(input[language])) {
    return "Не вижу чтения входных данных. Числа или строка должны поступать на вход, а не быть прописаны в коде.";
  }

  switch (task.id) {
    case "hello":
      return contains(/Привет, мир!/) ? null : "Проверь, выводишь ли ты именно «Привет, мир!».";
    case "sum":
      return contains(/\+/) ? null : "Чтобы получить сумму, используй оператор + для двух считанных чисел.";
    case "even":
      if (!contains(/%\s*2|&\s*1/)) return "Для проверки чётности пригодится остаток от деления на 2.";
      if (!contains(/\bif\b|\?/)) return "Добавь условие для выбора между двумя вариантами.";
      return contains(/EVEN/) && contains(/ODD/) ? null : "Программа должна выводить EVEN или ODD.";
    case "square":
      return contains(/\*\*\s*2|\bpow\s*\(|\b(?:[a-zA-Z_]\w*)\s*\*\s*(?:[a-zA-Z_]\w*)/) ? null
        : "Не нашёл возведение в квадрат. Умножь число само на себя.";
    case "max":
      return contains(/\bmax\s*\(|\bMath\.max\s*\(|\bif\b|\?/) ? null
        : "Не вижу сравнения чисел. Найди максимум из трёх значений.";
    case "factorial":
      if (!contains(/\bfor\b|\bwhile\b/)) return "Для факториала понадобится цикл.";
      return contains(/\*=|\*\s*[a-zA-Z_]\w*/) ? null : "В цикле нужно накапливать произведение.";
    case "reverse":
      return contains(/\[\s*::\s*-1\s*\]|\breversed\s*\(|\bfor\b|\bwhile\b|\.reverse\s*\(|\bStringBuilder\b/) ? null
        : "Не вижу способа развернуть строку. Попробуй пройти по символам с конца.";
    case "vowels":
      if (!contains(/\bfor\b|\bwhile\b/)) return "Чтобы посчитать гласные, перебери символы строки в цикле.";
      if (!contains(/[aeiou]/)) return "Проверь, есть ли в решении английские гласные a, e, i, o, u.";
      return contains(/\+\+|\+=|\bcount\s*\(|=\s*\w+\s*\+\s*1/) ? null
        : "Не вижу счётчика найденных гласных.";
  }
}

function draftKey(language: Language, taskId: TaskId): string {
  return `codestep-draft-${language}-${taskId}`;
}

export default function TrainingPage() {
  const [language, setLanguage] = useState<Language>("python");
  const [level, setLevel] = useState<Level>("easy");
  const [current, setCurrent] = useState<Task | null>(null);
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [passed, setPassed] = useState(false);
  const [solvedKeys, setSolvedKeys] = useState<string[]>([]);
  const [skipped, setSkipped] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [used, setUsed] = useState<Record<string, TaskId[]>>({});
  const selectedLanguage = LANGUAGES.find((item) => item.id === language)!;

  function changeLanguage(next: Language) {
    setLanguage(next);
    setCurrent(null);
    setFeedback(null);
    setPassed(false);
  }

  function changeLevel(next: Level) {
    setLevel(next);
    setCurrent(null);
    setFeedback(null);
    setPassed(false);
  }

  function generateTask() {
    const pool = TASKS.filter((task) => task.level === level);
    const poolKey = `${language}-${level}`;
    const alreadyUsed = used[poolKey] ?? [];
    const remaining = pool.filter((task) => !alreadyUsed.includes(task.id));
    let candidates = remaining.length > 0 ? remaining : pool;
    if (candidates.length > 1 && current) {
      candidates = candidates.filter((task) => task.id !== current.id);
    }
    const next = candidates[Math.floor(Math.random() * candidates.length)];
    setUsed((previous) => ({
      ...previous,
      [poolKey]: remaining.length > 0 ? [...alreadyUsed, next.id] : [next.id],
    }));
    setCurrent(next);
    setFeedback(null);
    setPassed(false);
    setAttempts(0);
    try {
      setCode(window.localStorage.getItem(draftKey(language, next.id)) ?? starter(language));
    } catch {
      setCode(starter(language));
    }
  }

  function editCode(value: string) {
    setCode(value);
    setFeedback(null);
    setPassed(false);
    if (current) {
      try {
        window.localStorage.setItem(draftKey(language, current.id), value);
      } catch {
        // Страница продолжает работать, даже если локальное хранилище недоступно.
      }
    }
  }

  function checkCode() {
    if (!current) return;
    const error = checkStructure(code, language, current);
    if (error) {
      setFeedback({
        kind: "error",
        title: "Пока не получилось. Попробуй ещё!",
        explanation: error,
        hint: current.hints[Math.min(attempts, 1)],
      });
      setAttempts((value) => value + 1);
      setPassed(false);
      return;
    }
    setPassed(true);
    const solvedKey = `${language}:${current.id}`;
    setSolvedKeys((previous) => previous.includes(solvedKey) ? previous : [...previous, solvedKey]);
    setFeedback({
      kind: "success",
      title: "🎉 Отличная работа! Код выглядит правильным!",
      explanation: "Ты справился с предварительной проверкой! Можно переходить к следующему заданию. 🚀",
    });
  }

  function skipTask() {
    if (current && !passed) setSkipped((value) => value + 1);
    generateTask();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-7 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-9 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <Link href="/" className="text-2xl font-extrabold tracking-tight">
            Code<span className="text-violet-400">Step</span>
          </Link>
          <Link href="/" className="rounded-xl border border-white/15 px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10">
            ← На главную
          </Link>
        </header>

        <section className="mb-6 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-violet-400">Практика программирования</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Твоя тренировка</h1>
          <p className="mt-3 max-w-2xl text-slate-400">
            Выбери язык и сложность, получи задание, напиши программу и проверь своё решение.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {LANGUAGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => changeLanguage(item.id)}
                aria-pressed={language === item.id}
                className={`rounded-xl border px-5 py-3 font-semibold transition ${language === item.id
                  ? "border-violet-400 bg-violet-500/20 text-violet-200"
                  : "border-white/15 bg-white/5 text-slate-300 hover:border-violet-400/60"}`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <label htmlFor="level" className="font-medium text-slate-300">Уровень:</label>
            <select
              id="level"
              value={level}
              onChange={(event) => changeLevel(event.target.value as Level)}
              className="rounded-xl border border-white/20 bg-slate-800 px-4 py-3 text-white"
            >
              <option value="easy">Начальный</option>
              <option value="medium">Продвинутый</option>
            </select>
            <button
              type="button"
              onClick={generateTask}
              className="rounded-xl bg-violet-500 px-6 py-3 font-bold text-white transition hover:bg-violet-400"
            >
              {current ? "Сгенерировать другое задание ↻" : "Начать тренировку →"}
            </button>
          </div>
        </section>

        {!current ? (
          <section className="rounded-3xl border border-dashed border-violet-400/30 bg-slate-900/50 px-6 py-20 text-center">
            <div className="mb-4 text-5xl">⌨️</div>
            <h2 className="text-2xl font-bold">Готов к первой задаче?</h2>
            <p className="mt-3 text-slate-400">Нажми «Начать тренировку», чтобы получить условие.</p>
          </section>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap gap-3 text-sm">
              <span className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3">Язык: <b>{selectedLanguage.name}</b></span>
              <span className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3">Уровень: <b>{level === "easy" ? "Начальный" : "Продвинутый"}</b></span>
              <span className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3">Решено: <b>{solvedKeys.length}</b></span>
              <span className="rounded-xl border border-white/10 bg-slate-900 px-4 py-3">Пропущено: <b>{skipped}</b></span>
            </div>

            <div className="grid items-start gap-5 lg:grid-cols-2">
              <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-violet-400">Задание</p>
                <h2 className="mb-4 text-2xl font-bold">{current.title}</h2>
                <p className="leading-8 text-slate-300">{current.description}</p>
                <div className="mt-7 rounded-2xl border border-white/10 bg-slate-950 p-5">
                  <h3 className="mb-3 text-sm font-bold text-violet-300">Пример</h3>
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-slate-200">{current.example}</pre>
                </div>
                <p className="mt-5 text-sm leading-6 text-slate-400">
                  Пример показывает ожидаемый результат. Программа должна работать и с другими входными данными.
                </p>
              </section>

              <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
                  <span className="font-semibold">Редактор кода</span>
                  <span className="font-mono text-sm text-violet-300">{selectedLanguage.filename}</span>
                </div>
                <textarea
                  value={code}
                  onChange={(event) => editCode(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Tab") {
                      event.preventDefault();
                      const element = event.currentTarget;
                      const start = element.selectionStart;
                      const end = element.selectionEnd;
                      const updated = code.slice(0, start) + "    " + code.slice(end);
                      editCode(updated);
                      requestAnimationFrame(() => {
                        element.selectionStart = start + 4;
                        element.selectionEnd = start + 4;
                      });
                    }
                  }}
                  spellCheck={false}
                  aria-label="Введите программу"
                  className="min-h-[370px] w-full resize-y bg-slate-950 p-5 font-mono text-sm leading-7 text-slate-100 outline-none focus:ring-2 focus:ring-inset focus:ring-violet-400"
                />
                <div className="flex flex-wrap gap-3 border-t border-white/10 p-5">
                  <button type="button" onClick={checkCode} className="rounded-xl bg-violet-500 px-5 py-3 font-semibold transition hover:bg-violet-400">
                    ✓ Проверить код
                  </button>
                  {passed && (
                    <button type="button" onClick={generateTask} className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-400">
                      Следующее задание →
                    </button>
                  )}
                  <button type="button" onClick={skipTask} className="rounded-xl border border-white/20 px-5 py-3 font-medium text-slate-200 transition hover:bg-white/10">
                    Пропустить
                  </button>
                  <button type="button" onClick={() => editCode(starter(language))} className="rounded-xl border border-white/20 px-5 py-3 font-medium text-slate-200 transition hover:bg-white/10">
                    Очистить код
                  </button>
                </div>
              </section>
            </div>

            {feedback && (
              <section
                role="status"
                aria-live="polite"
                className={`mt-5 rounded-2xl border p-6 ${feedback.kind === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10"
                  : "border-amber-500/40 bg-amber-500/10"}`}
              >
                <h3 className="text-lg font-bold">{feedback.title}</h3>
                <p className="mt-2 text-slate-200">{feedback.explanation}</p>
                {feedback.hint && <p className="mt-3 text-amber-200">💡 Подсказка: {feedback.hint}</p>}
                {feedback.kind === "success" && (
                  <p className="mt-4 border-t border-white/10 pt-4 text-xs leading-6 text-slate-400">
                    Это предварительная проверка структуры кода. Программа не запускалась, поэтому
                    правильность для всех входных данных пока не подтверждена.
                  </p>
                )}
              </section>
            )}
          </>
        )}

        <footer className="mt-10 border-t border-white/10 py-6 text-center text-xs leading-6 text-slate-500">
          CodeStep · Учебный проект · Проверка анализирует основные конструкции кода без его выполнения.
          Для полноценного запуска программ потребуется отдельный сервер проверки.
        </footer>
      </div>
    </main>
  );
}

