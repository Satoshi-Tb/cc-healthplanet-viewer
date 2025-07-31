import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono().basePath('/api');

const BASE_URL = 'https://www.healthplanet.jp/status/innerscan.json';

app.get('/health-data', async (c) => {
  try {
    const from = c.req.query('from');
    const to = c.req.query('to');
    const tag = c.req.query('tag');

    if (!from || !to) {
      return c.json(
        { error: 'from and to parameters are required' },
        400
      );
    }

    const accessToken = process.env.HEALTH_PLANET_ACCESS_TOKEN;
    if (!accessToken) {
      return c.json(
        { error: 'Health Planet access token not configured' },
        500
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
      console.log("Health Planet API response error:", response);
      throw new Error(`Health Planet API error: ${response.status}`);
    }

    const data = await response.json();

    return c.json(data);
  } catch (error) {
    console.error('Health Planet API error:', error);
    return c.json(
      { error: 'Failed to fetch health data' },
      500
    );
  }
});

app.post('/health-data', async (c) => {
  try {
    const formData = await c.req.formData();
    const from = formData.get('from') as string;
    const to = formData.get('to') as string;
    const tag = formData.get('tag') as string;

    if (!from || !to) {
      return c.json(
        { error: 'from and to parameters are required' },
        400
      );
    }

    const accessToken = process.env.HEALTH_PLANET_ACCESS_TOKEN;
    if (!accessToken) {
      return c.json(
        { error: 'Health Planet access token not configured' },
        500
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
      console.log("Health Planet API response error:", response);
      throw new Error(`Health Planet API error: ${response.status}`);
    }

    const data = await response.json();

    return c.json(data);
  } catch (error) {
    console.error('Health Planet API error:', error);
    return c.json(
      { error: 'Failed to fetch health data' },
      500
    );
  }
});

export const GET = handle(app);
export const POST = handle(app);