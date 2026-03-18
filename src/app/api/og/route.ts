import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import { parseOGParams, renderOGImage } from '@/lib/og/render';

export const runtime = 'nodejs';

// GET — standard API usage
export const GET = async (request: NextRequest): Promise<ImageResponse | Response> => {
  try {
    const { searchParams } = new URL(request.url);
    const params = parseOGParams(searchParams);

    if (!params.title || params.title.trim() === '') {
      return new Response(JSON.stringify({ error: 'title is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    params.watermark = true; // GET requests always watermarked (no auth)

    const imageResponse = await renderOGImage(params);
    return imageResponse;
  } catch (error) {
    console.error('OG generation error:', error);
    console.error('Cause:', (error as any)?.cause);
    return new Response(
      JSON.stringify({ error: 'Failed to generate image', detail: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST — editor preview (supports logoUrl as dataURL in body)
export const POST = async (request: NextRequest): Promise<ImageResponse | Response> => {
  try {
    const body = await request.json();
    const params = { ...body };

    if (!params.title || params.title.trim() === '') {
      params.title = 'Untitled';
    }

    // Respect the watermark param from body; default true if not specified
    if (params.watermark === undefined) {
      params.watermark = true;
    }

    const imageResponse = await renderOGImage(params);
    return imageResponse;
  } catch (error) {
    console.error('OG POST error:', error);
    console.error('Cause:', (error as any)?.cause);
    return new Response(
      JSON.stringify({ error: 'Failed to generate image', detail: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
