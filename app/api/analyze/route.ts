import { NextRequest, NextResponse } from 'next/server';

// Keep the failed photo/analysis flow closed until the connected account is funded.
// The owner can restore it with BREAD_ANALYZER_ENABLED=true after verifying billing.
const enabled = () => process.env.BREAD_ANALYZER_ENABLED === 'true';
const unavailable = 'AI bake analysis is temporarily unavailable. Use the troubleshooting glossary to work through the symptoms of your loaf.';

export async function GET() {
  return NextResponse.json({ available: enabled(), message: unavailable }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest) {
  if (!enabled()) return NextResponse.json({ error: unavailable }, { status: 503 });
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Anthropic API key not configured' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { prompt, image, imageMediaType } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid prompt' },
        { status: 400 }
      );
    }

    // Build message content: text-only or text + image
    type TextBlock = { type: 'text'; text: string };
    type ImageBlock = {
      type: 'image';
      source: { type: 'base64'; media_type: string; data: string };
    };
    type ContentBlock = TextBlock | ImageBlock;

    const content: ContentBlock[] = [];

    if (image && imageMediaType) {
      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: imageMediaType,
          data: image,
        },
      });
    }

    content.push({ type: 'text', text: prompt });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic analysis request failed:', response.status);
      return NextResponse.json(
        { error: 'Analysis service unavailable' },
        { status: 502 }
      );
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (err) {
    console.error('Analyze route error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
