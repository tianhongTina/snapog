import satori from 'satori';
import { initWasm, Resvg } from '@resvg/resvg-wasm';
import type { OGParams, TemplateId } from '@/types';
import { TEMPLATES } from './templates';

export const DEFAULT_WIDTH = 1200;
export const DEFAULT_HEIGHT = 630;

// Track WASM initialization state
let wasmInitialized = false;
let wasmInitPromise: Promise<void> | null = null;

const ensureWasmInitialized = async (baseUrl?: string): Promise<void> => {
  if (wasmInitialized) return;
  if (wasmInitPromise) return wasmInitPromise;

  wasmInitPromise = (async () => {
    try {
      // Load WASM from public directory via HTTP
      const wasmUrl = baseUrl ? `${baseUrl}/resvg.wasm` : 'http://localhost:3001/resvg.wasm';
      await initWasm(fetch(wasmUrl));
      wasmInitialized = true;
    } catch (err) {
      console.error('Failed to initialize resvg-wasm:', err);
      wasmInitPromise = null;
      throw err;
    }
  })();

  return wasmInitPromise;
};

// Clamp dimensions to reasonable bounds
const clampDim = (val: number | undefined, def: number, min: number, max: number): number => {
  if (!val || isNaN(val)) return def;
  return Math.max(min, Math.min(max, Math.round(val)));
};

// Font cache to avoid re-fetching on every request
const fontCache = new Map<string, ArrayBuffer>();

const fetchFont = async (url: string): Promise<ArrayBuffer> => {
  if (fontCache.has(url)) return fontCache.get(url)!;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch font: ${url} (${res.status})`);
  const buffer = await res.arrayBuffer();
  fontCache.set(url, buffer);
  return buffer;
};

const loadFonts = async (baseUrl: string): Promise<Array<{
  name: string;
  data: ArrayBuffer;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: 'normal' | 'italic';
}>> => {
  const fontsBase = `${baseUrl}/fonts`;
  try {
    const [
      interRegular,
      interBold,
      robotoRegular,
      robotoBold,
      playfairRegular,
      playfairBold,
      monoRegular,
      monoBold,
    ] = await Promise.all([
      fetchFont(`${fontsBase}/inter-regular.woff`),
      fetchFont(`${fontsBase}/inter-bold.woff`),
      fetchFont(`${fontsBase}/roboto-regular.woff`),
      fetchFont(`${fontsBase}/roboto-bold.woff`),
      fetchFont(`${fontsBase}/playfair-regular.woff`),
      fetchFont(`${fontsBase}/playfair-bold.woff`),
      fetchFont(`${fontsBase}/mono-regular.woff`),
      fetchFont(`${fontsBase}/mono-bold.woff`),
    ]);

    return [
      { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
      { name: 'Roboto', data: robotoRegular, weight: 400, style: 'normal' },
      { name: 'Roboto', data: robotoBold, weight: 700, style: 'normal' },
      { name: 'Playfair Display', data: playfairRegular, weight: 400, style: 'normal' },
      { name: 'Playfair Display', data: playfairBold, weight: 700, style: 'normal' },
      { name: 'JetBrains Mono', data: monoRegular, weight: 400, style: 'normal' },
      { name: 'JetBrains Mono', data: monoBold, weight: 700, style: 'normal' },
    ];
  } catch (err) {
    console.error('Failed to load fonts:', err);
    return [];
  }
};

export const renderOGImage = async (params: OGParams, request?: Request): Promise<Response> => {
  const templateId = (params.template || 'tech-dark') as TemplateId;
  const TemplateComponent = TEMPLATES[templateId] || TEMPLATES['tech-dark'];

  const width = clampDim(params.width, DEFAULT_WIDTH, 400, 2400);
  const height = clampDim(params.height, DEFAULT_HEIGHT, 200, 1260);

  // Determine base URL for fetching public assets
  let baseUrl: string;
  if (request) {
    const url = new URL(request.url);
    baseUrl = `${url.protocol}//${url.host}`;
  } else if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_APP_URL) {
    baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  } else if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    baseUrl = 'http://localhost:3001';
  } else {
    baseUrl = 'http://localhost:3001';
  }

  const fonts = await loadFonts(baseUrl);
  const resolvedParams = { ...params, width, height };
  const element = TemplateComponent(resolvedParams);

  // Apply watermark if enabled
  const wmEnabled =
    params.watermark &&
    (params.watermarkConfig === undefined || params.watermarkConfig.enabled !== false);
  const finalElement = wmEnabled ? addWatermark(element, resolvedParams) : element;

  // Render JSX → SVG via satori
  const svg = await satori(finalElement as any, {
    width,
    height,
    fonts,
  });

  // Initialize WASM resvg and convert SVG → PNG
  await ensureWasmInitialized(baseUrl);
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
  });
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer.buffer as ArrayBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};

