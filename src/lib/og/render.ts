import { ImageResponse } from '@vercel/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { OGParams, TemplateId } from '@/types';
import { TEMPLATES } from './templates';

export const DEFAULT_WIDTH = 1200;
export const DEFAULT_HEIGHT = 630;

// Clamp dimensions to reasonable bounds
const clampDim = (val: number | undefined, def: number, min: number, max: number): number => {
  if (!val || isNaN(val)) return def;
  return Math.max(min, Math.min(max, Math.round(val)));
};

export const renderOGImage = async (params: OGParams): Promise<ImageResponse> => {
  const templateId = (params.template || 'tech-dark') as TemplateId;
  const TemplateComponent = TEMPLATES[templateId] || TEMPLATES['tech-dark'];

  const width = clampDim(params.width, DEFAULT_WIDTH, 400, 2400);
  const height = clampDim(params.height, DEFAULT_HEIGHT, 200, 1260);

  const fonts = loadFonts();
  // Pass resolved dimensions into the template via params
  const resolvedParams = { ...params, width, height };
  const element = TemplateComponent(resolvedParams);
  // Apply watermark if: watermark=true AND (no watermarkConfig OR watermarkConfig.enabled=true)
  const wmEnabled = params.watermark &&
    (params.watermarkConfig === undefined || params.watermarkConfig.enabled !== false);
  const finalElement = wmEnabled ? addWatermark(element, resolvedParams) : element;

  return new ImageResponse(finalElement, {
    width,
    height,
    fonts,
  });
};

const addWatermark = (element: React.ReactElement, params: OGParams): React.ReactElement => {
  const React = require('react');
  const W = params.width || DEFAULT_WIDTH;
  const H = params.height || DEFAULT_HEIGHT;
  const wm = params.watermarkConfig || { enabled: true, text: 'Made with SnapOG', position: 'bottom-right', opacity: 0.6 };
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
    Object.assign(positionStyle, { bottom: 16, left: '50%', transform: 'translateX(-50%)' });
  }

  if (position === 'tile') {
    const tiles = [];
    const rows = Math.ceil(H / 140);
    const cols = Math.ceil(W / 380);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        tiles.push(
          React.createElement('div', {
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
          }, text)
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

const loadFonts = () => {
  try {
    const fontsDir = join(process.cwd(), 'public', 'fonts');

    const toBuffer = (buf: Buffer): ArrayBuffer => {
      const ab = new ArrayBuffer(buf.byteLength);
      const view = new Uint8Array(ab);
      view.set(buf);
      return ab;
    };

    const interRegular = toBuffer(readFileSync(join(fontsDir, 'inter-regular.woff')));
    const interBold = toBuffer(readFileSync(join(fontsDir, 'inter-bold.woff')));
    const robotoRegular = toBuffer(readFileSync(join(fontsDir, 'roboto-regular.woff')));
    const robotoBold = toBuffer(readFileSync(join(fontsDir, 'roboto-bold.woff')));
    const playfairRegular = toBuffer(readFileSync(join(fontsDir, 'playfair-regular.woff')));
    const playfairBold = toBuffer(readFileSync(join(fontsDir, 'playfair-bold.woff')));
    const monoRegular = toBuffer(readFileSync(join(fontsDir, 'mono-regular.woff')));
    const monoBold = toBuffer(readFileSync(join(fontsDir, 'mono-bold.woff')));

    return [
      { name: 'Inter', data: interRegular, weight: 400 as const, style: 'normal' as const },
      { name: 'Inter', data: interBold, weight: 700 as const, style: 'normal' as const },
      { name: 'Roboto', data: robotoRegular, weight: 400 as const, style: 'normal' as const },
      { name: 'Roboto', data: robotoBold, weight: 700 as const, style: 'normal' as const },
      { name: 'Playfair Display', data: playfairRegular, weight: 400 as const, style: 'normal' as const },
      { name: 'Playfair Display', data: playfairBold, weight: 700 as const, style: 'normal' as const },
      { name: 'JetBrains Mono', data: monoRegular, weight: 400 as const, style: 'normal' as const },
      { name: 'JetBrains Mono', data: monoBold, weight: 700 as const, style: 'normal' as const },
    ];
  } catch (err) {
    console.error('Failed to load local fonts:', err);
    return [];
  }
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
