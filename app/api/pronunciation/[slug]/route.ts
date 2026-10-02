import { NextResponse } from 'next/server';
import { GLOSSARY_DATA } from '../../../../src/constants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = GLOSSARY_DATA.find((item) => item.id === slug);
  if (!term) {
    return NextResponse.json({ error: 'Glossary term not found.' }, { status: 404 });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID;
  if (!apiKey || !voiceId) {
    return NextResponse.json(
      { error: 'Pronunciation service is not configured.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_v3';
  const outputFormat = process.env.ELEVENLABS_OUTPUT_FORMAT || 'mp3_44100_128';

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${encodeURIComponent(outputFormat)}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: term.term,
          model_id: modelId,
          apply_text_normalization: 'auto',
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'ElevenLabs could not generate this pronunciation.' },
        { status: 502, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    const audio = await response.arrayBuffer();
    return new NextResponse(audio, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'audio/mpeg',
        'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'Pronunciation service could not be reached.' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
