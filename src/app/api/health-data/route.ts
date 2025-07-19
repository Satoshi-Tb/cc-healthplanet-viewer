import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://www.healthplanet.jp/status/innerscan.json';

async function handleRequest(request: NextRequest) {
  try {
    let from, to, tag;

    if (request.method === 'GET') {
      const { searchParams } = new URL(request.url);
      from = searchParams.get('from');
      to = searchParams.get('to');
      tag = searchParams.get('tag');
    } else if (request.method === 'POST') {
      const formData = await request.formData();
      from = formData.get('from') as string;
      to = formData.get('to') as string;
      tag = formData.get('tag') as string;
    }

    if (!from || !to) {
      return NextResponse.json(
        { error: 'from and to parameters are required' },
        { status: 400 }
      );
    }

    const accessToken = process.env.HEALTH_PLANET_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Health Planet access token not configured' },
        { status: 500 }
      );
    }

    // Health Planet APIは YYYYMMDDHHMMSS 形式を期待
    const fromFormatted = from.length === 8 ? `${from}000000` : from;
    const toFormatted = to.length === 8 ? `${to}235959` : to;

    const params = new URLSearchParams({
      access_token: accessToken,
      date: '1',
      from: fromFormatted,
      to: toFormatted,
      ...(tag && { tag }),
    });

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    if (!response.ok) {
      console.log("Health Planet API response error:", response)
      throw new Error(`Health Planet API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Health Planet API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch health data' },
      { status: 500 }
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;