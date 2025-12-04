import { NextRequest, NextResponse } from 'next/server';

const WORKER_API_URL = process.env.NEXT_PUBLIC_REACTIONS_API_URL || 'http://localhost:8787';

// GET /api/admin/entries - 全コンテンツ取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');
    const status = searchParams.get('status');

    let url = `${WORKER_API_URL}/admin/entries?`;
    if (locale) url += `locale=${locale}&`;
    if (status) url += `status=${status}&`;

    const headers: HeadersInit = {};
    if (WORKER_API_URL.includes('localhost')) {
      headers['x-dev-bypass'] = 'local-development';
    }

    const response = await fetch(url, { headers });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST /api/admin/entries - 新規作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (WORKER_API_URL.includes('localhost')) {
      headers['x-dev-bypass'] = 'local-development';
    }

    const response = await fetch(`${WORKER_API_URL}/admin/entries`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
