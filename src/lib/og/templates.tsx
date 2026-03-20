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

// Render background image layer (absolute positioned, behind content)
const BgImageLayer = (props: TemplateProps): ReactElement | null => {
  const { backgroundImageUrl, backgroundLayer, backgroundImageMode } = props;
  if (!backgroundImageUrl || backgroundLayer === 'color') return null;
  return (
    <img
      src={backgroundImageUrl}
      width={W(props)}
      height={H(props)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: W(props),
        height: H(props),
        objectFit: backgroundImageMode || 'cover',
        display: 'flex',
      }}
    />
  );
};

// ===== tech-dark =====
// Code-editor inspired layout: top accent bar, left gutter with line numbers,
// structured content area with terminal-style header and footer metadata bar.
export const TechDarkTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#00ff88';
  const bg = props.backgroundColor || '#0a0a0a';
  const fg = props.textColor || '#ffffff';
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';
  const gutterBg = bg === '#0a0a0a' ? '#111111' : `${bg}cc`;
  const gutterW = 56;
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', flexDirection: 'column', fontFamily: 'JetBrains Mono, monospace', position: 'relative' }}>
      <BgImageLayer {...props} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.65)', display: 'flex' }} />
      )}
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${accent} 0%, ${accent}88 60%, transparent 100%)`, display: 'flex' }} />
      {/* Terminal header bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', height: 44, background: gutterBg, borderBottom: `1px solid ${accent}18`, position: 'relative', marginTop: 3 }}>
        <div style={{ display: 'flex', gap: 7, marginRight: 20 }}>
          <div style={{ width: 11, height: 11, borderRadius: 6, background: '#ff5f57', display: 'flex' }} />
          <div style={{ width: 11, height: 11, borderRadius: 6, background: '#febc2e', display: 'flex' }} />
          <div style={{ width: 11, height: 11, borderRadius: 6, background: '#28c840', display: 'flex' }} />
        </div>
        {props.siteUrl ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {props.logoUrl ? (
              <img src={props.logoUrl} width={getLogoSize(props.logoConfig?.size || 18)} height={getLogoSize(props.logoConfig?.size || 18)} style={{ borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size || 18), objectFit: 'contain' }} />
            ) : null}
            <div style={mergeTextStyle({ color: `${fg}55`, fontSize: 13, letterSpacing: 1, display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div>
          </div>
        ) : (
          <div style={{ color: `${fg}33`, fontSize: 13, display: 'flex' }}>og-generator.ts</div>
        )}
        {/* Right side: accent pill */}
        <div style={{ marginLeft: 'auto', background: `${accent}18`, border: `1px solid ${accent}44`, borderRadius: 4, padding: '2px 10px', color: accent, fontSize: 11, letterSpacing: 1, display: 'flex' }}>
          TS
        </div>
      </div>
      {/* Main area: gutter + content */}
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Left gutter */}
        <div style={{ width: gutterW, background: gutterBg, borderRight: `1px solid ${accent}15`, display: 'flex', flexDirection: 'column', padding: '20px 0', alignItems: 'flex-end', paddingRight: 12, paddingLeft: 8, gap: 0 }}>
          {[1,2,3,4,5,6,7,8,9].map(n => (
            <div key={n} style={{ color: `${fg}20`, fontSize: 13, lineHeight: '30px', display: 'flex', fontVariantNumeric: 'tabular-nums' }}>{n}</div>
          ))}
        </div>
        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 64px 32px 40px', flex: 1 }}>
          <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 700, lineHeight: 1.1, marginBottom: 20, display: 'flex', flexWrap: 'wrap', maxWidth: 860 }, props.titleStyle)}>
            {props.title}
          </div>
          {props.description ? (
            <div style={mergeTextStyle({ color: `${fg}77`, fontSize: 22, lineHeight: 1.6, maxWidth: 760, display: 'flex', flexWrap: 'wrap' }, props.descriptionStyle)}>
              {props.description}
            </div>
          ) : null}
          {props.author ? (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: 32 }}>
              <div style={{ color: accent, fontSize: 15, marginRight: 8, display: 'flex' }}>{'>'}</div>
              <div style={mergeTextStyle({ color: `${fg}66`, fontSize: 16, display: 'flex' }, props.authorStyle)}>{props.author}</div>
            </div>
          ) : null}
          {props.date ? (
            <div style={mergeTextStyle({ color: `${fg}40`, fontSize: 14, marginTop: 8, marginLeft: 23, display: 'flex' }, props.dateStyle)}>{props.date}</div>
          ) : null}
        </div>
        {/* Right decorative column */}
        <div style={{ width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, paddingRight: 24 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ width: 24, height: 2, background: i === 2 ? accent : `${accent}${i === 1 || i === 3 ? '44' : '22'}`, borderRadius: 1, display: 'flex' }} />
          ))}
        </div>
      </div>
      {/* Footer bar */}
      <div style={{ display: 'flex', alignItems: 'center', height: 36, background: gutterBg, borderTop: `1px solid ${accent}18`, padding: '0 20px', gap: 20, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: 3, background: accent, display: 'flex' }} />
          <div style={{ color: accent, fontSize: 11, letterSpacing: 1, display: 'flex' }}>main</div>
        </div>
        <div style={{ color: `${fg}25`, fontSize: 11, display: 'flex' }}>UTF-8</div>
        <div style={{ color: `${fg}25`, fontSize: 11, display: 'flex' }}>TypeScript</div>
        <div style={{ marginLeft: 'auto', color: `${fg}25`, fontSize: 11, display: 'flex' }}>SnapOG</div>
      </div>
    </div>
  );
};

// ===== tech-light =====
export const TechLightTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#3b82f6';
  const bg = props.backgroundColor || '#ffffff';
  const fg = props.textColor || '#0f172a';
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', fontFamily: fontFamily(props.font), position: 'relative' }}>
      <BgImageLayer {...props} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.65)', display: 'flex' }} />
      )}
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
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 80px', width: 820, position: 'relative' }}>
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
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', flexDirection: 'column', fontFamily: fontFamily(props.font), padding: '72px 96px', justifyContent: 'space-between', position: 'relative' }}>
      <BgImageLayer {...props} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(250,250,249,0.75)', display: 'flex' }} />
      )}
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 28, borderTop: `2px solid ${accent}22`, position: 'relative' }}>
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
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';
  // Inner card color adapts to bg
  const cardBg = hasBgImage ? 'rgba(255,255,255,0.92)' : (bg === '#f1f5f9' || !props.backgroundColor ? '#ffffff' : `${bg}ee`);
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: fontFamily(props.font), position: 'relative' }}>
      <BgImageLayer {...props} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(241,245,249,0.35)', display: 'flex' }} />
      )}
      <div style={{ background: cardBg, borderRadius: 28, padding: '56px 72px', width: 1040, minHeight: 480, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 25px 60px rgba(0,0,0,0.12)', position: 'relative' }}>
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
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';
  return (
    <div style={{ width: W(props), height: H(props), background: hasBgImage ? (customBg || '#4f46e5') : bgStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: fontFamily(props.font), padding: '60px 80px', position: 'relative' }}>
      <BgImageLayer {...props} />
      {/* Background circles */}
      <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: 200, background: 'rgba(255,255,255,0.05)', display: 'flex' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, borderRadius: 140, background: 'rgba(255,255,255,0.06)', display: 'flex' }} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(79,70,229,0.6)', display: 'flex' }} />
      )}
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
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';
  return (
    <div style={{ width: W(props), height: H(props), background: hasBgImage ? (customBg || '#f97316') : bgStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: fontFamily(props.font), padding: '64px 96px', position: 'relative' }}>
      <BgImageLayer {...props} />
      {/* Decorative shapes */}
      <div style={{ position: 'absolute', top: 40, right: 60, width: 160, height: 160, borderRadius: 80, border: '2px solid rgba(255,255,255,0.15)', display: 'flex' }} />
      <div style={{ position: 'absolute', bottom: 30, right: 120, width: 80, height: 80, borderRadius: 40, background: 'rgba(255,255,255,0.1)', display: 'flex' }} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(239,68,68,0.55)', display: 'flex' }} />
      )}
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
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 100px', fontFamily: fontFamily(props.font), position: 'relative' }}>
      <BgImageLayer {...props} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(17,17,17,0.6)', display: 'flex' }} />
      )}
      {/* Subtle right accent */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg, transparent, ${accent}, transparent)`, display: 'flex' }} />
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
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
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 100px', fontFamily: fontFamily(props.font), position: 'relative' }}>
      <BgImageLayer {...props} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(250,250,250,0.7)', display: 'flex' }} />
      )}
      {/* Top left corner accent */}
      <div style={{ position: 'absolute', top: 48, left: 100, width: 48, height: 3, background: accent, display: 'flex' }} />
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20, position: 'relative' }}>
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
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', fontFamily: fontFamily(props.font), position: 'relative' }}>
      <BgImageLayer {...props} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.65)', display: 'flex' }} />
      )}
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
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 80px', width: 860, position: 'relative' }}>
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
  // titlebar color derived from bg for better integration
  const titlebarBg = props.backgroundColor ? `${bg}dd` : '#161b22';
  const borderColor = props.backgroundColor ? `${fg}15` : '#30363d';
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', flexDirection: 'column', fontFamily: fontFamily(props.font), position: 'relative' }}>
      <BgImageLayer {...props} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,17,23,0.7)', display: 'flex' }} />
      )}
      {/* Terminal titlebar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '18px 32px', background: titlebarBg, borderBottom: `1px solid ${borderColor}`, position: 'relative' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 13, height: 13, borderRadius: 7, background: '#ff5f57', display: 'flex' }} />
          <div style={{ width: 13, height: 13, borderRadius: 7, background: '#febc2e', display: 'flex' }} />
          <div style={{ width: 13, height: 13, borderRadius: 7, background: '#28c840', display: 'flex' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 6, padding: '4px 24px', color: `${fg}55`, fontSize: 13, display: 'flex' }}>
            {props.siteUrl || 'snapog.com'}
          </div>
        </div>
      </div>
      {/* Code area */}
      <div style={{ display: 'flex', flexDirection: 'column', padding: '48px 64px', flex: 1, justifyContent: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', marginBottom: 8 }}>
          <div style={{ color: `${fg}44`, fontSize: 18, marginRight: 16, display: 'flex', userSelect: 'none' }}>1</div>
          <div style={{ color: '#ff7b72', fontSize: 18, marginRight: 8, display: 'flex' }}>const</div>
          <div style={{ color: '#79c0ff', fontSize: 18, marginRight: 8, display: 'flex' }}>title</div>
          <div style={{ color: fg, fontSize: 18, display: 'flex' }}>=</div>
        </div>
        <div style={{ display: 'flex', marginBottom: 20, paddingLeft: 34 }}>
          <div style={{ color: `${fg}44`, fontSize: 18, marginRight: 16, display: 'flex' }}>2</div>
          <div style={mergeTextStyle({ color: '#a5d6ff', fontSize: titleSize(props.title, W(props)) - 8, fontWeight: 700, lineHeight: 1.15, display: 'flex', flexWrap: 'wrap' }, props.titleStyle)}>
            &quot;{props.title}&quot;
          </div>
        </div>
        {props.description ? (
          <div style={{ display: 'flex', paddingLeft: 34 }}>
            <div style={{ color: `${fg}44`, fontSize: 18, marginRight: 16, display: 'flex' }}>3</div>
            <div style={mergeTextStyle({ color: accent, fontSize: 20, display: 'flex' }, props.descriptionStyle)}>// {props.description}</div>
          </div>
        ) : null}
        {props.author ? (
          <div style={{ display: 'flex', marginTop: 20, paddingLeft: 34 }}>
            <div style={{ color: `${fg}44`, fontSize: 18, marginRight: 16, display: 'flex' }}>4</div>
            <div style={mergeTextStyle({ color: `${fg}55`, fontSize: 18, display: 'flex' }, props.authorStyle)}>/* {props.author} */</div>
          </div>
        ) : null}
        {props.date ? (
          <div style={{ display: 'flex', marginTop: 12, paddingLeft: 34 }}>
            <div style={{ color: `${fg}44`, fontSize: 18, marginRight: 16, display: 'flex' }}>5</div>
            <div style={mergeTextStyle({ color: `${fg}44`, fontSize: 16, display: 'flex' }, props.dateStyle)}>/* {props.date} */</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ===== tech-blog =====
export const TechBlogTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#6366f1';
  const bg = props.backgroundColor || '#0f0f23';
  const fg = props.textColor || '#e2e8f0';
  const badge = props.badge || '#TypeScript';
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', fontFamily: fontFamily(props.font), position: 'relative' }}>
      <BgImageLayer {...props} />
      {/* Grid pattern overlay */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle, ${accent}11 1px, transparent 1px)`, backgroundSize: '32px 32px', display: 'flex' }} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,35,0.72)', display: 'flex' }} />
      )}
      {/* Left gutter line */}
      <div style={{ position: 'absolute', left: 72, top: 0, bottom: 0, width: 1, background: `${accent}22`, display: 'flex' }} />
      {/* Line numbers */}
      <div style={{ position: 'absolute', left: 28, top: 60, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <div key={n} style={{ color: `${fg}22`, fontSize: 12, display: 'flex', width: 28, justifyContent: 'flex-end' }}>{n}</div>
        ))}
      </div>
      {/* Content area */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 80px 60px 112px', flex: 1, position: 'relative' }}>
        {/* Top row: badge + site */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: `${accent}22`, border: `1px solid ${accent}55`, color: accent, fontSize: 14, fontWeight: 600, padding: '5px 14px', borderRadius: 6, display: 'flex', letterSpacing: 0.5 }}>
              {badge}
            </div>
            {props.date ? (
              <div style={mergeTextStyle({ color: `${fg}44`, fontSize: 14, display: 'flex' }, props.dateStyle)}>{props.date}</div>
            ) : null}
          </div>
          {props.siteUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {props.logoUrl ? <img src={props.logoUrl} width={getLogoSize(props.logoConfig?.size || 22)} height={getLogoSize(props.logoConfig?.size || 22)} style={{ borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size || 22), objectFit: 'contain' }} /> : null}
              <div style={mergeTextStyle({ color: `${fg}55`, fontSize: 15, display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div>
            </div>
          ) : null}
        </div>
        {/* Middle: main content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', paddingTop: 28, paddingBottom: 20 }}>
          <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 800, lineHeight: 1.1, marginBottom: 20, display: 'flex', flexWrap: 'wrap', maxWidth: 920 }, props.titleStyle)}>
            {props.title}
          </div>
          {props.description ? (
            <div style={mergeTextStyle({ color: `${fg}77`, fontSize: 22, lineHeight: 1.65, maxWidth: 840, display: 'flex', flexWrap: 'wrap' }, props.descriptionStyle)}>{props.description}</div>
          ) : null}
        </div>
        {/* Bottom row: author */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {props.author ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: `${accent}33`, border: `2px solid ${accent}66`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: accent, fontSize: 15, fontWeight: 700, display: 'flex' }}>{props.author.charAt(0).toUpperCase()}</div>
              </div>
              <div style={mergeTextStyle({ color: `${fg}88`, fontSize: 17, fontWeight: 500, display: 'flex' }, props.authorStyle)}>{props.author}</div>
            </div>
          ) : <div />}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: accent, display: 'flex' }} />
            <div style={{ width: 6, height: 6, borderRadius: 3, background: `${accent}66`, display: 'flex' }} />
            <div style={{ width: 6, height: 6, borderRadius: 3, background: `${accent}33`, display: 'flex' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== ecommerce =====
export const EcommerceTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#f59e0b';
  const bg = props.backgroundColor || '#ffffff';
  const fg = props.textColor || '#111827';
  const badge = props.badge || 'NEW';
  const price = props.price || '';
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';
  const isDark = fg === '#ffffff' || fg === '#f5f5f5' || fg === '#e2e8f0';
  const panelBg = isDark ? 'rgba(255,255,255,0.1)' : '#ffffff';
  const panelBorder = isDark ? 'rgba(255,255,255,0.2)' : '#e5e7eb';
  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', fontFamily: fontFamily(props.font), position: 'relative' }}>
      <BgImageLayer {...props} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.6)', display: 'flex' }} />
      )}
      {/* Diagonal accent strip */}
      <div style={{ position: 'absolute', right: 0, top: 0, width: 320, height: H(props), background: `${accent}10`, borderLeft: `2px solid ${accent}22`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        {/* Badge */}
        <div style={{ background: accent, color: '#ffffff', fontSize: 18, fontWeight: 800, padding: '10px 28px', borderRadius: 8, letterSpacing: 2, textTransform: 'uppercase', display: 'flex' }}>
          {badge}
        </div>
        {/* Price */}
        {price ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: `${fg}44`, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', display: 'flex' }}>Price</div>
            <div style={{ color: accent, fontSize: 44, fontWeight: 900, lineHeight: 1.1, marginTop: 4, display: 'flex' }}>{price}</div>
          </div>
        ) : null}
        {/* Logo */}
        {props.logoUrl ? (
          <img src={props.logoUrl} width={getLogoSize(props.logoConfig?.size || 56)} height={getLogoSize(props.logoConfig?.size || 56)} style={{ borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size || 56), objectFit: 'contain' }} />
        ) : null}
      </div>
      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 80px', width: 880, position: 'relative' }}>
        {/* Top: site branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 4, height: 24, background: accent, borderRadius: 2, display: 'flex' }} />
          {props.siteUrl ? (
            <div style={mergeTextStyle({ color: `${fg}66`, fontSize: 16, fontWeight: 600, letterSpacing: 1, display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div>
          ) : null}
        </div>
        {/* Middle: product info */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', paddingTop: 20, paddingBottom: 20 }}>
          <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 800, lineHeight: 1.1, marginBottom: 20, display: 'flex', flexWrap: 'wrap', maxWidth: 760 }, props.titleStyle)}>
            {props.title}
          </div>
          {props.description ? (
            <div style={mergeTextStyle({ color: `${fg}77`, fontSize: 22, lineHeight: 1.6, maxWidth: 700, display: 'flex', flexWrap: 'wrap' }, props.descriptionStyle)}>{props.description}</div>
          ) : null}
        </div>
        {/* Bottom: CTA bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ background: accent, color: '#ffffff', fontSize: 17, fontWeight: 700, padding: '12px 32px', borderRadius: 10, display: 'flex' }}>
            Get Started →
          </div>
          {props.author ? (
            <div style={mergeTextStyle({ color: `${fg}55`, fontSize: 16, display: 'flex' }, props.authorStyle)}>{props.author}</div>
          ) : null}
          {props.date ? (
            <div style={mergeTextStyle({ color: `${fg}44`, fontSize: 14, display: 'flex' }, props.dateStyle)}>{props.date}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ===== saas-product =====
export const SaasProductTemplate = (props: TemplateProps): ReactElement => {
  const accent = props.primaryColor || '#0ea5e9';
  const bg = props.backgroundColor || '#020817';
  const fg = props.textColor || '#f1f5f9';
  const badge = props.badge || 'SaaS';
  const hasBgImage = props.backgroundImageUrl && props.backgroundLayer !== 'color';

  const metrics = [
    { label: props.metric1Label || 'Users', value: props.metric1Value || '10K+' },
    { label: props.metric2Label || 'Uptime', value: props.metric2Value || '99.9%' },
    { label: props.metric3Label || 'Speed', value: props.metric3Value || '< 100ms' },
  ].filter(m => m.value);

  return (
    <div style={{ width: W(props), height: H(props), background: bg, display: 'flex', flexDirection: 'column', fontFamily: fontFamily(props.font), position: 'relative' }}>
      <BgImageLayer {...props} />
      {/* Top gradient mesh */}
      <div style={{ position: 'absolute', top: -120, right: -80, width: 480, height: 480, borderRadius: 240, background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`, display: 'flex' }} />
      <div style={{ position: 'absolute', bottom: -80, left: -60, width: 320, height: 320, borderRadius: 160, background: `radial-gradient(circle, ${accent}10 0%, transparent 70%)`, display: 'flex' }} />
      {hasBgImage && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,8,23,0.72)', display: 'flex' }} />
      )}
      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '56px 80px', flex: 1, position: 'relative' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {props.logoUrl ? (
              <img src={props.logoUrl} width={getLogoSize(props.logoConfig?.size || 32)} height={getLogoSize(props.logoConfig?.size || 32)} style={{ borderRadius: getLogoBorderRadius(props.logoConfig?.shape, props.logoConfig?.size || 32), objectFit: 'contain' }} />
            ) : null}
            {props.siteUrl ? (
              <div style={mergeTextStyle({ color: `${fg}88`, fontSize: 17, fontWeight: 700, letterSpacing: 0.5, display: 'flex' }, props.siteUrlStyle)}>{props.siteUrl}</div>
            ) : null}
          </div>
          <div style={{ background: `${accent}20`, border: `1px solid ${accent}50`, color: accent, fontSize: 13, fontWeight: 700, padding: '5px 16px', borderRadius: 20, letterSpacing: 1, textTransform: 'uppercase', display: 'flex' }}>
            {badge}
          </div>
        </div>
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', paddingTop: 16 }}>
          <div style={mergeTextStyle({ color: fg, fontSize: titleSize(props.title, W(props)), fontWeight: 800, lineHeight: 1.1, marginBottom: 18, display: 'flex', flexWrap: 'wrap', maxWidth: 920 }, props.titleStyle)}>
            {props.title}
          </div>
          {props.description ? (
            <div style={mergeTextStyle({ color: `${fg}77`, fontSize: 22, lineHeight: 1.6, maxWidth: 840, display: 'flex', flexWrap: 'wrap' }, props.descriptionStyle)}>{props.description}</div>
          ) : null}
          {props.author ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 28 }}>
              <div style={{ width: 28, height: 2, background: accent, display: 'flex' }} />
              <div style={mergeTextStyle({ color: `${fg}66`, fontSize: 17, display: 'flex' }, props.authorStyle)}>{props.author}</div>
              {props.date ? <div style={mergeTextStyle({ color: `${fg}44`, fontSize: 14, display: 'flex' }, props.dateStyle)}>{props.date}</div> : null}
            </div>
          ) : null}
        </div>
        {/* Bottom: metrics grid */}
        {metrics.length > 0 ? (
          <div style={{ display: 'flex', gap: 16, paddingTop: 20 }}>
            {metrics.map((m, idx) => (
              <div key={idx} style={{ flex: 1, background: `${accent}0d`, border: `1px solid ${accent}22`, borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ color: accent, fontSize: 28, fontWeight: 800, lineHeight: 1, display: 'flex' }}>{m.value}</div>
                <div style={{ color: `${fg}55`, fontSize: 14, display: 'flex' }}>{m.label}</div>
              </div>
            ))}
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
  'tech-blog': TechBlogTemplate,
  'ecommerce': EcommerceTemplate,
  'saas-product': SaasProductTemplate,
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
  'tech-blog': 'Tech Blog',
  'ecommerce': 'E-commerce',
  'saas-product': 'SaaS Product',
};

export const TEMPLATE_CATEGORIES: { label: string; ids: string[] }[] = [
  {
    label: 'General Templates',
    ids: ['tech-dark', 'tech-light', 'blog-clean', 'blog-card', 'gradient-1', 'gradient-2', 'minimal-dark', 'minimal-light', 'startup', 'code-style'],
  },
  {
    label: 'Vertical Scenarios',
    ids: ['tech-blog', 'ecommerce', 'saas-product'],
  },
];
