import type { OGParams, TextStyle, FontId } from '@/types';
import { ReactElement } from 'react';

type TemplateProps = OGParams;

const DEFAULT_W = 1200;
const DEFAULT_H = 630;

// Get effective canvas dimensions from props
const W = (props: TemplateProps) => props.width || DEFAULT_W;
const H = (props: TemplateProps) => props.height || DEFAULT_H;

// Title font size scales with canvas width
const titleSize = (title: string, w = DEFAULT_W) => {
  const scale = w / DEFAULT_W;
  const base = title.length > 50 ? 44 : title.length > 30 ? 56 : 68;
  return Math.round(base * scale);
};

// Calculate logo borderRadius based on shape config
const getLogoBorderRadius = (shape?: string, size?: number): number => {
  if (shape === 'circle') return (size || 32) / 2; // fully circular
  if (shape === 'rounded') return (size || 32) / 8; // slightly rounded
  return 2; // square with minimal rounding
};

// Get logo size (default 32px)
const getLogoSize = (size?: number): number => size || 32;

// Map FontId to CSS font-family string
const fontFamily = (font?: FontId): string => {
  switch (font) {
    case 'roboto': return 'Roboto, sans-serif';
    case 'playfair': return 'Playfair Display, serif';
    case 'mono': return 'JetBrains Mono, monospace';
    case 'inter':
    default: return 'Inter, sans-serif';
  }
};

// Merge base style with per-field TextStyle overrides
const mergeTextStyle = (
  base: Record<string, string | number>,
  style?: TextStyle
): Record<string, string | number> => {
  if (!style) return base;
  return {
    ...base,
    ...(style.color ? { color: style.color } : {}),
    ...(style.font ? { fontFamily: fontFamily(style.font) } : {}),
    ...(style.size ? { fontSize: style.size } : {}),
  };
};

// ===== tech-dark =====
export const TechDarkTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#00ff88';
  const bg = props.backgroundColor || '#0a0a0a';
  const fg = props.textColor || '#ffffff';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', fontFamily: fontFamily(props.font), position: 'relative' }}>
      {/* Left accent bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: 5, height: H(props), background: accent, display: 'flex' }} />
      {/* Top-right corner decoration */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, border: `1px solid ${accent}22`, borderRadius: 160, display: 'flex' }} />
      <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, border: `1px solid ${accent}44`, borderRadius: 100, display: 'flex' }} />
      {/* Bottom right dot grid */}
      <div style={{ position: 'absolute', bottom: 40, right: 60, display: 'flex', gap: 10 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[0,1,2,3].map(j => (
              <div key={j} style={{ width: 4, height: 4, borderRadius: 2, background: `${accent}44`, display: 'flex' }} />
            ))}
          </div>
        ))}
      </div>
      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 80px', flex: 1 }}>
        {props.siteUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
            {props.logoUrl ? (
              <img 
                src={props.logoUrl} 
                width={getLogoSize(props.logoConfig?.size)} 
                height={getLogoSize(props.logoConfig?.size)} 
                style={{ 
                  marginRight: 10, 
                  borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size),
                  objectFit: 'contain'
                }} 
              />
            ) : null}
            <div style={mergeTextStyle({ color: accent, fontSize: 16, letterSpacing: 3, textTransform: 'uppercase', display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div>
          </div>
        ) : null}
        <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 700, lineHeight: 1.1, marginBottom: 24, display: 'flex', flexWrap: 'wrap', maxWidth: 900 }, props.titleStyle)}>
          {props.title}
        </div>
        {props.description ? (
          <div style={mergeTextStyle({ color: `${fg}99`, fontSize: 24, lineHeight: 1.6, maxWidth: 780, display: 'flex', flexWrap: 'wrap' }, props.descriptionStyle)}>{props.description}</div>
        ) : null}
        {props.author ? (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 40 }}>
            <div style={{ width: 24, height: 2, background: accent, marginRight: 12, display: 'flex' }} />
            <div style={mergeTextStyle({ color: `${fg}77`, fontSize: 18, display: 'flex' }, props.authorStyle)}>{props.author}</div>
          </div>
        ) : null}
        {props.date ? (
          <div style={mergeTextStyle({ color: `${fg}55`, fontSize: 15, marginTop: 12, display: 'flex' }, props.dateStyle)}>{props.date}</div>
        ) : null}
      </div>
    </div>
  );
};

