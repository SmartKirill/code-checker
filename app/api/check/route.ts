
import { NextRequest, NextResponse } from 'next/server';




type TestSubmission = {
  language_id: number;
  source_code: string;
  stdin: string;
  expected_output: string;
};

const allowedLanguages = new Set([71, 63, 54, 62]);

function settings() {
  const rawUrl = process.env.JUDGE0_URL;

  if (!rawUrl) {
    throw new Error(
      'Проверка ещё не настроена: JUDGE0_URL отсутствует на сервере.'
    );
  }

  const parsedUrl = new URL(rawUrl);

  if (
    parsedUrl.protocol !== 'https:' &&
    parsedUrl.protocol !== 'http:'
  ) {
    throw new Error('Некорректный адрес Judge0.');
  }

  const baseUrl = parsedUrl.toString().replace(/\/+$/, '');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (process.env.JUDGE0_AUTH_TOKEN) {
    headers['X-Auth-Token'] = process.env.JUDGE0_AUTH_TOKEN;
  }

  return { baseUrl, headers };
}

function b64(text: string) {
  return Buffer.from(text, 'utf8').toString('base64');
}

function decode(value: unknown): string | null {
  if (value == null || typeof value !== 'string') {
    return null;
  }

  try {
    return Buffer.from(value, 'base64').toString('utf8');
  } catch {
    return null;
  }
}

function failure(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : 'Ошибка сервера проверки';

  console.error('CodeStep check failed:', message);

  return NextResponse.json(
    { error: message },
    { status: 502 }
  );
}

async function upstreamJson(url: string, init: RequestInit) {
  const response = await fetch(url, {
    ...init,
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  });

  const raw = await response.text();
  let data: unknown;

  try {
    data = JSON.parse(raw);
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      `Judge0 вернул HTTP ${response.status}. Проверь адрес и доступ к API.`
    );
  }

  if (data === null) {
    throw new Error(
      'Judge0 вернул некорректный ответ вместо JSON.'
    );
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const { baseUrl, headers } = settings();

    const body = await request.json() as {
      submissions?: unknown;
    };

    if (
      !Array.isArray(body.submissions) ||
      body.submissions.length === 0 ||
      body.submissions.length > 10
    ) {
      return NextResponse.json(
        { error: 'Допускается от 1 до 10 тестов.' },
        { status: 400 }
      );
    }

    const tests: TestSubmission[] = body.submissions;

    if (
      tests.some(
        (t) =>
          !t ||
          !allowedLanguages.has(t.language_id) ||
          typeof t.source_code !== 'string' ||
          t.source_code.length > 20000 ||
          typeof t.stdin !== 'string' ||
          t.stdin.length > 5000 ||
          typeof t.expected_output !== 'string' ||
          t.expected_output.length > 5000
      )
    ) {
      return NextResponse.json(
        { error: 'Некорректные или слишком большие тесты.' },
        { status: 400 }
      );
    }

    const submissions = tests.map((t) => ({
      language_id: t.language_id,
      source_code: b64(t.source_code),
      stdin: b64(t.stdin),
      expected_output: b64(t.expected_output),
      cpu_time_limit: 2,
      wall_time_limit: 5,
      memory_limit: 128000,
    }));

    const result = await upstreamJson(
      `${baseUrl}/submissions/batch?base64_encoded=true`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify({ submissions }),
      }
    );

    if (
      !Array.isArray(result) ||
      result.length !== tests.length ||
      result.some(
        (r) => !r || typeof r.token !== 'string'
      )
    ) {
      throw new Error(
        'Judge0 не принял некоторые тесты или вернул неожиданный ответ.'
      );
    }

    return NextResponse.json({
      tokens: result.map((r) => r.token),
    });
  } catch (error) {
    return failure(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { baseUrl, headers } = settings();

    const tokens =
      request.nextUrl.searchParams
        .get('tokens')
        ?.split(',') || [];

    if (
      tokens.length === 0 ||
      tokens.length > 10 ||
      tokens.some(
        (t) => !/^[a-f0-9-]{36}$/i.test(t)
      )
    ) {
      return NextResponse.json(
        { error: 'Некорректные идентификаторы тестов.' },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      tokens: tokens.join(','),
      base64_encoded: 'true',
      fields:
        'token,status_id,stdout,stderr,compile_output,message',
    });

    const data = await upstreamJson(
      `${baseUrl}/submissions/batch?${params}`,
      { headers }
    ) as {
      submissions?: Array<{
        status_id?: number;
        status?: { id?: number };
        stdout?: string | null;
        stderr?: string | null;
        compile_output?: string | null;
        message?: string | null;
      }>;
    };

    if (!Array.isArray(data.submissions)) {
      throw new Error(
        'Judge0 не вернул результаты тестов.'
      );
    }

    return NextResponse.json({
      submissions: data.submissions.map((s) => ({
        status_id: s.status_id ?? s.status?.id ?? 0,
        stdout: decode(s.stdout),
        stderr: decode(s.stderr),
        compile_output: decode(s.compile_output),
        message: decode(s.message),
      })),
    });
  } catch (error) {
    return failure(error);
  }
}