const addWatermark = (element: React.ReactElement, params: OGParams): React.ReactElement => {
  const React = require('react');
  const W = params.width || DEFAULT_WIDTH;
  const H = params.height || DEFAULT_HEIGHT;
  const wm = params.watermarkConfig || {
    enabled: true,
    text: 'Made with SnapOG',
    position: 'bottom-right',
    opacity: 0.6,
  };
  const text = wm.text || 'Made with SnapOG';
  const opacity = wm.opacity ?? 0.6;
  const position = wm.position || 'bottom-right';

  const positionStyle: Record<string, string | number> = {
    position: 'absolute',
    color: `rgba(255,255,255,${opacity})`,
    fontSize: 14,
    fontFamily: 'Inter, sans-serif',
    background: `rgba(0,0,0,${opacity * 0.5})`,
    padding: '5px 12px',
    borderRadius: 4,
    display: 'flex',
    letterSpacing: 0.3,
  };

  if (position === 'bottom-right') {
    Object.assign(positionStyle, { bottom: 16, right: 20 });
  } else if (position === 'bottom-left') {
    Object.assign(positionStyle, { bottom: 16, left: 20 });
  } else if (position === 'bottom-center') {
    Object.assign(positionStyle, { bottom: 16, left: '50%' });
  }

  if (position === 'tile') {
    const tiles = [];
    const rows = Math.ceil(H / 140);
    const cols = Math.ceil(W / 380);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        tiles.push(
          React.createElement(
            'div',
            {
              key: `${row}-${col}`,
              style: {
                position: 'absolute',
                top: 80 + row * 140,
                left: 60 + col * 380,
                color: `rgba(255,255,255,${opacity * 0.4})`,
                fontSize: 18,
                fontFamily: 'Inter, sans-serif',
                transform: 'rotate(-30deg)',
                whiteSpace: 'nowrap',
                display: 'flex',
                letterSpacing: 1,
              },
            },
            text
          )
        );
      }
    }
    return React.createElement(
      'div',
      { style: { position: 'relative', width: W, height: H, display: 'flex' } },
      element,
      ...tiles
    );
  }

  return React.createElement(
    'div',
    { style: { position: 'relative', width: W, height: H, display: 'flex' } },
    element,
    React.createElement('div', { style: positionStyle }, text)
  );
};

export const parseOGParams = (searchParams: URLSearchParams): OGParams => {
  const titleStyleStr = searchParams.get('titleStyle');
  const descStyleStr = searchParams.get('descriptionStyle');
  const authorStyleStr = searchParams.get('authorStyle');
  const dateStyleStr = searchParams.get('dateStyle');
  const siteUrlStyleStr = searchParams.get('siteUrlStyle');
  const wmConfigStr = searchParams.get('watermarkConfig');
  const logoConfigStr = searchParams.get('logoConfig');

  return {
    template: (searchParams.get('template') || 'tech-dark') as TemplateId,
    title: searchParams.get('title') || 'Untitled',
    description: searchParams.get('description') || undefined,
    author: searchParams.get('author') || undefined,
    date: searchParams.get('date') || undefined,
    logoUrl: searchParams.get('logoUrl') || undefined,
    siteUrl: searchParams.get('siteUrl') || undefined,
    font: (searchParams.get('font') || undefined) as any,
    primaryColor: searchParams.get('primaryColor') || undefined,
    backgroundColor: searchParams.get('backgroundColor') || undefined,
    textColor: searchParams.get('textColor') || undefined,
    width: searchParams.get('width') ? Number(searchParams.get('width')) : undefined,
    height: searchParams.get('height') ? Number(searchParams.get('height')) : undefined,
    watermark: searchParams.get('watermark') !== 'false',
    titleStyle: titleStyleStr ? JSON.parse(titleStyleStr) : undefined,
    descriptionStyle: descStyleStr ? JSON.parse(descStyleStr) : undefined,
    authorStyle: authorStyleStr ? JSON.parse(authorStyleStr) : undefined,
    dateStyle: dateStyleStr ? JSON.parse(dateStyleStr) : undefined,
    siteUrlStyle: siteUrlStyleStr ? JSON.parse(siteUrlStyleStr) : undefined,
    watermarkConfig: wmConfigStr ? JSON.parse(wmConfigStr) : undefined,
    logoConfig: logoConfigStr ? JSON.parse(logoConfigStr) : undefined,
  };
};