// ===== tech-light =====
export const TechLightTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#3b82f6';
  const bg = props.backgroundColor || '#ffffff';
  const fg = props.textColor || '#0f172a';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', fontFamily: fontFamily(props.font), position: 'relative' }}>
      {/* Top gradient bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${accent}, ${accent}88)`, display: 'flex' }} />
      {/* Right side decoration */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 380, background: `${accent}06`, borderLeft: `1px solid ${accent}15`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: `${accent}15`, border: `2px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {props.logoUrl
            ? <img src={props.logoUrl} width={getLogoSize(props.logoConfig?.size)} height={getLogoSize(props.logoConfig?.size)} style={{ borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size), objectFit: 'contain' }} />
            : <div style={{ width: 40, height: 40, borderRadius: 10, background: accent, display: 'flex' }} />
          }
        </div>
        {props.siteUrl ? (
          <div style={mergeTextStyle({ color: accent, fontSize: 16, marginTop: 20, fontWeight: 600, letterSpacing: 1, display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div>
        ) : null}
      </div>
      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 80px', width: 820 }}>
        <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 700, lineHeight: 1.1, marginBottom: 20, display: 'flex', flexWrap: 'wrap' }, props.titleStyle)}>
          {props.title}
        </div>
        {props.description ? (
          <div style={mergeTextStyle({ color: `${fg}88`, fontSize: 24, lineHeight: 1.6, display: 'flex', flexWrap: 'wrap' }, props.descriptionStyle)}>{props.description}</div>
        ) : null}
        {props.author ? (
          <div style={{ display: 'flex', marginTop: 36 }}>
            <div style={mergeTextStyle({ background: `${accent}15`, color: accent, fontSize: 16, padding: '6px 16px', borderRadius: 20, display: 'flex' }, props.authorStyle)}>{props.author}</div>
          </div>
        ) : null}
        {props.date ? (
          <div style={mergeTextStyle({ color: `${fg}44`, fontSize: 14, marginTop: 12, display: 'flex' }, props.dateStyle)}>{props.date}</div>
        ) : null}
      </div>
    </div>
  );
};

// ===== blog-clean =====
export const BlogCleanTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#111827';
  const bg = props.backgroundColor || '#fafaf9';
  const fg = props.textColor || '#111827';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', flexDirection: 'column', fontFamily: fontFamily(props.font), padding: '72px 96px', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {props.siteUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
            {props.logoUrl ? <img src={props.logoUrl} width={getLogoSize(props.logoConfig?.size || 24)} height={getLogoSize(props.logoConfig?.size || 24)} style={{ marginRight: 8, borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size || 24), objectFit: 'contain' }} /> : null}
            <div style={mergeTextStyle({ color: `${fg}66`, fontSize: 16, letterSpacing: 1, display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div>
          </div>
        ) : null}
        <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 800, lineHeight: 1.1, display: 'flex', flexWrap: 'wrap', maxWidth: 960 }, props.titleStyle)}>
          {props.title}
        </div>
        {props.description ? (
          <div style={mergeTextStyle({ color: `${fg}77`, fontSize: 22, lineHeight: 1.7, marginTop: 20, maxWidth: 860, display: 'flex', flexWrap: 'wrap' }, props.descriptionStyle)}>{props.description}</div>
        ) : null}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 28, borderTop: `2px solid ${accent}22` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {props.author ? <div style={mergeTextStyle({ color: fg, fontSize: 18, fontWeight: 600, display: 'flex' }, props.authorStyle)}>{props.author}</div> : null}
          {props.date ? <div style={mergeTextStyle({ color: `${fg}55`, fontSize: 16, display: 'flex' }, props.dateStyle)}>{props.date}</div> : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: accent, marginRight: 8, display: 'flex' }} />
          <div style={mergeTextStyle({ color: accent, fontSize: 16, fontWeight: 700, display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl || 'SnapOG'}</div>
        </div>
      </div>
    </div>
  );
};

// ===== blog-card =====
export const BlogCardTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#6366f1';
  const bg = props.backgroundColor || '#f1f5f9';
  const fg = props.textColor || '#1e293b';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fontFamily(props.font) }}>
      <div style={{ background: '#ffffff', borderRadius: 28, padding: '56px 72px', width: 1040, minHeight: 480, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 25px 60px rgba(0,0,0,0.12)' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
            {props.logoUrl
              ? <img src={props.logoUrl} width={getLogoSize(props.logoConfig?.size || 36)} height={getLogoSize(props.logoConfig?.size || 36)} style={{ borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size || 36), marginRight: 12, objectFit: 'contain' }} />
              : <div style={{ width: 36, height: 36, borderRadius: 8, background: `${accent}20`, marginRight: 12, display: 'flex' }} />
            }
            {props.siteUrl ? <div style={mergeTextStyle({ color: `${fg}77`, fontSize: 16, display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div> : null}
          </div>
          <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 700, lineHeight: 1.15, marginBottom: 16, display: 'flex', flexWrap: 'wrap' }, props.titleStyle)}>
            {props.title}
          </div>
          {props.description ? (
            <div style={mergeTextStyle({ color: `${fg}88`, fontSize: 22, lineHeight: 1.6, display: 'flex', flexWrap: 'wrap' }, props.descriptionStyle)}>{props.description}</div>
          ) : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {props.author ? <div style={mergeTextStyle({ color: fg, fontSize: 17, fontWeight: 600, display: 'flex' }, props.authorStyle)}>{props.author}</div> : null}
            {props.date ? <div style={mergeTextStyle({ color: `${fg}55`, fontSize: 15, display: 'flex' }, props.dateStyle)}>{props.date}</div> : null}
          </div>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: accent, display: 'flex' }} />
        </div>
      </div>
    </div>
  );
};

// ===== gradient-1 (purple-blue) =====
export const Gradient1Template = (props: TemplateProps): ReactElement => {
  const customBg = props.backgroundColor;
  const bgStyle = customBg || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)';
  const fg = props.textColor || '#ffffff';
  return (
    <div style={{ width: W(props), height: H(props), background: bgStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: fontFamily(props.font), padding: '60px 80px', position: 'relative' }}>
      {/* Background circles */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: 200, background: 'rgba(255,255,255,0.05)', display: 'flex' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: 140, background: 'rgba(255,255,255,0.06)', display: 'flex' }} />
      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {props.siteUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
            {props.logoUrl ? <img src={props.logoUrl} width={getLogoSize(props.logoConfig?.size || 24)} height={getLogoSize(props.logoConfig?.size || 24)} style={{ marginRight: 8, borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size || 24), objectFit: 'contain' }} /> : null}
            <div style={mergeTextStyle({ color: 'rgba(255,255,255,0.7)', fontSize: 16, letterSpacing: 2, textTransform: 'uppercase', display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div>
          </div>
        ) : null}
        <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 700, lineHeight: 1.1, textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 960 }, props.titleStyle)}>
          {props.title}
        </div>
        {props.description ? (
          <div style={mergeTextStyle({ color: 'rgba(255,255,255,0.78)', fontSize: 24, lineHeight: 1.5, marginTop: 24, textAlign: 'center', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 800 }, props.descriptionStyle)}>{props.description}</div>
        ) : null}
        {props.author ? (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 36 }}>
            <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.5)', marginRight: 12, display: 'flex' }} />
            <div style={mergeTextStyle({ color: 'rgba(255,255,255,0.65)', fontSize: 18, display: 'flex' }, props.authorStyle)}>{props.author}</div>
            <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.5)', marginLeft: 12, display: 'flex' }} />
          </div>
        ) : null}
        {props.date ? (
          <div style={mergeTextStyle({ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 12, display: 'flex' }, props.dateStyle)}>{props.date}</div>
        ) : null}
      </div>
    </div>
  );
};

// ===== gradient-2 (orange-coral) =====
export const Gradient2Template = (props: TemplateProps): ReactElement => {
  const customBg = props.backgroundColor;
  const bgStyle = customBg || 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #dc2626 100%)';
  const fg = props.textColor || '#ffffff';
  return (
    <div style={{ width: W(props), height: H(props), background: bgStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: fontFamily(props.font), padding: '64px 96px', position: 'relative' }}>
      {/* Decorative shapes */}
      <div style={{ position: 'absolute', top: 40, right: 60, width: 160, height: 160, borderRadius: 80, border: '2px solid rgba(255,255,255,0.15)', display: 'flex' }} />
      <div style={{ position: 'absolute', bottom: 30, right: 120, width: 80, height: 80, borderRadius: 40, background: 'rgba(255,255,255,0.1)', display: 'flex' }} />
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {props.siteUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
            {props.logoUrl ? <img src={props.logoUrl} width={getLogoSize(props.logoConfig?.size || 24)} height={getLogoSize(props.logoConfig?.size || 24)} style={{ marginRight: 8, borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size || 24), objectFit: 'contain' }} /> : null}
            <div style={mergeTextStyle({ color: 'rgba(255,255,255,0.75)', fontSize: 16, letterSpacing: 2, display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div>
          </div>
        ) : null}
        <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 800, lineHeight: 1.1, marginBottom: 22, display: 'flex', flexWrap: 'wrap', maxWidth: 900 }, props.titleStyle)}>
          {props.title}
        </div>
        {props.description ? (
          <div style={mergeTextStyle({ color: 'rgba(255,255,255,0.82)', fontSize: 24, lineHeight: 1.6, display: 'flex', flexWrap: 'wrap', maxWidth: 800 }, props.descriptionStyle)}>{props.description}</div>
        ) : null}
        {props.author ? (
          <div style={{ display: 'flex', marginTop: 36 }}>
            <div style={mergeTextStyle({ background: 'rgba(255,255,255,0.2)', color: fg, fontSize: 17, padding: '8px 20px', borderRadius: 8, display: 'flex' }, props.authorStyle)}>{props.author}</div>
          </div>
        ) : null}
        {props.date ? (
          <div style={mergeTextStyle({ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 12, display: 'flex' }, props.dateStyle)}>{props.date}</div>
        ) : null}
      </div>
    </div>
  );
};

// ===== minimal-dark =====
export const MinimalDarkTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#f59e0b';
  const bg = props.backgroundColor || '#111111';
  const fg = props.textColor || '#f5f5f5';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 100px', fontFamily: fontFamily(props.font), position: 'relative' }}>
      {/* Subtle right accent */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, transparent, ${accent}, transparent)`, display: 'flex' }} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {props.siteUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
            {props.logoUrl ? <img src={props.logoUrl} width={getLogoSize(props.logoConfig?.size || 22)} height={getLogoSize(props.logoConfig?.size || 22)} style={{ marginRight: 8, borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size || 22), objectFit: 'contain' }} /> : null}
            <div style={mergeTextStyle({ color: accent, fontSize: 15, letterSpacing: 3, textTransform: 'uppercase', display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div>
          </div>
        ) : null}
        <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 700, lineHeight: 1.1, display: 'flex', flexWrap: 'wrap', maxWidth: 900 }, props.titleStyle)}>
          {props.title}
        </div>
        {props.description ? (
          <div style={mergeTextStyle({ color: `${fg}66`, fontSize: 23, lineHeight: 1.65, marginTop: 24, maxWidth: 780, display: 'flex', flexWrap: 'wrap' }, props.descriptionStyle)}>{props.description}</div>
        ) : null}
        {props.author ? (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 44 }}>
            <div style={{ width: 32, height: 2, background: accent, marginRight: 14, display: 'flex' }} />
            <div style={mergeTextStyle({ color: `${fg}55`, fontSize: 17, display: 'flex' }, props.authorStyle)}>{props.author}</div>
          </div>
        ) : null}
        {props.date ? (
          <div style={mergeTextStyle({ color: `${fg}40`, fontSize: 14, marginTop: 10, display: 'flex' }, props.dateStyle)}>{props.date}</div>
        ) : null}
      </div>
    </div>
  );
};

