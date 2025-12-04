import { NextRequest, NextResponse } from 'next/server';

const WORKER_API_URL = process.env.NEXT_PUBLIC_REACTIONS_API_URL || 'http://localhost:8787';

// GET /api/admin/entries/:id - 単一コンテンツ取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers: HeadersInit = {};
    if (WORKER_API_URL.includes('localhost')) {
      headers['x-dev-bypass'] = 'local-development';
    }

    const response = await fetch(`${WORKER_API_URL}/admin/entries/${id}`, { headers });
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

// PUT /api/admin/entries/:id - 更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (WORKER_API_URL.includes('localhost')) {
      headers['x-dev-bypass'] = 'local-development';
    }

    const response = await fetch(`${WORKER_API_URL}/admin/entries/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

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

// DELETE /api/admin/entries/:id - 削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const headers: HeadersInit = {};
    if (WORKER_API_URL.includes('localhost')) {
      headers['x-dev-bypass'] = 'local-development';
    }

    const response = await fetch(`${WORKER_API_URL}/admin/entries/${id}`, {
      method: 'DELETE',
      headers,
    });

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
