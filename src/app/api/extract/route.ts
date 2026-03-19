import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import type { ExtractResult } from '@/types';

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; SnapOG/1.0; +https://snapog.com/bot)',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: 400 }
      );
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return NextResponse.json(
        { error: 'URL does not return HTML content' },
        { status: 400 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const getMetaContent = (property: string): string | undefined => {
      return (
        $(`meta[property="${property}"]`).attr('content') ||
        $(`meta[name="${property}"]`).attr('content') ||
        undefined
      );
    };

    const result: ExtractResult = {
      url,
      title:
        getMetaContent('og:title') ||
        getMetaContent('twitter:title') ||
        $('title').text().trim() ||
        undefined,
      description:
        getMetaContent('og:description') ||
        getMetaContent('twitter:description') ||
        getMetaContent('description') ||
        undefined,
      image:
        getMetaContent('og:image') ||
        getMetaContent('twitter:image') ||
        undefined,
      icon:
        $('link[rel="icon"]').attr('href') ||
        $('link[rel="shortcut icon"]').attr('href') ||
        $('link[rel="apple-touch-icon"]').attr('href') ||
        undefined,
    };

    // Resolve relative URLs for icon
    if (result.icon && !result.icon.startsWith('http')) {
      try {
        const base = new URL(url);
        result.icon = new URL(result.icon, base).toString();
      } catch {
        result.icon = undefined;
      }
    }

    // Truncate long descriptions
    if (result.description && result.description.length > 200) {
      result.description = result.description.substring(0, 197) + '...';
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Extract error:', error);
    return NextResponse.json(
      { error: 'Failed to extract metadata from URL' },
      { status: 500 }
    );
  }
};