// ===== minimal-light =====
export const MinimalLightTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#18181b';
  const bg = props.backgroundColor || '#fafafa';
  const fg = props.textColor || '#18181b';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 100px', fontFamily: fontFamily(props.font), position: 'relative' }}>
      {/* Top left corner accent */}
      <div style={{ position: 'absolute', top: 48, left: 100, width: 48, height: 3, background: accent, display: 'flex' }} />
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20 }}>
        {props.siteUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
            {props.logoUrl ? <img src={props.logoUrl} width={getLogoSize(props.logoConfig?.size || 20)} height={getLogoSize(props.logoConfig?.size || 20)} style={{ marginRight: 8, borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size || 20), objectFit: 'contain' }} /> : null}
            <div style={mergeTextStyle({ color: `${fg}55`, fontSize: 15, letterSpacing: 2, display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div>
          </div>
        ) : null}
        <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 700, lineHeight: 1.1, display: 'flex', flexWrap: 'wrap', maxWidth: 900 }, props.titleStyle)}>
          {props.title}
        </div>
        {props.description ? (
          <div style={mergeTextStyle({ color: `${fg}66`, fontSize: 23, lineHeight: 1.65, marginTop: 22, maxWidth: 780, display: 'flex', flexWrap: 'wrap' }, props.descriptionStyle)}>{props.description}</div>
        ) : null}
        {props.author ? (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 40 }}>
            <div style={mergeTextStyle({ color: `${fg}44`, fontSize: 17, display: 'flex' }, props.authorStyle)}>{props.author}</div>
            {props.date ? <div style={mergeTextStyle({ color: `${fg}33`, fontSize: 15, marginLeft: 16, display: 'flex' }, props.dateStyle)}>{props.date}</div> : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ===== startup =====
export const StartupTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#2563eb';
  const bg = props.backgroundColor || '#0f172a';
  const fg = props.textColor || '#f8fafc';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', fontFamily: fontFamily(props.font), position: 'relative' }}>
      {/* Right brand block */}
      <div style={{ position: 'absolute', right: 0, top: 0, width: 340, height: H(props), background: accent, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {props.logoUrl
          ? <img src={props.logoUrl} width={getLogoSize(props.logoConfig?.size || 72)} height={getLogoSize(props.logoConfig?.size || 72)} style={{ borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size || 72), objectFit: 'contain' }} />
          : <div style={{ width: 72, height: 72, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex' }} />
        }
        {props.siteUrl ? (
          <div style={mergeTextStyle({ color: 'rgba(255,255,255,0.9)', fontSize: 18, fontWeight: 700, marginTop: 20, display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div>
        ) : null}
        <div style={{ width: 40, height: 2, background: 'rgba(255,255,255,0.3)', marginTop: 16, display: 'flex' }} />
      </div>
      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 80px', width: 860 }}>
        <div style={{ color: `${accent}cc`, fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24, display: 'flex' }}>NEW RELEASE</div>
        <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 800, lineHeight: 1.1, marginBottom: 20, display: 'flex', flexWrap: 'wrap' }, props.titleStyle)}>
          {props.title}
        </div>
        {props.description ? (
          <div style={mergeTextStyle({ color: `${fg}88`, fontSize: 22, lineHeight: 1.6, display: 'flex', flexWrap: 'wrap', maxWidth: 720 }, props.descriptionStyle)}>{props.description}</div>
        ) : null}
        {props.author ? (
          <div style={{ display: 'flex', marginTop: 36 }}>
            <div style={mergeTextStyle({ background: `${accent}22`, color: accent, border: `1px solid ${accent}44`, fontSize: 16, padding: '8px 20px', borderRadius: 8, display: 'flex' }, props.authorStyle)}>{props.author}</div>
          </div>
        ) : null}
        {props.date ? (
          <div style={mergeTextStyle({ color: `${fg}44`, fontSize: 14, marginTop: 12, display: 'flex' }, props.dateStyle)}>{props.date}</div>
        ) : null}
      </div>
    </div>
  );
};

// ===== code-style =====
export const CodeStyleTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#22c55e';
  const bg = props.backgroundColor || '#0d1117';
  const fg = props.textColor || '#e6edf3';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', flexDirection: 'column', fontFamily: fontFamily(props.font) }}>
      {/* Terminal titlebar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '18px 32px', background: '#161b22', borderBottom: `1px solid #30363d` }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 13, height: 13, borderRadius: 7, background: '#ff5f57', display: 'flex' }} />
          <div style={{ width: 13, height: 13, borderRadius: 7, background: '#febc2e', display: 'flex' }} />
          <div style={{ width: 13, height: 13, borderRadius: 7, background: '#28c840', display: 'flex' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: 6, padding: '4px 24px', color: '#8b949e', fontSize: 13, display: 'flex' }}>
            {props.siteUrl || 'snapog.com'}
          </div>
        </div>
      </div>
      {/* Code area */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '48px 64px', flex: 1, justifyContent: 'center' }}>
        <div style={{ display: 'flex', marginBottom: 8 }}>
          <div style={{ color: '#8b949e', fontSize: 18, marginRight: 16, display: 'flex', userSelect: 'none' }}>1</div>
          <div style={{ color: '#ff7b72', fontSize: 18, marginRight: 8, display: 'flex' }}>const</div>
          <div style={{ color: '#79c0ff', fontSize: 18, marginRight: 8, display: 'flex' }}>title</div>
          <div style={{ color: fg, fontSize: 18, display: 'flex' }}>=</div>
        </div>
        <div style={{ display: 'flex', marginBottom: 20, paddingLeft: 34 }}>
          <div style={{ color: '#8b949e', fontSize: 18, marginRight: 16, display: 'flex' }}>2</div>
          <div style={mergeTextStyle({ color: '#a5d6ff', fontSize: titleSize(props.title, W(props)) - 8, fontWeight: 700, lineHeight: 1.15, display: 'flex', flexWrap: 'wrap' }, props.titleStyle)}>
            &quot;{props.title}&quot;
          </div>
        </div>
        {props.description ? (
          <div style={{ display: 'flex', paddingLeft: 34 }}>
            <div style={{ color: '#8b949e', fontSize: 18, marginRight: 16, display: 'flex' }}>3</div>
            <div style={mergeTextStyle({ color: accent, fontSize: 20, display: 'flex' }, props.descriptionStyle)}>// {props.description}</div>
          </div>
        ) : null}
        {props.author ? (
          <div style={{ display: 'flex', marginTop: 20, paddingLeft: 34 }}>
            <div style={{ color: '#8b949e', fontSize: 18, marginRight: 16, display: 'flex' }}>4</div>
            <div style={mergeTextStyle({ color: '#8b949e', fontSize: 18, display: 'flex' }, props.authorStyle)}>/* {props.author} */</div>
          </div>
        ) : null}
        {props.date ? (
          <div style={{ display: 'flex', marginTop: 12, paddingLeft: 34 }}>
            <div style={{ color: '#8b949e', fontSize: 18, marginRight: 16, display: 'flex' }}>5</div>
            <div style={mergeTextStyle({ color: '#8b949e', fontSize: 16, display: 'flex' }, props.dateStyle)}>/* {props.date} */</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export const TEMPLATES = {
  'tech-dark': TechDarkTemplate,
  'tech-light': TechLightTemplate,
  'blog-clean': BlogCleanTemplate,
  'blog-card': BlogCardTemplate,
  'gradient-1': Gradient1Template,
  'gradient-2': Gradient2Template,
  'minimal-dark': MinimalDarkTemplate,
  'minimal-light': MinimalLightTemplate,
  'startup': StartupTemplate,
  'code-style': CodeStyleTemplate,
};

export const TEMPLATE_LABELS: Record<string, string> = {
  'tech-dark': 'Tech Dark',
  'tech-light': 'Tech Light',
  'blog-clean': 'Blog Clean',
  'blog-card': 'Blog Card',
  'gradient-1': 'Gradient Purple',
  'gradient-2': 'Gradient Coral',
  'minimal-dark': 'Minimal Dark',
  'minimal-light': 'Minimal Light',
  'startup': 'Startup',
  'code-style': 'Code Style',
};
