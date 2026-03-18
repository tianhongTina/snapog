// ===== Template & Font Types =====

export type TemplateId =
  | 'tech-dark'
  | 'tech-light'
  | 'blog-clean'
  | 'blog-card'
  | 'gradient-1'
  | 'gradient-2'
  | 'minimal-dark'
  | 'minimal-light'
  | 'startup'
  | 'code-style';

export type FontId =
  | 'inter'
  | 'roboto'
  | 'playfair'
  | 'mono';

// ===== OG Image Parameters =====

export interface TextStyle {
  color?: string;
  font?: FontId;
  size?: number;
}

export interface WatermarkConfig {
  enabled: boolean;
  text?: string;         // custom watermark text
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'tile';
  opacity?: number;      // 0-1
}

export interface LogoConfig {
  size?: number;                    // width in pixels (height auto-scales)
  shape?: 'square' | 'circle' | 'rounded'; // shape styling
}

export interface OGParams {
  template: TemplateId;
  title: string;
  description?: string;
  author?: string;
  date?: string;
  logoUrl?: string;
  siteUrl?: string;

  // Canvas dimensions
  width?: number;   // default 1200
  height?: number;  // default 630

  // Global style (fallback)
  font?: FontId;
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;

  // Per-field text styles (Pro/Business)
  titleStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  authorStyle?: TextStyle;
  dateStyle?: TextStyle;
  siteUrlStyle?: TextStyle;

  // Logo customization (Pro/Business)
  logoConfig?: LogoConfig;

  // Watermark config (Pro/Business)
  watermark?: boolean;
  watermarkConfig?: WatermarkConfig;
}

// ===== Database Types =====

export type Plan = 'free' | 'pro' | 'business';

export interface Profile {
  id: string;
  email: string;
  plan: Plan;
  created_at: string;
  updated_at: string;
  paypal_subscription_id?: string;
  subscription_status?: 'active' | 'cancelled' | 'expired' | null;
}

export interface UsageRecord {
  id: string;
  user_id: string;
  month: string; // YYYY-MM format
  count: number;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  key_hash: string;
  created_at: string;
  last_used_at?: string;
  is_active: boolean;
}

export interface OGHistory {
  id: string;
  user_id: string;
  params: OGParams;
  preview_url?: string;
  created_at: string;
}

// ===== API Types =====

export interface ExtractResult {
  title?: string;
  description?: string;
  image?: string;
  icon?: string;
  url: string;
}

export interface ApiKeyCreateResponse {
  id: string;
  name: string;
  key: string; // plain text, only shown once
  key_prefix: string;
  created_at: string;
}

export interface ApiKeyListItem {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at?: string;
  is_active: boolean;
}

// ===== Plan Limits =====

export interface PlanLimits {
  monthly_requests: number;
  watermark: boolean;
  custom_fonts: boolean;
  api_access: boolean;
  templates: number;
  price_monthly: number;
  price_label: string;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    monthly_requests: 50,
    watermark: true,
    custom_fonts: false,
    api_access: false,
    templates: 3,
    price_monthly: 0,
    price_label: 'Free',
  },
  pro: {
    monthly_requests: 1000,
    watermark: false,
    custom_fonts: true,
    api_access: true,
    templates: 10,
    price_monthly: 9,
    price_label: '$9/mo',
  },
  business: {
    monthly_requests: 10000,
    watermark: false,
    custom_fonts: true,
    api_access: true,
    templates: 10,
    price_monthly: 29,
    price_label: '$29/mo',
  },
};

// ===== Editor Store Types =====

export interface EditorState {
  params: OGParams;
  isGenerating: boolean;
  previewUrl: string;
  isDirty: boolean;
}

// ===== Rate Limit Types =====

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  reset: string;
}
