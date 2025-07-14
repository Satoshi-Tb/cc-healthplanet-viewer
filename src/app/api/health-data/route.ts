import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://www.healthplanet.jp/status/innerscan.json';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const tag = searchParams.get('tag');

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

    const params = new URLSearchParams({
      access_token: accessToken,
      date: '1',
      from,
      to,
      ...(tag && { tag }),
    });

    const response = await fetch(`${BASE_URL}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
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